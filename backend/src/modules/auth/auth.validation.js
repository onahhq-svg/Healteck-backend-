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

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    });

const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.ref('newPassword'),
}).with('newPassword', 'confirmPassword');

export const validateForgotPassword = (p) => validate(forgotPasswordSchema, p);
export const validateResetPassword = (p) => validate(resetPasswordSchema, p);

export const validateRegister = (p) => validate(registerSchema, p);
export const validateLogin = (p) => validate(loginSchema, p);

export default { validateRegister, validateLogin, validateForgotPassword, validateResetPassword };
