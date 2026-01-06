import Joi from "joi";

const updateSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)"))
    .message("Password must contain upper, lower and a number")
    .optional(),
});

export const validateUpdate = (payload) => {
  const { error, value } = updateSchema.validate(payload);
  if (error) {
    const err = new Error(error.details.map((d) => d.message).join(", "));
    err.status = 400;
    throw err;
  }
  return value;
};

export default { validateUpdate };
