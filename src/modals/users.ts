import { Document, Schema, model } from 'mongoose';

// Define the TypeScript interface for the user
export interface IUser extends Document {
    userId?: string;
    email: string;
    emailVerification: string;
    password?: string;
    userName?: string;
    avatar: string;
    type: string;
    roles: Array<{
        name: string;
        id: string;
        weight: number;
        icon: string;
        color: string;
    }>;
    warnings: number;
    locked: boolean;
    disabled: boolean;
    pwdresettoken: string;
    securityMails: boolean;
}

// Define the Mongoose schema using TypeScript
const userSchema = new Schema<IUser>({
    userId: {
        type: String,
    },
    email: {
        type: String,
        default: "none",
    },
    emailVerification: {
        type: String,
        default: "none",
    },
    password: {
        type: String,
    },
    userName: {
        type: String,
    },
    avatar: {
        type: String,
        default: "/avatars/defaults/default01.png",
    },
    type: {
        type: String,
        default: "private",
    },
    roles: {
        type: [
            {
                name: { type: String, required: true },
                id: { type: String, required: true },
                weight: { type: Number, required: true },
                icon: { type: String, required: true },
                color: { type: String, required: true },
            }
        ],
        default: [
            { name: "Nutzer", id: "user", weight: 10, icon: "/img/roleicons/user.png", color: "808080" }
        ],
    },
    warnings: {
        type: Number,
        default: 0,
    },
    locked: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    pwdresettoken: {
        type: String,
        default: "none",
    },
    securityMails: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
});

// Create and export the Mongoose model
const UserModel = model<IUser>('User', userSchema);

export default UserModel;