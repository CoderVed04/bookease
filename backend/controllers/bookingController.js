const Booking = require('../models/Booking');
const Event = require('../models/Event');

exports.createBooking = async (req, res) => {
  const { eventId, seatsBooked, amountPaid, paymentMethod } = req.body;
  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    event.seats = event.seats.map(seat =>
      seatsBooked.includes(seat.seatNumber) ? { ...seat.toObject(), isBooked: true } : seat
    );
    await event.save();

    const booking = new Booking({
      user: req.user.id,
      event: eventId,
      seatsBooked,
      amountPaid,
      paymentMethod,
      paymentStatus: 'Paid',
    });
    await booking.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id }).populate('event');
  res.json(bookings);
};

exports.getAllBookings = async (req, res) => {
  const bookings = await Booking.find().populate('user').populate('event');
  res.json(bookings);
};
