const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: String,
    category: { 
        type: String, 
        enum: ['Movie', 'Concert', 'Play'] 
    },
    description: String,
    location: String,
    date: Date,
    time: String,
    image: String,
    seats: [
      {
        seatNumber: String,
        isBooked: { type: Boolean, default: false },
      },
    ],
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
  });
  
  module.exports = mongoose.model('Event', eventSchema);
  