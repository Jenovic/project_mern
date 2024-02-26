import express, { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { IGetUserAuthInfoRequest } from "../types/express";
import auth from "../middleware/auth";
import User from "../models/User";
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

const router: Router = express.Router();

// @route GET api/auth
// @desc  Auth route
// @access Public
router.get('/', auth, async (req: IGetUserAuthInfoRequest, res: Response) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route POST api/auth
// @desc  Authenticate user and get token
// @access Public
router.post('/', [
    body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('password').exists().withMessage('Password is required'),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }

        const isMacth = await bcrypt.compare(password, user.password);

        if (!isMacth) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }

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

    } catch (error: any) {
        console.error(error.message);
        res.status(500).send('Server error');
    }

});

export default router;