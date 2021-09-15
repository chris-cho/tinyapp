const express = require("express");
const app = express();
const { generateRandomString } = require("./generateRandomString");
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const user = {};


app.get("/", (req, res) => {
  res.redirect(`/urls`);
});

app.get("/urls/", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"],
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  let newUrl = "";
  for (let i = 0; i < 6; i++) {
    newUrl += generateRandomString();
  }
  urlDatabase[newUrl] = req.body.longURL;
  res.redirect(`/urls/${newUrl}`);
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  for (const u in user) {
    if (user[u].email === req.body.email) {
      if (user[u].password === req.body.password) {
        res.cookie("username", req.body.email);
        return res.redirect("/urls");
      } else {
        return res.status(400).send("Wrong password");
      }
    }
  }
  return res.status(400).send(`${req.body.email} does not exist`);
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  let temp = "";
  for (let i = 0; i < 6; i++) {
    temp += generateRandomString();
  }

  if (!req.body.email) return res.status(400).send("empty email");
  if (!req.body.password) return res.status(400).send("empty password");

  for (const u in user) {
    if (user[u].email === req.body.email) return res.status(400).send(`${user[u].email} already exists`);
  }

  user[temp] = {
    id: temp,
    email: req.body.email,
    password: req.body.password
  };
  res.cookie("userID", user[temp].id);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});