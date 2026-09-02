const bcrypt = require('bcryptjs');
const { User } = require('../models');
const generateToken = require('../utils/generateToken');


const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(user.id);
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email, currency: user.currency },
    });
  } catch (err) {
    next(err);
  }
};


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user.id);
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email, currency: user.currency },
    });
  } catch (err) {
    next(err);
  }
};


const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

module.exports = { register, login, getMe };
