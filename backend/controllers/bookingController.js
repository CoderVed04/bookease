const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');
const { sendBookingConfirmationEmail } = require('../utils/email');

exports.createBooking = async (req, res, next) => {
  const { eventId, seatsBooked, amountPaid, paymentMethod } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    // Mark selected seats as booked
    event.seats = event.seats.map(seat =>
      seatsBooked.includes(seat.seatNumber) ? { ...seat.toObject(), isBooked: true } : seat
    );
    await event.save();

    // Create fake transaction ID
    const fakeTransactionId = `TXN_${Date.now()}`;

    const booking = new Booking({
      user: req.user.id,
      event: eventId,
      seatsBooked,
      amountPaid,
      paymentMethod,
      transactionId: fakeTransactionId,
      paymentStatus: 'Paid',
    });
    await booking.save();

    // Send booking confirmation email
    const user = await User.findById(req.user.id);
    await sendBookingConfirmationEmail(user.email, {
      event: event.title,
      seatsBooked,
      amountPaid,
      paymentStatus: 'Paid',
    });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('event');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user').populate('event');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};