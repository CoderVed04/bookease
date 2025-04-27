const Event = require('../models/Event');
const User = require('../models/User');

exports.addEvent = async (req, res) => {
  try {
    const { title, category, description, location, date, time, rows, seatsPerRow } = req.body;
    let imagePath = req.file ? req.file.path : null;

    if (!rows || !seatsPerRow) {
      return res.status(400).json({ msg: 'Rows and seatsPerRow are required' });
    }

    // Convert rows (string like 'ABCDE') into array ['A', 'B', 'C', 'D', 'E']
    const rowArray = rows.split('');
    const generatedSeats = [];

    rowArray.forEach(row => {
      for (let num = 1; num <= parseInt(seatsPerRow); num++) {
        generatedSeats.push({
          seatNumber: `${row}${num}`,
          isBooked: false
        });
      }
    });

    const event = new Event({
      title,
      category,
      description,
      location,
      date,
      time,
      image: imagePath,
      seats: generatedSeats
    });

    await event.save();

    res.status(201).json({ success: true, event });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
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
