const ParkingSpace = require('../models/parkingSpace');
//Create
exports.createParkingSpace = async (req, res) => {
    const { title, address, description, price, latitude, longitude, availability } = req.body;
    try {
        const newParkingSpace = new ParkingSpace({
            title,
            address,
            description,
            price,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude],
            },
            host: req.user.id, // ID from the authenticated user token
            availability,
        });
        await newParkingSpace.save();
        res.status(201).json({ msg: 'Parking space created successfully', parkingSpace: newParkingSpace });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

//search parking space 
exports.searchParkingSpaces = async (req, res) => {
    const { latitude, longitude, radius, startTime, endTime } = req.query;
    const searchRadius = parseFloat(radius) || 5; // Default to 5 km radius

    try {
        const parkingSpaces = await ParkingSpace.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[parseFloat(longitude), parseFloat(latitude)], searchRadius / 6378.1], // Converts km to radians
                },
            },
            'availability.startTime': { $lte: new Date(startTime) },
            'availability.endTime': { $gte: new Date(endTime) },
        });

        if (parkingSpaces.length === 0) {
            return res.status(404).json({ msg: 'No parking spaces found in this area for the selected time' });
        }
        res.json(parkingSpaces);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// get single parking space
exports.getParkingSpaceById = async (req, res) => {
    try {
        const parkingSpace = await ParkingSpace.findById(req.params.id).populate('host', 'username email');
        if (!parkingSpace) {
            return res.status(404).json({ msg: 'Parking space not found' });
        }
        res.json(parkingSpace);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};