const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Users = require('../models');

const TOKEN_KEY = process.env.TOKEN_KEY;

const internalServerError = 'An error occurred on server. Reload and try again';
const userNotFoundError = 'User was not found. Check your email';

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({
        message: 'Need both, email and password',
      });
    }
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: userNotFoundError,
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
        message: 'Wrong credentials',
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: internalServerError,
    });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, surname, phone } = req.body;
    if (!(email && password && name && surname)) {
      return res.status(400).json({
        message: 'All inputs are required',
      });
    }
    const user = await Users.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: 'User is alredy registered',
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
      message: internalServerError,
    });
  }
});

module.exports = router;
