function upCaseFirstLetter(string) {
  return string
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1))
    .join(" ");
}

module.exports = upCaseFirstLetter;
