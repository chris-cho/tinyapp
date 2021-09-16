const { assert } = require('chai');

const { getUserByEmail, generateRandomString, urlsForUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const user_id = "22222";

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", user_id: "22222"},
  "9sm5xK": { longURL: "http://www.google.com", user_id: "b2xV22"}
};

describe('getUserByEmail', () => {
  it('should return a user with valid email', () => {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert(user, expectedOutput);
  });
});

describe('generateRandomString', () => {
  it('should return a random string', () => {
    const temp = generateRandomString();
    const expectedOutput = "s";
    assert(typeof temp, typeof expectedOutput);
  });
});

describe('urlsForUser', () => {
  it('should return a URL for the selected user', () => {
    const temp = urlsForUser(user_id, urlDatabase);
    const expectedOutput = { "22222": "http://www.lighthouselabs.ca" };
    assert(temp, expectedOutput);
  });
});