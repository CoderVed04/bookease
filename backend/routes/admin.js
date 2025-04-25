const express = require('express');
const { addEvent, updateEvent, deleteEvent, getAllUsers } = require('../controllers/adminController');
const { getAllBookings } = require('../controllers/bookingController');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

const adminOnly = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user || !user.isAdmin) return res.status(403).json({ msg: 'Access denied' });
      next();
    } catch (error) {
      next(error);
    }
  };

router.post(
  '/events',
  auth,
  adminOnly,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('category').isIn(['Movie', 'Concert', 'Play']).withMessage('Valid category is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('date').isISO8601().toDate().withMessage('Valid date is required'),
    body('time').notEmpty().withMessage('Time is required')
  ],
  validate,
  addEvent
);

router.put('/events/:id', auth, adminOnly, updateEvent);
router.delete('/events/:id', auth, adminOnly, deleteEvent);
router.get('/bookings', auth, adminOnly, getAllBookings);
router.get('/users', auth, adminOnly, getAllUsers);

module.exports = router;