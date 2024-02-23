/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose'

export interface TokenType {
    id?: string;
    refreshToken: string;
    active?: boolean;
}

export const TokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
})
