import express, { Request, Response } from "express";
import { body, validationResult, check } from "express-validator";
import { isValidObjectId } from "../utils/helpers";
import Teacher from "../models/Teacher";
import Class from "../models/Class";
import Location from "../models/Location";
import auth from "../middleware/auth";

const router = express.Router();
interface FieldType {
    name: string;
    type: string;
    required: boolean;
}

const getFieldTypes = (): FieldType[] => {
    const schema = Teacher.schema.paths;
    const fieldTypes: FieldType[] = Object.keys(schema).map((field) => ({
        name: field,
        type: schema[field].instance,
        required: !!schema[field].isRequired,
    }));
    return fieldTypes;
};

// @route POST api/teachers
// @desc  Register teacher
// @access Private
router.post('/', [
    body('name').notEmpty().withMessage('Name is required').escape(),
    body('surname').notEmpty().withMessage('Surname is required').escape(),
    body('phoneNumber').isLength({ min: 10, max: 15 }).withMessage('Invalid phone number'),
    body('address').notEmpty().withMessage('Address is required').escape(),
    body('dob').notEmpty().withMessage('DOB is required').isISO8601().withMessage('Invalid date format'),
    check('class_id')
        .optional() // Make the class_id field optional
        .custom((value) => {
            if (value && !isValidObjectId(value)) {
                throw new Error('Invalid class_id');
            }
            return true;
        }),
    check('location_id')
        .optional() // Make the location_id field optional
        .custom((value) => {
            if (value && !isValidObjectId(value)) {
                throw new Error('Invalid location_id');
            }
            return true;
        }),
], auth, async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, middleName, surname, dob, address, phoneNumber, email, class_id, location_id } = req.body;

    try {
        let teacher = await Teacher.findOne({ name, surname, dob });

        if (teacher) return res.status(400).json({ errors: [{ msg: 'Teacher already exists' }] });

        let classroom;
        let location;

        if (class_id) {
            classroom = await Class.findOne({ _id: class_id });
            if (!classroom) return res.status(400).json({ errors: [{ msg: 'Classroom not found' }] });
        }

        if (location_id) {
            location = await Location.findOne({ _id: location_id });
            if (!location) return res.status(400).json({ errors: [{ msg: 'Location not found' }] });
        }

        teacher = new Teacher({ name, middleName, surname, dob, address, phoneNumber, email });

        if (classroom) teacher.class = classroom;
        if (location) teacher.location = location;

        await teacher.save();

        res.send('Teacher registered successfuly')
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route POST api/teachers
// @desc  Update a teacher
// @access Private
router.put('/:teacher_id', [
    check('class_id')
        .optional() // Make the class_id field optional
        .custom((value) => {
            if (value && !isValidObjectId(value)) {
                throw new Error('Invalid class_id');
            }
            return true;
        }),
    check('location_id')
        .optional() // Make the location_id field optional
        .custom((value) => {
            if (value && !isValidObjectId(value)) {
                throw new Error('Invalid location_id');
            }
            return true;
        }),
], auth, async (req: Request, res: Response) => {
    const { name, middleName, surname, dob, address, phoneNumber, email, class_id, location_id } = req.body;

    try {
        let teacher = await Teacher.findById(req.params.teacher_id);
        if (!teacher) return res.status(400).json({ errors: [{ msg: 'Teacher not found' }] });

        // Update the teacher's fields
        if (name) teacher.name = name;
        if (middleName) teacher.middleName = middleName;
        if (surname) teacher.surname = surname;
        if (dob) teacher.dob = dob;
        if (address) teacher.address = address;
        if (phoneNumber) teacher.phoneNumber = phoneNumber;
        if (email) teacher.email = email;
        teacher.dateModified = new Date();

        let classroom;
        let location;

        if (class_id) {
            classroom = await Class.findOne({ _id: class_id });
            if (!classroom) return res.status(400).json({ errors: [{ msg: 'Classroom not found' }] });
        }

        if (location_id) {
            location = await Location.findOne({ _id: location_id });
            if (!location) return res.status(400).json({ errors: [{ msg: 'Location not found' }] });
        }

        // If a valid class was found, associate the student with the class.
        if (classroom) teacher.class = classroom;

        // If a valid location was found, associate the student with the location.
        if (location) teacher.location = location;

        await teacher.save();
        res.send('Teacher updated successfully');

    } catch (error: any) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
})

// @route GET api/teachers
// @desc  get all teachers
// @access Private
router.get('/', auth, async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    try {
        const teachers = await Teacher.find()
            .sort({ surname: 1 })
            .limit(limit)
            .skip(skip)
            .populate('class', 'name')
            .populate('location', 'name')
            .exec();
        const total = await Teacher.countDocuments();

        if (!teachers || teachers.length === 0) return res.status(404).json({ errors: [{ msg: 'No teachers found' }] });

        const fieldTypes = getFieldTypes();

        res.json({
            teachers,
            total,
            page,
            pages: Math.ceil(total / limit),
            fieldTypes
        });
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route GET api/teachers/:teacher_id
// @desc  get teacher by ID
// @access Private
router.get('/:teacher_id', auth, async (req: Request, res: Response) => {
    try {
        const teacher = await Teacher.findById(req.params.teacher_id)
            .populate('class', 'name')
            .populate('location', 'name')
            .exec();

        if (!teacher) return res.status(404).json({ errors: [{ msg: 'Teacher does not exist' }] });

        res.status(200).json({ teacher });

    } catch (error: any) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route DELETE api/teachers/:teacher_id
// @desc Delete a teacher by ID
// @access Private
router.delete('/:teacher_id', auth, async (req: Request, res: Response) => {
    try {
        // Find and delete the teacher by ID
        await Teacher.findOneAndRemove({ _id: req.params.teacher_id });
        res.json({ msg: 'Teacher deleted' });
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});


export default router;