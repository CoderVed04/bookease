const Event = require('../models/Event');
const User = require('../models/User');

const generateSeats = (seatAllocation) => {
  const seats = [];
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  seatAllocation.forEach(sa => {
    const seatType = sa.seatType;
    const rows = sa.rows;
    const seatsPerRow = sa.seatsPerRow;
    const price = sa.price;

    for (let i = 0; i < rows; i++) {
      const rowLetter = alphabet[i];
      for (let j = 1; j <= seatsPerRow; j++) {
        seats.push({
          seatNumber: `${rowLetter}${j}`,
          seatType,
          price
        });
      }
    }
  });
  return seats;
};

exports.addEvent = async (req, res, next) => {
  try {
    const { seatAllocation, ...eventData } = req.body;

    if (req.file) {
      eventData.image = req.file.filename; 
    }

    let parsedSeatAllocation = [];
    if (typeof seatAllocation === 'string') {
      parsedSeatAllocation = JSON.parse(seatAllocation);
    } else {
      parsedSeatAllocation = seatAllocation;
    }

    const seats = generateSeats(parsedSeatAllocation);

    const event = new Event({
      ...eventData,
      seatAllocation: parsedSeatAllocation,
      seats
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const updateData = req.body;
    if (req.file) {
      updateData.image = req.file.path;  // If new image uploaded, update it
    }
    const event = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(event);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Event deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};
