import express, { Request, Response } from "express";
import mongoose from 'mongoose';
import { IGetUserAuthInfoRequest } from "../types/express";
import { body, validationResult, check } from "express-validator";
import Student from "../models/Student";
import Class from "../models/Class";
import auth from "../middleware/auth";

const router = express.Router();

interface FieldType {
    name: string;
    type: string;
    required: boolean;
    subfields?: FieldType[];
}

const getFieldTypes = (): FieldType[] => {
    const schema = Student.schema.paths;
    const fieldTypes: FieldType[] = Object.keys(schema).map((field) => {
        const fieldType: FieldType = {
            name: field,
            type: schema[field].instance,
            required: !!schema[field].isRequired,
        };

        // Check for subfields in the 'responsables' field
        if (field === 'responsables') {
            const subSchema = (schema[field] as any).schema.paths;
            fieldType.subfields = Object.keys(subSchema).map((subField) => ({
                name: subField,
                type: subSchema[subField].instance,
                required: !!subSchema[subField].isRequired,
            }));
        }

        return fieldType;
    });
    return fieldTypes;
};

// Define the validation function for a single Responsable object
const validateResponsable = body('responsables').isObject().custom((responsable, { req }) => {
    // Define custom validation logic for each Responsable object here
    if (!responsable.name) throw new Error('Name is required for Responsable');
    if (!responsable.surname) throw new Error('Surname is required for Responsable');
    if (!responsable.phoneNumber) throw new Error('Phone is required for Responsable');
    if (responsable.phoneNumber.length < 10 || responsable.phoneNumber.length > 10) throw new Error('Invalid phone number');
    if (!responsable.address) throw new Error('Address is required for Responsable');
    if (!responsable.relationshipToStudent) throw new Error('Relationship to student is required for Responsable');
    return true;
});

// Custom validation function to check if a string is a valid MongoDB ObjectID
const isValidObjectId = (value: string) => {
    return mongoose.Types.ObjectId.isValid(value);
};

// @route POST api/students
// @desc  Register student
// @access Private
router.post('/', [
    body('name').notEmpty().withMessage('Name is required').escape(),
    body('surname').notEmpty().withMessage('Surname is required').escape(),
    body('dob').notEmpty().withMessage('DOB is required').isISO8601().withMessage('Invalid date format'),
    body('address').notEmpty().withMessage('Address is required').escape(),
    body('responsables').isObject().custom((responsables, { req }) => {
        if (!responsables || responsables.length === 0) {
            throw new Error('At least one Responsable is required');
        }
        return true;
    }),
    check('class_id')
        .optional() // Make the class_id field optional
        .custom((value) => {
            if (value && !isValidObjectId(value)) {
                throw new Error('Invalid class_id');
            }
            return true;
        }),
    validateResponsable,
], auth, async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, middleName, surname, dob, address, phoneNumber, responsables, class_id } = req.body;

    try {
        let student = await Student.findOne({ name, surname, dob });

        if (student) return res.status(400).json({ errors: [{ msg: 'Student already exists' }] });

        let classroom;

        if (class_id) {
            classroom = await Class.findOne({ _id: class_id });

            if (!classroom) return res.status(400).json({ errors: [{ msg: 'Classroom not found' }] });
        }

        student = new Student({ name, middleName, surname, dob, address, phoneNumber, responsables });

        // If a valid class was found, associate the student with the class.
        if (classroom) {
            student.class = classroom;
        }

        await student.save();

        res.send('Student registered successfuly');
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route PUT api/students
// @desc  Update a student
// @access Private
router.put('/:student_id', auth, async (req: Request, res: Response) => {
    const { name, middleName, surname, dob, address, phoneNumber, responsables, class_id } = req.body;

    try {
        // Find the existing student by ID
        let student = await Student.findById(req.params.student_id);
        if (!student) return res.status(400).json({ errors: [{ msg: 'Student not found' }] });

        // Update the student's fields
        if (name) student.name = name;
        if (middleName) student.middleName = middleName;
        if (surname) student.surname = surname;
        if (dob) student.dob = dob;
        if (address) student.address = address;
        if (phoneNumber) student.phoneNumber = phoneNumber;
        if (responsables) student.responsables = responsables;
        student.dateModified = new Date();

        let classroom;

        if (class_id) {
            classroom = await Class.findOne({ _id: class_id });

            if (!classroom) return res.status(400).json({ errors: [{ msg: 'Classroom not found' }] });
        }

        // If a valid class was found, associate the student with the class.
        if (classroom) {
            student.class = classroom;
        } else {
            // If class_id is not provided or invalid, remove any existing class association.
            student.class = undefined;
        }

        await student.save();

        res.send('Student updated successfully');
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route GET api/students
// @desc  get all students
// @access Private
router.get('/', auth, async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    try {
        const students = await Student.find().sort({ surname: 1 }).limit(limit).skip(skip);
        const total = await Student.countDocuments();

        if (!students || students.length === 0) return res.status(404).json({ errors: [{ msg: 'No Students found' }] });

        const fieldTypes = getFieldTypes();

        res.json({
            students,
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

// @route GET api/students/:student_id
// @desc  get student by ID
// @access Private
router.get('/:student_id', auth, async (req: Request, res: Response) => {
    try {
        const student = await Student.findById(req.params.student_id);

        if (!student) return res.status(404).json({ errors: [{ msg: 'Student does not exist' }] });

        res.status(200).json({ student });

    } catch (error: any) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route DELETE api/students/:student_id
// @desc Delete a student by ID
// @access Private
router.delete('/:student_id', auth, async (req: Request, res: Response) => {
    try {
        // Find and delete the student by ID
        await Student.findOneAndRemove({ _id: req.params.student_id });
        res.json({ msg: 'Student deleted' });
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

export default router;