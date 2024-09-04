import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User";
import auth from "../middleware/auth";
import CryptoJS from 'crypto-js';
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');

const router = express.Router();

// @route POST api/users
// @desc  Register user
// @access Public
router.post('/', [
    body('name').notEmpty().withMessage('Name is required').escape(),
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
], auth, async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, role } = req.body;

    try {
        let user = await User.findOne({ name, email });

        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({ name, email, avatar, role });

        await user.save();

        let encryptedString = CryptoJS.AES.encrypt(user._id + '&' + user.name + '&' + user.email + '&' + user.role, config.get('cryptrSecret')).toString();
        encryptedString = btoa(encryptedString);
        user.regLink = config.get('appURL') + '/setPassword?data=' + encryptedString;

        await user.save();

        res.status(200).json(user);
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send(error.message);
    }

});

// @route PUT api/users
// @desc  Update user
// @access Public
router.put('/:user_id', [
    body('name').notEmpty().withMessage('Name is required').escape(),
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findById(req.params.user_id);
        if (!user) return res.status(400).json({ errors: [{ msg: 'User not found' }] });

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;
        if (role) user.role = role;
        user.dateModified = new Date();

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        if (password) {
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err: any, token: any) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        }

        res.send('User updated successfully');
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

// @route GET api/users
// @desc get all users
// @access Private
router.get('/', auth, async (req: Request, res: Response) => {
    try {
        const users = await User.find()
            .sort({ name: 1 });
        if (!users || users.length === 0) return res.status(404).json({ errors: [{ msg: 'No Users found' }] });

        res.status(200).json(users);
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

// @route GET api/users/:user_id
// @desc  get user by ID
// @access Private
router.get('/:user_id', auth, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.user_id);

        if (!user) return res.status(404).json({ errors: [{ msg: 'User does not exist' }] });

        res.status(200).json(user);

    } catch (error: any) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

// @route DELETE api/users/:user_id
// @desc Delete a user by ID
// @access Private
router.delete('/:user_id', auth, async (req: Request, res: Response) => {
    try {
        // Find and delete the user by ID
        await User.findOneAndRemove({ _id: req.params.user_id });
        res.json({ msg: 'User deleted' });
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

export default router;