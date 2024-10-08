import mongoose, { Document, Schema } from 'mongoose';
import { IClass } from './Class';
import { ILocation } from './Location';

// Define the Responsible details schema
const ResponsableSchema = new Schema({
    name: { type: String, required: true },
    middleName: String,
    surname: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    email: String,
    relationshipToStudent: { type: String, enum: ['father', 'mother', 'sibling', 'relative', 'sponsor'], default: 'father', required: true },
});

export interface IResponsableSchema {
    name: string
    middleName?: string,
    surname: string,
    phoneNumber: string,
    address: string,
    email?: string,
    relationshipToStudent: string,
};

// Define the Student schema
const StudentSchema = new Schema({
    gender: { type: String, enum: ['male', 'female'], default: 'male' },
    name: { type: String, required: true, index: true },
    middleName: String,
    surname: { type: String, required: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    phoneNumber: String,
    responsables: [ResponsableSchema], // Array of Responsible details
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'class' },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'location' },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },
});

export interface IStudent extends Document {
    gender: string;
    name: string;
    middleName?: string;
    surname: string;
    dob: Date;
    address: string;
    phoneNumber?: string;
    responsables: IResponsableSchema[];
    class?: IClass;
    location?: ILocation;
    status: string;
    dateCreated: Date;
    dateModified: Date;
}

const StudentModel = mongoose.model<IStudent>('student', StudentSchema);

export default StudentModel;



