const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    event: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event' 
    },
    seatsBooked: [String],
    amountPaid: Number,
    paymentMethod: { 
        type: String, 
        enum: ['Razorpay', 'Stripe'] 
    },
    paymentStatus: { 
        type: String, 
        default: 'Pending' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
  });
  
  module.exports = mongoose.model('Booking', bookingSchema);
  