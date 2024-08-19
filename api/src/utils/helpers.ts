
import mongoose from "mongoose";
// Custom validation function to check if a string is a valid MongoDB ObjectID
export const isValidObjectId = (value: string) => {
    return mongoose.Types.ObjectId.isValid(value);
};