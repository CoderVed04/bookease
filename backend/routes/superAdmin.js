const express = require('express');
const router = express.Router();
const { superAdminOnly, auth } = require('../middleware/authMiddleware');
const superAdminController = require('../controllers/superAdminController');

router.get('/users', auth, superAdminOnly, superAdminController.getAllUsers);
router.patch('/users/block/:id', auth, superAdminOnly, superAdminController.blockUser);
router.delete('/users/:id', auth, superAdminOnly, superAdminController.deleteUser);

router.get('/events', auth, superAdminOnly, superAdminController.getAllEvents);
router.get('/bookings', auth, superAdminOnly, superAdminController.getAllBookings);

router.patch('/users/role', auth, superAdminOnly, superAdminController.updateUserRole);

module.exports = router;
