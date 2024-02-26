import { Request, Response, NextFunction } from 'express';
import { IGetUserAuthInfoRequest } from '../types/express';

const jwt = require('jsonwebtoken');
const config = require('config');

const auth = (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }
        const decoded = jwt.verify(token, config.get('jwtSecret')) as { user: any };
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(401).json({ msg: 'Token is not valid' });
    }
}

export default auth;