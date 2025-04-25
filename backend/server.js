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
  console.log('New client connected');

  socket.on('selectSeat', (seatId) => {
    socket.broadcast.emit('seatBlocked', seatId);
  });

  socket.on('releaseSeat', (seatId) => {
    socket.broadcast.emit('seatAvailable', seatId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
