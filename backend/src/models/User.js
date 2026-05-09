import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const toSafeJSON = (user) => {
  if (!user) return null;
  return {
    id: String(user.id),
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isActive: Boolean(user.isActive),
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  };
};

const attachMethods = (user) => {
  if (!user) return null;
  return {
    ...user,
    isActive: Boolean(user.isActive),
    comparePassword(candidatePassword) {
      return bcrypt.compare(candidatePassword, user.password);
    },
    toSafeJSON() {
      return toSafeJSON(user);
    },
  };
};

const User = {
  async create({ fullName, email, password, role = 'user' }) {
    const cleanFullName = String(fullName || '').trim();
    const cleanEmail = normalizeEmail(email);

    if (cleanFullName.length < 2 || cleanFullName.length > 80) {
      const error = new Error('Full name must be between 2 and 80 characters.');
      error.statusCode = 400;
      throw error;
    }

    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      const error = new Error('Email is invalid.');
      error.statusCode = 400;
      throw error;
    }

    if (String(password || '').length < 6) {
      const error = new Error('Password must be at least 6 characters.');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = db.prepare(`
      INSERT INTO users (fullName, email, password, role)
      VALUES (?, ?, ?, ?)
    `).run(cleanFullName, cleanEmail, hashedPassword, role);

    return this.findById(result.lastInsertRowid);
  },

  async findOne({ email }) {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizeEmail(email));
    return attachMethods(user);
  },

  async findById(id) {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    return attachMethods(user);
  },

  async updateLastLogin(id) {
    const lastLoginAt = new Date().toISOString();
    db.prepare('UPDATE users SET lastLoginAt = ? WHERE id = ?').run(lastLoginAt, id);
    return this.findById(id);
  },

  async deleteOne({ email }) {
    db.prepare('DELETE FROM users WHERE email = ?').run(normalizeEmail(email));
  },

  toSafeJSON,
};

export default User;
