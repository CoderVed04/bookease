const http = require('http');
const dotenv = require('dotenv');
const socketIo = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');

dotenv.config();

// Connect to MongoDB
dbConnect = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
};
dbConnect();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('User connected');

  // Listen for seat selection events
  socket.on('seatSelect', (data) => {
    console.log('Seat selection: ', data);

    // Emit event to other clients to update the seat availability
    socket.broadcast.emit('updateSeatStatus', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
