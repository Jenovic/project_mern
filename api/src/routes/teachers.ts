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
    body('class')
        .optional()
        .custom((value) => {
            if (value && (!isValidObjectId(value._id) || !value.name)) {
                throw new Error('Invalid class structure (must contain valid _id and name)');
            }
            return true;
        }),
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

    const { gender, name, middleName, surname, dob, address, phoneNumber, email, class: classObj, location: locationObj } = req.body;

    try {
        let teacher = await Teacher.findOne({ name, surname, dob });

        if (teacher) return res.status(400).json({ errors: [{ msg: 'Teacher already exists' }] });

        teacher = new Teacher({ gender, name, middleName, surname, dob, address, phoneNumber, email });

        // Update class if provided
        if (classObj) {
            const classroom = await Class.findOne({ _id: classObj._id });
            if (!classroom) return res.status(400).json({ errors: [{ msg: 'Classroom not found' }] });
            teacher.class = classroom;
        }

        // Update location if provided
        if (locationObj) {
            const location = await Location.findOne({ _id: locationObj._id });
            if (!location) return res.status(400).json({ errors: [{ msg: 'Location not found' }] });
            teacher.location = location;
        }

        await teacher.save();

        res.send('Teacher registered successfuly')
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

// @route POST api/teachers
// @desc  Update a teacher
// @access Private
router.put('/:teacher_id', [
    body('name').notEmpty().withMessage('Name is required').escape(),
    body('surname').notEmpty().withMessage('Surname is required').escape(),
    body('phoneNumber').isLength({ min: 10, max: 15 }).withMessage('Invalid phone number'),
    body('address').notEmpty().withMessage('Address is required').escape(),
    body('dob').notEmpty().withMessage('DOB is required').isISO8601().withMessage('Invalid date format'),
    body('class')
        .optional()
        .custom((value) => {
            if (value && (!isValidObjectId(value._id) || !value.name)) {
                throw new Error('Invalid class structure (must contain valid _id and name)');
            }
            return true;
        }),
    body('location')
        .optional()
        .custom((value) => {
            if (value && (!isValidObjectId(value._id) || !value.name)) {
                throw new Error('Invalid location structure (must contain valid _id and name)');
            }
            return true;
        }),
], auth, async (req: Request, res: Response) => {
    const { gender, name, middleName, surname, dob, address, phoneNumber, email, class: classObj, location: locationObj } = req.body;

    try {
        let teacher = await Teacher.findById(req.params.teacher_id);
        if (!teacher) return res.status(400).json({ errors: [{ msg: 'Teacher not found' }] });

        // Update the teacher's fields
        if (gender) teacher.gender = gender;
        if (name) teacher.name = name;
        if (middleName) teacher.middleName = middleName;
        if (surname) teacher.surname = surname;
        if (dob) teacher.dob = dob;
        if (address) teacher.address = address;
        if (phoneNumber) teacher.phoneNumber = phoneNumber;
        if (email) teacher.email = email;
        teacher.dateModified = new Date();

        // Update class if provided
        if (classObj) {
            const classroom = await Class.findOne({ _id: classObj._id });
            if (!classroom) return res.status(400).json({ errors: [{ msg: 'Classroom not found' }] });
            teacher.class = classroom;
        }

        // Update location if provided
        if (locationObj) {
            const location = await Location.findOne({ _id: locationObj._id });
            if (!location) return res.status(400).json({ errors: [{ msg: 'Location not found' }] });
            teacher.location = location;
        }

        await teacher.save();
        res.send('Teacher updated successfully');

    } catch (error: any) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
})

// @route GET api/teachers
// @desc  get all teachers
// @access Private
router.get('/', auth, async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const { class: classId, location: locationId } = req.query;

    try {
        const query: any = {};

        if (typeof classId === 'string' && isValidObjectId(classId)) {
            query.class = classId;
        }

        if (typeof locationId === 'string' && isValidObjectId(locationId)) {
            query.location = locationId;
        }

        const teachers = await Teacher.find(query)
            .sort({ surname: 1 })
            .limit(limit).skip(skip)
            .populate('class', 'name')
            .populate('location', 'name')
            .exec();

        const total = await Teacher.countDocuments(query);

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
        res.status(500).send(error.message);
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
        res.status(500).send(error.message);
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
        res.status(500).send(error.message);
    }
});


export default router;