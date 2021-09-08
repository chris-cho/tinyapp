const checkASCII = (int) => {
  if ((int > 47 && int < 58) || (int > 64 && int < 91) || (int > 96 && int < 123)) return String.fromCharCode(int);
  else return generateRandomString();
};

const generateRandomString = () => {
  return checkASCII(Math.floor(Math.random() * 100));
};

module.exports = { generateRandomString };