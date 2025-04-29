const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

exports.getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

exports.blockUser = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.isBlocked = true;
  await user.save();
  res.json({ message: 'User blocked successfully' });
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  await User.findByIdAndDelete(userId);
  res.json({ message: 'User deleted successfully' });
};

exports.getAllEvents = async (req, res) => {
  const events = await Event.find({});
  res.json(events);
};

exports.getAllBookings = async (req, res) => {
  const bookings = await Booking.find({}).populate('user').populate('event');
  res.json(bookings);
};

exports.updateUserRole = async (req, res) => {
  const { userId, role } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.role = role;
  await user.save();
  res.json({ message: `User role updated to ${role}` });
};
