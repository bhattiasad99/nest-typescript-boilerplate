import { CreateUserDTO } from "@/dto.types";
import Joi from "joi";

export const validateLogin = (body: CreateUserDTO) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    })
    const validate = schema.validate(body);
    return validate
}
