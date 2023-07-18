const validationMessages = {
  "string.empty": "{#label} field must be not empty",
  "string.base": "{#label} field is invalid",
  "string.min": "{#label} must has at least {#limit} characters",
  "string.max": "{#label} must has up to {#limit} characters",
  "string.length": "{#label}must be {#limit} characters long",
  "string.hex": "{#label} must only contain hexadecimal characters",
  "string.pattern.base": "{#label} should be as user@example.com.",
  "number.min": "{#label} must be not lower than {#limit}",
  "array.min": "{#label} must contain at least {#limit} item",
  "array.base": "{#label} must be an array",
  "any.required": "{#label} field is required",
  "any.only": "{#label} must be one of {#valids}",
};

module.exports = validationMessages;
