import { CreateUserDTO, RefreshTokenDTO } from '@/dto.types';
import * as Joi from 'joi';

export const validateCreateUser = (body: CreateUserDTO) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        role: Joi.string().valid('admin', 'user').optional(),
    })
    const validate = schema.validate(body);
    return validate
}
export const validateRefreshToken = (body: RefreshTokenDTO) => {
    const schema = Joi.object({
        refreshToken: Joi.string().required(),
    })
    const validate = schema.validate(body);
    return validate
}

export const validateFindUser = (body: { username: string }) => {
    const schema = Joi.object({
        username: Joi.string()
    })

    const validate = schema.validate(body)
    return validate
}