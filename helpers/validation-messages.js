function validationMessage({
  name,
  minStr,
  length,
  minArr,
  maxStr,
  valid = [],
  minNum,
}) {
  const validString = valid.join(", ");
  return {
    "string.empty": `${name} field must be not empty`,
    "string.base": `${name} field is invalid`,
    "string.min": `${name} must has at least ${minStr} characters`,
    "string.max": `${name} must has up to ${maxStr} characters`,
    "string.length": `${name} must be ${length} characters long`,
    "string.hex": `${name} must only contain hexadecimal characters`,
    "string.pattern.base": `${name} should be as user@example.com.`,
    "number.min": `${name} must be not lower than ${minNum}`,
    "array.min": `${name} must has at least ${minArr} item`,
    "array.base": `${name} must be an array`,
    "any.required": `${name} field is required`,
    "any.only": `${name} must be one of: ${validString}`,
  };
}

module.exports = validationMessage;
