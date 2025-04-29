const express = require('express');
const { getAllEvents, getEventById, getEventsByCategory, searchEvents } = require('../controllers/eventController');
const router = express.Router();

router.get('/search', searchEvents);
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.get('/category/:type', getEventsByCategory);

module.exports = router;