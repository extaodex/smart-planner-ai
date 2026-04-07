const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

const SECRET = process.env.JWT_SECRET || 'smart_planner_secret_key!@#';

// Fallback user store if MongoDB is down
let memUsers = [];

const isMongoConnected = () => mongoose.connection.readyState === 1;

// @route   POST api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Champs obligatoires' });

  try {
    if (isMongoConnected()) {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ error: 'Cet utilisateur existe déjà' });
      user = new User({ name, email, password });
      await user.save();
      const payload = { user: { id: user.id } };
      jwt.sign(payload, SECRET, { expiresIn: '7d' }, (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
      });
      return;
    }

    // In-Memory fallback for testing
    let user = memUsers.find(u => u.email === email);
    if (user) return res.status(400).json({ error: 'Cet utilisateur existe déjà' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = { id: Date.now().toString(), name, email, password: hash };
    memUsers.push(newUser);
    const payload = { user: { id: newUser.id } };
    jwt.sign(payload, SECRET, { expiresIn: '7d' }, (err, token) => {
      res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur Serveur' });
  }
});

// @route   POST api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    if (isMongoConnected()) {
      let user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'Identifiants invalides' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: 'Identifiants invalides' });
      const payload = { user: { id: user.id } };
      jwt.sign(payload, SECRET, { expiresIn: '7d' }, (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
      });
      return;
    }

    // In-Memory Login
    let user = memUsers.find(u => u.email === email);
    if (!user) return res.status(400).json({ error: 'Identifiants invalides' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Identifiants invalides' });
    const payload = { user: { id: user.id } };
    jwt.sign(payload, SECRET, { expiresIn: '7d' }, (err, token) => {
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur Serveur' });
  }
});

// @route   GET api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    if (isMongoConnected()) {
      const user = await User.findById(req.user.id).select('-password');
      return res.json(user);
    }
    const user = memUsers.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: 'Erreur Serveur' });
  }
});

module.exports = router;
