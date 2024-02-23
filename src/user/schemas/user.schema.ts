/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose'

export interface UserType {
    id: string;
    role: 'admin' | 'user';
    username: string;
    password: string;
}


export const UserSchema = new mongoose.Schema({
    role: {
        type: String,
        validate: {
            validator: (role: string) => {
                return role === 'admin' || role === 'user'
            },
            message: "Invalid role provided! Must be user or admin!"
        }
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})
