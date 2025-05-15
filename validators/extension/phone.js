const { phone } = require("phone");

const phoneValidation = (value, helpers) => {
  const phoneNumber = phone(value, { strictDetection: false });
  if (phoneNumber == false || phoneNumber.isValid === false) {
    return helpers.error("any.invalid");
  }

  return value;
};

module.exports = { phoneValidation };
