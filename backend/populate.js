const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Booking');
const dotenv = require('dotenv');
dotenv.config();

// MongoDB connection string
const db = process.env.MONGO_URI; // Update this with your MongoDB URI

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Sample data to populate Users, Events, and Bookings
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    contactNumber: '1234567890',
    isAdmin: true,
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    contactNumber: '0987654321',
    isAdmin: false,
  },
];

const events = [
  {
    title: 'Movie: Avengers Endgame',
    category: 'Movie',
    location: 'Cinema Hall 1',
    date: new Date('2025-05-01T19:00:00Z'),
    time: '7:00 PM',
    seats: [
      { seatNumber: 'A1', isBooked: false },
      { seatNumber: 'A2', isBooked: false },
      { seatNumber: 'A3', isBooked: false },
      { seatNumber: 'A4', isBooked: false },
      { seatNumber: 'A5', isBooked: false },
    ],
  },
  {
    title: 'Concert: Coldplay Live',
    category: 'Concert',
    location: 'Stadium',
    date: new Date('2025-06-15T20:00:00Z'),
    time: '8:00 PM',
    seats: [
      { seatNumber: 'B1', isBooked: false },
      { seatNumber: 'B2', isBooked: false },
      { seatNumber: 'B3', isBooked: false },
      { seatNumber: 'B4', isBooked: false },
      { seatNumber: 'B5', isBooked: false },
    ],
  },
];

const bookings = [
  {
    userEmail: 'admin@example.com',  // Admin user
    eventTitle: 'Movie: Avengers Endgame',  // Event title
    seatsBooked: ['A1', 'A2'],
    amountPaid: 500,
    paymentMethod: 'Credit Card',
    transactionId: `TXN_${Date.now()}`,
    paymentStatus: 'Paid',
  },
  {
    userEmail: 'user@example.com',  // Regular user
    eventTitle: 'Concert: Coldplay Live',  // Event title
    seatsBooked: ['B1', 'B2'],
    amountPaid: 1000,
    paymentMethod: 'Debit Card',
    transactionId: `TXN_${Date.now()}`,
    paymentStatus: 'Paid',
  },
];

// Helper function to hash passwords
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Function to create sample users
const createUsers = async () => {
  try {
    for (const userData of users) {
      userData.password = await hashPassword(userData.password); // Hash password
      const user = new User(userData);
      await user.save();
    }
    console.log('Users created');
  } catch (err) {
    console.error('Error creating users', err);
  }
};

// Function to create sample events
const createEvents = async () => {
  try {
    for (const eventData of events) {
      const event = new Event(eventData);
      await event.save();
    }
    console.log('Events created');
  } catch (err) {
    console.error('Error creating events', err);
  }
};

// Function to create sample bookings
const createBookings = async () => {
  try {
    // Retrieve user and event IDs for references
    const admin = await User.findOne({ email: 'admin@example.com' });
    const regularUser = await User.findOne({ email: 'user@example.com' });
    const movieEvent = await Event.findOne({ title: 'Movie: Avengers Endgame' });
    const concertEvent = await Event.findOne({ title: 'Concert: Coldplay Live' });

    // Create booking entries
    const bookingData = [
      {
        user: admin._id,
        event: movieEvent._id,
        seatsBooked: ['A1', 'A2'],
        amountPaid: 500,
        paymentMethod: 'Credit Card',
        transactionId: `TXN_${Date.now()}`,
        paymentStatus: 'Paid',
      },
      {
        user: regularUser._id,
        event: concertEvent._id,
        seatsBooked: ['B1', 'B2'],
        amountPaid: 1000,
        paymentMethod: 'Debit Card',
        transactionId: `TXN_${Date.now()}`,
        paymentStatus: 'Paid',
      },
    ];

    for (const booking of bookingData) {
      const bookingEntry = new Booking(booking);
      await bookingEntry.save();
    }

    console.log('Bookings created');
  } catch (err) {
    console.error('Error creating bookings', err);
  }
};

// Main function to populate the database
const populateDatabase = async () => {
  await createUsers();
  await createEvents();
  await createBookings();
  mongoose.connection.close();
};

populateDatabase();
