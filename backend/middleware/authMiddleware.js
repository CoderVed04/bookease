const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);

    req.user = {
      id: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};


exports.superAdminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== 'SuperAdmin') {
      return res.status(403).json({ message: 'Access denied. SuperAdmin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.adminOnly = async (req, res, next) => {
  try {
    console.log("Checking admin for user ID:", req.user?.id);
    const user = await User.findById(req.user?.id);
    if (!user) {
      console.log("User not found");
    } else {
      console.log("User role:", user.role);
    }

    if (!user || (user.role !== 'Admin' && user.role !== 'SuperAdmin')) {
      return res.status(403).json({ message: 'Access denied. Admin or SuperAdmin only.' });
    }
    next();
  } catch (error) {
    console.error("adminOnly error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};
