import mongoose, { Document, Schema } from 'mongoose';
import { IClass } from './Class';
import { ILocation } from './Location';

// Define the Teacher schema
const TeacherSchema = new Schema({
    name: { type: String, required: true, index: true },
    middleName: String,
    surname: { type: String, required: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: String,
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },
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
    location?: ILocation;
    dateCreated: Date;
    dateModified: Date;
}

const TeacherModel = mongoose.model<ITeacher>('teacher', TeacherSchema);

export default TeacherModel;
