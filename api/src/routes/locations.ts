import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import auth from "../middleware/auth";
import Location from "../models/Location";

const router = express.Router();

// @Route POST api/locations
// @desc Register a location
// @access Private
router.post('/', [
    body('name').notEmpty().withMessage('Location name is required').escape(),
], auth, async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, address, city, state, country, zipcode } = req.body;

    try {
        let location = await Location.findOne({ name });

        if (location) return res.status(400).json({ errors: [{ msg: 'Location already exists' }] });

        location = new Location({ name, address, city, state, country, zipcode });

        await location.save();

        res.send('Location created successfuly');

    } catch (error: any) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

// @route POST api/locations
// @desc  Update a location
// @access Private
router.put('/:location_id', auth, async (req: Request, res: Response) => {
    const { name, address, city, state, country, zipcode } = req.body;

    try {
        let location = await Location.findById(req.params.class_id);
        if (!location) return res.status(400).json({ errors: [{ msg: 'Location not found' }] });

        // update location's fields
        if (name) location.name = name;
        if (address) location.address = address;
        if (city) location.city = city;
        if (state) location.state = state;
        if (country) location.country = country;
        if (zipcode) location.zipcode = zipcode;
        location.dateModified = new Date();

        await location.save();
        res.send('Location updated successfully');
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

// @route GET api/locations
// @desc  get all locations
// @access Private
router.get('/', auth, async (req: Request, res: Response) => {
    try {
        const locations = await Location.find();

        if (!locations) return res.status(404).json({ errors: [{ msg: 'No locations found' }] });

        res.json(locations);
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

export default router;