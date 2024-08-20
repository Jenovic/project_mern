import mongoose, { Document, Schema } from 'mongoose';
import { ILocation } from './Location';

// Define the Class schema
const ClassSchema = new Schema({
    name: { type: String, required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'location' },
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now },
});

export interface IClass extends Document {
    name: string;
    location?: ILocation;
    dateCreated: Date;
    dateModified: Date;
}

const ClassModel = mongoose.model<IClass>('class', ClassSchema);

export default ClassModel;
