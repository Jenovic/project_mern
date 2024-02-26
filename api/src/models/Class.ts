import mongoose, { Document, Schema } from 'mongoose';

// Define the Class schema
const ClassSchema = new Schema({
    name: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

export interface IClass extends Document {
    name: string;
    date: Date;
}

const ClassModel = mongoose.model<IClass>('Class', ClassSchema);

export default ClassModel;
