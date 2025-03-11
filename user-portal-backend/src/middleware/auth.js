const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');

exports.authorizeUser = async (req, res) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized user',
    });
  }

  try {
    const decodedToken = jwt.verify(token, config.jwtSecret);

    req.user = await User.findById(decodedToken._id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    next();
  } catch (err) {
    console.error('Error in checking token ', err);
    return res.status(401).json({ message: 'Unauthorized user' });
  }
};
