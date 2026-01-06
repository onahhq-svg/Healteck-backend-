import Joi from "joi";

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)"))
    .message("Password must contain upper, lower and a number")
    .required(),
  name: Joi.string().max(100).optional(),
  role: Joi.string().valid("USER", "ADMIN").default("USER"),
});

const updateRoleSchema = Joi.object({
  role: Joi.string().valid("USER", "ADMIN").required(),
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

export const validateCreateUser = (p) => validate(createUserSchema, p);
export const validateUpdateRole = (p) => validate(updateRoleSchema, p);

export default { validateCreateUser, validateUpdateRole };
