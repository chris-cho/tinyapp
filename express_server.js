const express = require("express");
const app = express();
const { generateRandomString, urlsForUser } = require("./helper");
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", user_id: "b2xV22"},
  "9sm5xK": { longURL: "http://www.google.com", user_id: "b2xV22"}
};

const user = { "b2xV22": { id: "b2xV22", email: "test@gmail.com", password: bcrypt.hashSync("1234", 10) }};

const templateVars = {
  urlDatabase: "",
  user: "",
};

app.get("/", (req, res) => {
  res.redirect(`/urls`);
});

app.get("/urls/", (req, res) => {
  if (req.cookies["user_id"]) {
    templateVars.user = user[req.cookies["user_id"]].email;
    templateVars.urlDatabase = urlsForUser(req.cookies["user_id"], urlDatabase);
  }
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (req.cookies["user_id"]) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  if (req.cookies["user_id"]) {
    const temp = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: templateVars.user};
    res.render("urls_show", temp);
  } else {
    res.redirect("/urls");
  }
});

app.post("/urls", (req, res) => {
  let newUrl = "";
  for (let i = 0; i < 6; i++) {
    newUrl += generateRandomString();
  }
  urlDatabase[newUrl] = { longURL: req.body.longURL, user_id: req.cookies["user_id"] };
  res.redirect(`/urls/${newUrl}`);
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL].longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlDatabase[req.params.shortURL].user_id === req.cookies["user_id"]) {
    delete urlDatabase[req.params.shortURL];
  }
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  if (req.cookies["user_id"]) {
    urlDatabase[req.params.shortURL] = { longURL: req.body.longURL, user_id: res.cookie["user_id"] };
  }
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  for (const u in user) {
    if (user[u].email === req.body.email) {
      if (bcrypt.compareSync(req.body.password, user[u].password)) {
        res.cookie("user_id", user[u].id);
        return res.redirect("/urls");
      } else {
        return res.status(403).send("Wrong password");
      }
    }
  }
  return res.status(403).send(`${req.body.email} does not exist`);
});

app.post("/logout", (req, res) => {
  templateVars.user = "";
  res.clearCookie("user_id");
  templateVars.urlDatabase = "";
  templateVars.user = "";
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
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
    password: bcrypt.hashSync(req.body.password, 10)
  };
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});