import Joi from "joi";

const registerSchema = Joi.object({
    name: Joi.string().max(100).optional(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const validate = (schema, payload) => {
    const { error, value } = schema.validate(payload);
    if (error) {
        const err = new Error(error.details.map((d) => d.message).join(", "));
        err.status = 400;
        throw err;
    }
    return value;
    };

export const validateRegister = (p) => validate(registerSchema, p);
export const validateLogin = (p) => validate(loginSchema, p);

export default { validateRegister, validateLogin };
