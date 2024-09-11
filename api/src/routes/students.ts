import express, { Request, Response } from "express";
import { IGetUserAuthInfoRequest } from "../types/express";
import { body, validationResult } from "express-validator";
import { isValidObjectId, sortByPendingAndName } from "../utils/helpers";
import Student from "../models/Student";
import Class from "../models/Class";
import Location from "../models/Location";
import User from "../models/User";
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
const validateResponsable = body('responsables.*').custom((responsable, { req }) => {
    // Validate each field within the Responsable object
    if (!responsable.name) throw new Error('Name is required for Responsable');
    if (!responsable.surname) throw new Error('Surname is required for Responsable');
    if (!responsable.phoneNumber) throw new Error('Phone is required for Responsable');
    if (responsable.phoneNumber.length < 10 || responsable.phoneNumber.length > 15) throw new Error('Invalid phone number');
    if (!responsable.address) throw new Error('Address is required for Responsable');
    if (!responsable.relationshipToStudent) throw new Error('Relationship to student is required for Responsable');
    return true;
});

// @route POST api/students
// @desc  Register student
// @access Private
router.post('/', [
    body('name').notEmpty().withMessage('Name is required').escape(),
    body('surname').notEmpty().withMessage('Surname is required').escape(),
    body('dob').notEmpty().withMessage('DOB is required').isISO8601().withMessage('Invalid date format'),
    body('address').notEmpty().withMessage('Address is required').escape(),
    body('phoneNumber').isLength({ min: 0, max: 15 }).withMessage('Invalid phone number'),
    body('responsables').isArray({ min: 1 }).withMessage('At least one Responsable is required'),
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
    validateResponsable,
], auth, async (req: IGetUserAuthInfoRequest, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { gender, name, middleName, surname, dob, address, phoneNumber, responsables, class: classObj, location: locationObj } = req.body;

    try {
        const user = await User.findById(req.user.id).select('-password');

        let student = await Student.findOne({ name, surname, dob });

        if (student) return res.status(400).json({ errors: [{ msg: 'Student already exists' }] });

        student = new Student({ gender, name, middleName, surname, dob, address, phoneNumber, responsables });

        if (user?.role !== 'staff') student.status = 'approved';

        // Update class if provided
        if (classObj) {
            const classroom = await Class.findOne({ _id: classObj._id });
            if (!classroom) return res.status(400).json({ errors: [{ msg: 'Classroom not found' }] });
            student.class = classroom;
        }

        // Update location if provided
        if (locationObj) {
            const location = await Location.findOne({ _id: locationObj._id });
            if (!location) return res.status(400).json({ errors: [{ msg: 'Location not found' }] });
            student.location = location;
        }

        await student.save();

        res.send('Student registered successfuly');
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

// @route PUT api/students
// @desc  Update a student
// @access Private
router.put('/:student_id', [
    body('name').notEmpty().withMessage('Name is required').escape(),
    body('surname').notEmpty().withMessage('Surname is required').escape(),
    body('dob').notEmpty().withMessage('DOB is required').isISO8601().withMessage('Invalid date format'),
    body('address').notEmpty().withMessage('Address is required').escape(),
    body('phoneNumber').isLength({ min: 0, max: 15 }).withMessage('Invalid phone number'),
    body('responsables').isArray({ min: 1 }).withMessage('At least one Responsable is required'),
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
    validateResponsable,
],
    auth, async (req: Request, res: Response) => {
        const { gender, name, middleName, surname, dob, address, phoneNumber, responsables, class: classObj, location: locationObj, status } = req.body;

        try {
            // Find the existing student by ID
            let student = await Student.findById(req.params.student_id);
            if (!student) return res.status(400).json({ errors: [{ msg: 'Student not found' }] });

            // Update the student's fields
            if (gender) student.gender = gender;
            if (name) student.name = name;
            if (middleName) student.middleName = middleName;
            if (surname) student.surname = surname;
            if (dob) student.dob = dob;
            if (address) student.address = address;
            if (phoneNumber) student.phoneNumber = phoneNumber;
            if (responsables) student.responsables = responsables;
            if (status) student.status = status;
            student.dateModified = new Date();

            // Update class if provided
            if (classObj) {
                const classroom = await Class.findOne({ _id: classObj._id });
                if (!classroom) return res.status(400).json({ errors: [{ msg: 'Classroom not found' }] });
                student.class = classroom;
            }

            // Update location if provided
            if (locationObj) {
                const location = await Location.findOne({ _id: locationObj._id });
                if (!location) return res.status(400).json({ errors: [{ msg: 'Location not found' }] });
                student.location = location;
            }

            await student.save();

            res.send('Student updated successfully');
        } catch (error: any) {
            console.error(error.message);
            res.status(500).send(error.message);
        }
    });

// @route GET api/students
// @desc  get all students
// @access Private
router.get('/', auth, async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const { class: classId, location: locationId } = req.query;

    try {
        // Create a query object to store filtering conditions
        const query: any = {};

        // If classId is provided, add class filter
        if (typeof classId === 'string' && isValidObjectId(classId)) {
            query.class = classId; // Only assign if classId is a valid ObjectId
        }

        // If locationId is provided, add location filter
        if (typeof locationId === 'string' && isValidObjectId(locationId)) {
            query.location = locationId;
        }

        // Fetch filtered students, paginated
        let students = await Student.find(query)
            .populate('class', 'name')
            .populate('location', 'name')
            .exec();

        students = sortByPendingAndName(students, false);
        students = students.slice(skip, skip + limit);

        const total = await Student.countDocuments(query);

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
        res.status(500).send(error.message);
    }
});

// @route GET api/students/:student_id
// @desc  get student by ID
// @access Private
router.get('/:student_id', auth, async (req: Request, res: Response) => {
    try {
        const student = await Student.findById(req.params.student_id)
            .populate('class', 'name')
            .populate('location', 'name')
            .exec();

        if (!student) return res.status(404).json({ errors: [{ msg: 'Student does not exist' }] });

        res.status(200).json({ student });

    } catch (error: any) {
        console.error(error.message);
        res.status(500).send(error.message);
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
        res.status(500).send(error.message);
    }
});

export default router;