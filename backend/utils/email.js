const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Setup email transporter using your SMTP settings
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service, Gmail for example
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingConfirmationEmail = (to, bookingDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,                          
    subject: 'Booking Confirmation', 
    text: `Thank you for booking with us. Your booking details are:\n\nEvent: ${bookingDetails.event}\nSeats: ${bookingDetails.seatsBooked.join(', ')}\nAmount Paid: ${bookingDetails.amountPaid}\nPayment Status: ${bookingDetails.paymentStatus}`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendBookingConfirmationEmail,
};
