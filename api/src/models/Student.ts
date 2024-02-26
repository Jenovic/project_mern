import mongoose, { Document, Schema } from 'mongoose';
import { IClass } from './Class';

// Define the Responsible details schema
const ResponsableSchema = new Schema({
    name: { type: String, required: true },
    middleName: String,
    surname: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    email: String,
    relationshipToStudent: { type: String, required: true },
});

// Define the Student schema
const StudentSchema = new Schema({
    name: { type: String, required: true },
    middleName: String,
    surname: { type: String, required: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    phoneNumber: String,
    responsables: [ResponsableSchema], // Array of Responsible details
    class: { type: Schema.Types.ObjectId, ref: 'Class' },
    date: { type: Date, default: Date.now }
});

export interface IStudent extends Document {
    name: string;
    middleName?: string;
    surname: string;
    dob: Date;
    address: string;
    phoneNumber?: string;
    responsables: typeof ResponsableSchema[];
    class?: IClass;
    date: Date;
}

const StudentModel = mongoose.model<IStudent>('student', StudentSchema);

export default StudentModel;



