const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { protect, SECRET } = require('../middleware/authMiddleware');

const router = express.Router();
const usersPath = path.join(__dirname, '../data/users.json');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, SECRET, { expiresIn: '30d' });
};

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user.id)
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// Register
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

  const userExists = users.find(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    isAdmin: false
  };

  users.push(newUser);
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

  res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
    token: generateToken(newUser.id)
  });
});

// Get User Profile
router.get('/profile', protect, (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    isAdmin: req.user.isAdmin
  });
});

// Get All Users (Admin Only)
router.get('/users', protect, (req, res) => {
  if (req.user && req.user.isAdmin) {
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    res.json(users);
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
});

module.exports = router;
