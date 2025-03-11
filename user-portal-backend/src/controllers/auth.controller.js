const config = require('../config/config');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const generateToken = (data) => {
  return jwt.sign({ data }, config.jwtSecret, {
    expiresIn: config.jwtExpiration,
  });
};

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Check if user is already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists.',
      });
    }

    user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
    });

    await user.save();

    //Generate token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      message: 'User registered successfully',
    });
  } catch (err) {
    console.error('Error registering user', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

exports.login = async (req, res) => {

  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exists please sign up first.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }

    if (user.role != 'admin') {
      return res.status(401).json({
        success: false,
        message: 'You are not allowed to login from here',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Error registering user', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
