const express = require('express');
const { addEvent, updateEvent, deleteEvent, getAllUsers } = require('../controllers/adminController');
const { getAllBookings } = require('../controllers/bookingController');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const User = require('../models/User');
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
  upload.single('image'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
    body('category').isIn(['Movie', 'Concert', 'Play']).withMessage('Valid category is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('date').isISO8601().toDate().withMessage('Valid date is required'),
    body('time').notEmpty().withMessage('Time is required'),
    body('seatAllocation').notEmpty().withMessage('Seat allocation is required'),
    body('seatAllocation.*.seatType').isIn(['VIP', 'Normal']).withMessage('Seat type must be VIP or Normal'),
    body('seatAllocation.*.rows').isInt({ min: 1 }).withMessage('Rows must be a positive integer'),
    body('seatAllocation.*.seatsPerRow').isInt({ min: 1 }).withMessage('Seats per row must be a positive integer'),
    body('seatAllocation.*.price').isNumeric().withMessage('Price must be a number')
  ],
  validate,
  addEvent
);

router.put('/events/:id', auth, adminOnly, upload.single('image'), updateEvent);
router.delete('/events/:id', auth, adminOnly, deleteEvent);
router.get('/bookings', auth, adminOnly, getAllBookings);
router.get('/users', auth, adminOnly, getAllUsers);

module.exports = router;