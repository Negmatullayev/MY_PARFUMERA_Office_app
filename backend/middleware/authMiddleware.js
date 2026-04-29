const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const SECRET = 'parfumeriya_secret_key'; // in real app use dotenv

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, SECRET);
      
      const usersPath = path.join(__dirname, '../data/users.json');
      const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
      
      req.user = users.find(u => u.id === decoded.id);
      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin, SECRET };
