import express, { Request, Response } from "express";
import { body, validationResult, check } from "express-validator";
import { isValidObjectId } from "../utils/helpers";
import auth from "../middleware/auth";
import Class from "../models/Class";
import Location from "../models/Location";

const router = express.Router();

interface FieldType {
    name: string;
    type: string;
    required: boolean;
}

const getFieldTypes = (): FieldType[] => {
    const schema = Class.schema.paths;
    const fieldTypes: FieldType[] = Object.keys(schema).map((field) => ({
        name: field,
        type: schema[field].instance,
        required: !!schema[field].isRequired,
    }));
    return fieldTypes;
};

// @route POST api/classes
// @desc  Register a class
// @access Private
router.post('/', [
    body('name').notEmpty().withMessage('Class name is required').escape(),
    body('location')
        .optional()
        .custom((value) => {
            if (value && (!isValidObjectId(value._id) || !value.name)) {
                throw new Error('Invalid location structure (must contain valid _id and name)');
            }
            return true;
        }),
], auth, async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, location: locationObj } = req.body;

    try {
        let classroom = await Class.findOne({ name });

        if (classroom) return res.status(400).json({ errors: [{ msg: 'Classroom already exists' }] });

        classroom = new Class({ name });

        // Update location if provided
        if (locationObj) {
            const location = await Location.findOne({ _id: locationObj._id });
            if (!location) return res.status(400).json({ errors: [{ msg: 'Location not found' }] });
            classroom.location = location;
        }

        await classroom.save();

        res.send('Classroom created successfuly');

    } catch (error: any) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

// @route POST api/classes
// @desc  Update a class
// @access Private
router.put('/:class_id', [
    body('name').notEmpty().withMessage('Class name is required').escape(),
    body('location')
        .optional()
        .custom((value) => {
            if (value && (!isValidObjectId(value._id) || !value.name)) {
                throw new Error('Invalid location structure (must contain valid _id and name)');
            }
            return true;
        }),
], auth, async (req: Request, res: Response) => {
    const { name, location: locationObj } = req.body;

    try {
        let classroom = await Class.findById(req.params.class_id);
        if (!classroom) return res.status(400).json({ errors: [{ msg: 'Classroom not found' }] });

        // update classroom's fields
        if (name) classroom.name = name;
        classroom.dateModified = new Date();

        // Update location if provided
        if (locationObj) {
            const location = await Location.findOne({ _id: locationObj._id });
            if (!location) return res.status(400).json({ errors: [{ msg: 'Location not found' }] });
            classroom.location = location;
        }

        await classroom.save();
        res.send('Classroom updated successfully');
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

// @route GET api/classes
// @desc  get all classrooms
// @access Private
router.get('/', auth, async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const { location: locationId } = req.query;

    try {
        const query: any = {};

        if (typeof locationId === 'string' && isValidObjectId(locationId)) {
            query.location = locationId;
        }

        const classrooms = await Class.find(query)
            .sort({ name: 1 })
            .limit(limit).skip(skip)
            .populate('location', 'name')
            .exec();

        const total = await Class.countDocuments(query);

        if (!classrooms) return res.status(404).json({ errors: [{ msg: 'No classrooms found' }] });

        const fieldTypes = getFieldTypes();

        res.json({
            classrooms,
            total,
            page,
            pages: Math.ceil(total / limit),
            fieldTypes
        });

    } catch (error: any) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

// @route GET api/classes/:class_id
// @desc  get a classroom by ID
// @access Private
router.get('/:class_id', auth, async (req: Request, res: Response) => {
    try {
        const classroom = await Class.findById(req.params.class_id)
            .populate('location', 'name')
            .exec();

        if (!classroom) return res.status(404).json({ errors: [{ msg: 'Classroom does not exist' }] });

        res.status(200).json(classroom);

    } catch (error: any) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

// @route DELETE api/classes/:class_id
// @desc Delete a classroom by ID
// @access Private
router.delete('/:class_id', auth, async (req: Request, res: Response) => {
    try {
        // Find and delete the classroom by ID
        await Class.findOneAndRemove({ _id: req.params.class_id });
        res.json({ msg: 'Classroom deleted' });
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

export default router;