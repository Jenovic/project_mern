import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import auth from "../middleware/auth";
import Class from "../models/Class";

const router = express.Router();

// @route POST api/classes
// @desc  Register a class
// @access Private
router.post('/', [
    body('name').notEmpty().withMessage('Class name is required').escape()
], auth, async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    try {
        let classroom = await Class.findOne({ name });

        if (classroom) return res.status(400).json({ errors: [{ msg: 'Classroom already exists' }] });

        classroom = new Class({ name });

        await classroom.save();

        res.send('Classroom created successfuly');

    } catch (error: any) {

    }
});

// @route POST api/classes
// @desc  Register a class
// @access Private
router.put('/:class_id', auth, async (req: Request, res: Response) => {
    const { name } = req.body;

    try {
        let classroom = await Class.findById(req.params.class_id);
        if (!classroom) return res.status(400).json({ errors: [{ msg: 'Classroom not found' }] });

        // update classroom's fields
        if (name) classroom.name = name;

        await classroom.save();
        res.send('Classroom updated successfully');
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route GET api/classes
// @desc  get all classrooms
// @access Private
router.get('/', auth, async (req: Request, res: Response) => {
    try {
        const classrooms = await Class.find();

        if (!classrooms) return res.status(404).json({ errors: [{ msg: 'No classrooms found' }] });

        res.json(classrooms);
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route GET api/classes/:class_id
// @desc  get a classroom by ID
// @access Private
router.get('/:class_id', auth, async (req: Request, res: Response) => {
    try {
        const classroom = await Class.findById(req.params.class_id);

        if (!classroom) return res.status(404).json({ errors: [{ msg: 'Classroom does not exist' }] });

        res.status(200).json(classroom);

    } catch (error: any) {
        console.error(error.message);
        res.status(500).send('Server Error');
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
        res.status(500).send('Server error');
    }
});

export default router;