const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');
const { sendBookingConfirmationEmail } = require('../utils/email');

exports.createBooking = async (req, res, next) => {
  const { eventId, seatsBooked, paymentMethod } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    let amountPaid = 0;
    const updatedSeats = event.seats.map(seat => {
      if (seatsBooked.includes(seat.seatNumber)) {
        amountPaid += seat.price;
        return { ...seat.toObject(), isBooked: true };
      }
      return seat;
    });

    event.seats = updatedSeats;
    await event.save();

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