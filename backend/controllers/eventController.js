const Event = require('../models/Event');

exports.getAllEvents = async (req, res) => {
  const events = await Event.find();
  res.json(events);
};

exports.getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ msg: 'Event not found' });
  res.json(event);
};

exports.getEventsByCategory = async (req, res) => {
  const events = await Event.find({ category: req.params.type });
  res.json(events);
};