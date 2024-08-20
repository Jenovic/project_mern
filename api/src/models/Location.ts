import mongoose, { Document, Schema } from 'mongoose';

const LocationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zipcode: { type: String },
    dateCreated: { type: Date, default: Date.now },
    dateModified: { type: Date, default: Date.now }
});

export interface ILocation extends Document {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipcode?: string;
    dateCreated?: Date;
    dateModified?: Date;
}

const LocationModel = mongoose.model<ILocation>('location', LocationSchema);

export default LocationModel;
