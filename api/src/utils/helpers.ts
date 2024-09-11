
import mongoose from "mongoose";
// Custom validation function to check if a string is a valid MongoDB ObjectID
export const isValidObjectId = (value: string) => {
    return mongoose.Types.ObjectId.isValid(value);
};

export const sortByPendingAndName = (entities: any, asName: boolean) => {
    return entities.sort((a: any, b: any) => {
        // Compare status (pending first)
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;

        // If both have the same status, compare surname
        return asName ? a.name.localeCompare(b.name) : a.surname.localeCompare(b.surname);
    });
}
