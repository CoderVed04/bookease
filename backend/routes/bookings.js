const express = require('express');
const { createBooking, getUserBookings, getAllBookings } = require('../controllers/bookingController');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const router = express.Router();

router.post(
  '/',
  auth,
  [
    body('eventId').notEmpty().withMessage('Event ID is required'),
    body('seatsBooked').isArray({ min: 1 }).withMessage('At least one seat must be booked'),
    body('amountPaid').isNumeric().withMessage('Amount must be a number'),
    body('paymentMethod').isIn(['Razorpay', 'Stripe']).withMessage('Valid payment method is required')
  ],
  validate,
  createBooking
);

router.get('/my',  getUserBookings);

module.exports = router;
