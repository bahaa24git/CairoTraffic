import User from '../models/User.js';
import { createToken } from '../utils.js';

export const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'fullName, email and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    const user = await User.create({ fullName, email, password, role: 'user' });
    const token = createToken(user);

    return res.status(201).json({ token, user: user.toSafeJSON() });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'This account is inactive.' });
    }

    const updatedUser = await User.updateLastLogin(user.id);
    const token = createToken(updatedUser);

    return res.json({ token, user: updatedUser.toSafeJSON() });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  return res.json({ user: req.user.toSafeJSON() });
};
