const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: ['User', 'Admin', 'SuperAdmin'],
    default: 'User'
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  contactNumber: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model('User', userSchema);  