const checkASCII = (int) => {
  if ((int > 47 && int < 58) || (int > 64 && int < 91) || (int > 96 && int < 123)) return String.fromCharCode(int);
  else return generateRandomString();
};

const generateRandomString = () => {
  return checkASCII(Math.floor(Math.random() * 100));
};

const urlsForUser = (id, urls) => {
  const newUrls = {};
  for (const [key, value] of Object.entries(urls)) {
    if (value.user_id === id) {
      newUrls[key] = value.longURL;
    }
  }
  return newUrls;
};

const getUserByEmail = (email, user) => {
  for (const u in user) {
    if (user[u].email === email) return user[u];
  }
};

module.exports = { generateRandomString, urlsForUser, getUserByEmail };