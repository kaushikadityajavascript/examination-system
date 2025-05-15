const Joi = require("joi");
const validateRequest = require("../middlewares/validateRequest");
const { phoneValidation } = require("./extension/phone");

const addSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    password: Joi.string()
      .required()
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};':\"\\\\|,.<>/?]).{8,}$"
        )
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      }),
    phone: Joi.string()
      .trim()
      .required()
      .custom(phoneValidation, "phone is invalid"),
    gender: Joi.string().valid("male", "female", "others"),
  });
  validateRequest(req, res, next, schema);
};

const addAdminSchema = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    password: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};':\"\\\\|,.<>/?]).{8,}$"
        )
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      }),
    phone: Joi.string()
      .trim()
      .required()
      .custom(phoneValidation, "phone is invalid"),
    gender: Joi.string().valid("male", "female", "others"),
    secret: Joi.string().required().messages({
      "any.required": "Admin secret is required",
    }),
  });

  validateRequest(req, res, next, schema);
};

module.exports = {
  addSchema,
  addAdminSchema,
};
