const Joi = require("joi");

const validate = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(5).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(12).required(),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({ "any.only": "Passwords do not match" }),
    userRole: Joi.string().required()
  });

  return schema.validate(user);
};

module.exports = validate;
