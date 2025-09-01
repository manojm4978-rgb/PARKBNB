// routes/parking.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const parkingController = require('../controllers/parkingController');


router.post('/', auth, parkingController.createParkingSpace);

router.get('/search', parkingController.searchParkingSpaces);


router.get('/:id', parkingController.getParkingSpaceById);

module.exports = router;