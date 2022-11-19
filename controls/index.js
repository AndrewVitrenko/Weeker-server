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

router.get('/todos', authMiddleware, async (req, res) => {
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

router.post('/todo', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;
    const { text, startTime, endTime, background } = req.body;

    if (!text) {
      res.status(400).json({
        message: ERRORS.TODO_TEXT_REQUIRED,
      });
      return;
    }

    if (!startTime) {
      res.status(400).json({
        message: ERRORS.TODO_START_REQUIRED,
      });
      return;
    }

    if (!endTime) {
      res.status(400).json({
        message: ERRORS.TODO_END_REQUIRED,
      });
      return;
    }

    const user = await Users.findById(userId);

    if (!user) {
      res.status(404).json({
        message: ERRORS.USER_NOT_FOUND,
      });
      return;
    }

    const id = crypto.randomBytes(10).toString('hex');
    const finalTodo = {
      _id: id,
      startTime,
      endTime,
      text,
      background: background || null,
    };

    user.tasks.push(finalTodo);
    await user.save();

    res.status(201).json({
      todo: finalTodo,
    });
  } catch (e) {
    res.status(500).json({
      message: ERRORS.INTERNAL_SERVER_ERROR,
    });
  }
});

router.patch('/todo/:todoId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;
    const { todoId } = req.params;
    const todo = req.body;

    if (!todo) {
      res.status(400).json({
        message: ERRORS.TODO_REQUIRED,
      });
      return;
    }

    const user = await Users.findById(userId);

    if (!user) {
      res.status(404).json({
        message: ERRORS.USER_NOT_FOUND,
      });
      return;
    }

    const todoIndex = user.tasks.findIndex(task => task._id === todoId);

    if (todoIndex === -1) {
      res.status(404).json({
        message: ERRORS.TODO_NOT_FOUND,
      });
      return;
    }

    user.tasks[todoIndex] = {
      ...user.tasks[todoIndex]._doc,
      ...todo,
    };

    await user.save();
    res.status(200).json({
      todo: user.tasks[todoIndex],
    });
  } catch (e) {
    res.status(500).json({
      message: ERRORS.INTERNAL_SERVER_ERROR,
    });
  }
});

router.delete('/todo/:todoId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;
    const { todoId } = req.params;

    const user = await Users.findById(userId);

    if (!user) {
      res.status(404).json({
        message: ERRORS.USER_NOT_FOUND,
      });
      return;
    }

    const todo = user.tasks.find(task => task._id === todoId);

    if (!todo) {
      res.status(404).json({
        message: ERRORS.TODO_NOT_FOUND,
      });
      return;
    }

    user.tasks = user.tasks.filter(task => task._id !== todoId);

    await user.save();
    res.status(200).json({
      message: 'Todo was successfully deleted',
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: ERRORS.INTERNAL_SERVER_ERROR,
    });
  }
});

module.exports = router;
