import express, { Request, Response } from 'express';
import connectDB from '../../config/db';
import userRouter from './routes/users';
import authRouter from './routes/auth';
import studentRouter from './routes/students';
import teacherRouter from './routes/teachers';
import classRouter from './routes/classes';
import locationRouter from './routes/locations';

const app = express();

// connect database
connectDB();

// Init Middleware
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
    res.send('API Running');
});

// Define Routes
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/students', studentRouter);
app.use('/api/teachers', teacherRouter);
app.use('/api/classes', classRouter);
app.use('/api/locations', locationRouter)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
