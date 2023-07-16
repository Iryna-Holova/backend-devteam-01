function validationMessage({ name }) {
  return {
    "string.empty": `The ${name} field must be not empty`,
    "any.required": `The ${name} field is required`,
    "string.base": `The ${name} field is invalid`,
    "array.min": `The ${name} must has at least 1 item`,
    "string.min": `The ${name} must has at least 2 characters`,
    "string.length": `The ${name} must be 24 characters long`,
  };
}

module.exports = validationMessage;
