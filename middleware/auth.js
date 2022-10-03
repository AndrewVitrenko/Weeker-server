const jwt = require('jsonwebtoken');

const ERRORS = require('../config/errors');
const TOKEN_KEY = process.env.TOKEN_KEY;

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    res.status(403).json({
      message: ERRORS.TOKEN_REQUIRED,
    });
    return;
  }

  try {
    const user = jwt.verify(token, TOKEN_KEY);
    req.user = user;
  } catch (e) {
    res.status(401).json({
      message: ERRORS.TOKEN_EXPIRED,
    });
    return;
  }

  return next();
};

module.exports = authMiddleware;
