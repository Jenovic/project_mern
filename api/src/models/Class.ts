import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

// Define the Class schema
const ClassSchema = new Schema({
    name: { type: String, required: true },
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },
});

export interface IClass extends Document {
    name: string;
    dateCreated: Date;
    dateModified: Date;
}

const ClassModel = mongoose.model<IClass>('Class', ClassSchema);

export default ClassModel;
