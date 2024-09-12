import mongoose from "mongoose";

export enum UserRole {
    SuperAdmin = 'superadmin',
    Admin = 'admin',
    Staff = 'staff'
}

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    avatar: {
        type: String
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.Staff,
    },
    regLink: {
        type: String,
    },
    registered: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateModified: {
        type: Date,
        default: Date.now
    }
});

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    avartar?: string;
    role?: UserRole;
    regLink?: string;
    registered?: boolean;
    dateCreated: Date;
    dateModified: Date;
}

const User = mongoose.model('user', UserSchema);

export default User;