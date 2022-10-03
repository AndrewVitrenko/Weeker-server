const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Users = require('../models');
const authMiddleware = require('../middleware/auth');

const TOKEN_KEY = process.env.TOKEN_KEY;

const ERRORS = require('../config/errors');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({
        message: ERRORS.ALL_FIELDS_REQUIRED,
      });
    }
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: ERRORS.USER_NOT_FOUND,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      const token = jwt.sign({ userId: user._id }, TOKEN_KEY, {
        expiresIn: '3h',
      });
      res.status(200).json({ token });
    } else {
      res.status(401).json({
        message: ERRORS.WRONG_CREDENTIALS,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: ERRORS.INTERNAL_SERVER_ERROR,
    });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, surname, phone } = req.body;
    if (!(email && password && name && surname)) {
      return res.status(400).json({
        message: ERRORS.ALL_FIELDS_REQUIRED,
      });
    }
    const user = await Users.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: ERRORS.USER_REGISTERED,
      });
    }

    const newUser = await Users.create({
      _id: crypto.randomBytes(20).toString('hex'),
      email,
      name,
      surname,
      phone: phone || '',
      tasks: [],
      password: await bcrypt.hash(password, await bcrypt.genSalt()),
    });
    const token = jwt.sign({ userId: newUser._id }, TOKEN_KEY, {
      expiresIn: '3h',
    });
    res.status(201).json({ token });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: ERRORS.INTERNAL_SERVER_ERROR,
    });
  }
});

router.get('/getTodos', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await Users.findById(userId);

    if (!user) {
      res.status(404).json({
        messgae: ERRORS.USER_NOT_FOUND,
      });
      return;
    }

    res.status(200).json({
      todos: user.tasks,
    });
  } catch (e) {
    res.status(500).json({
      message: ERRORS.INTERNAL_SERVER_ERROR,
    });
  }
});

module.exports = router;
