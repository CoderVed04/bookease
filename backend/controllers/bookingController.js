const Booking = require('../models/Booking');
const Event = require('../models/Event');

exports.createBooking = async (req, res) => {
  const { eventId, seatsBooked, amountPaid, paymentMethod } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    // Mark selected seats as booked
    event.seats = event.seats.map(seat =>
      seatsBooked.includes(seat.seatNumber) ? { ...seat.toObject(), isBooked: true } : seat
    );
    await event.save();

    // Create a fake transaction ID for mock payment
    const fakeTransactionId = `TXN_${Date.now()}`;

    const booking = new Booking({
      user: req.user.id,
      event: eventId,
      seatsBooked,
      amountPaid,
      paymentMethod,
      transactionId: fakeTransactionId,
      paymentStatus: 'Paid'
    });
    await booking.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).send('Server error');
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