const checkASCII = (int) => {
  if ((int > 47 && int < 58) || (int > 64 && int < 91) || (int > 96 && int < 123)) return (int);
  else return generateRandomString();
};

const generateRandomString = () => {
  return checkASCII(Math.floor(Math.random() * 100));
};

for (let i = 0; i < 6; i++) {
  let temp = generateRandomString();
  console.log(String.fromCharCode(temp));
}

module.exports(generateRandomString);