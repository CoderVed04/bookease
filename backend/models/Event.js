// models/Event.js
const mongoose = require('mongoose');

const seatAllocationSchema = new mongoose.Schema({
  seatType: {
    type: String,
    enum: ['VIP', 'Normal'],
    required: true
  },
  rows: {
    type: Number,
    required: true
  },
  seatsPerRow: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const eventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['Movie', 'Concert', 'Play'], 
    required: true 
  },
  description: String,
  location: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String // Will store the filename or full URL after upload
  },
  seatAllocation: [seatAllocationSchema],
  seats: [
    {
      seatNumber: { type: String },
      seatType: { type: String, enum: ['VIP', 'Normal'] },
      isBooked: { type: Boolean, default: false },
      price: { type: Number }
    }
  ],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Event', eventSchema);
