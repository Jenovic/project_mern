import mongoose, { Document, Schema } from 'mongoose';
import { IClass } from './Class';

// Define the Teacher schema
const TeacherSchema = new Schema({
    name: { type: String, required: true, index: true },
    middleName: String,
    surname: { type: String, required: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: String,
    class: { type: Schema.Types.ObjectId, ref: 'Class' },
    date: { type: Date, default: Date.now }
});

export interface ITeacher extends Document {
    name: string;
    middleName?: string;
    surname: string;
    dob: Date;
    address: string;
    phoneNumber: string;
    email?: string;
    class?: IClass;
    date: Date;
}

const TeacherModel = mongoose.model<ITeacher>('teacher', TeacherSchema);

export default TeacherModel;
