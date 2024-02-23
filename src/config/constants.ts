/* eslint-disable prettier/prettier */
export const MONGODB_URI = 'mongodb+srv://admin:gPoWO0XVIIBlsZ9f@to-do-list.menfilj.mongodb.net/';

export const STATUS_CODES = {
    SUCCESS: {
        OK: 200,
        CREATED: 201,
    },
    CLIENT_EXCEPTION: {
        UNAUTHORIZED: 401,
        NOT_FOUND: 404,
        CONFLICT: 409,
        VALIDATION: 403
    },
    SERVER: {
        SERVER_ERROR: 500
    }
}

export const LANGUAGES = {
    ENGLISH: 'eng',
    ARABIC: 'arb'
}
