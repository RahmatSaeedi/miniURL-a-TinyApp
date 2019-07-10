const express = require("express");
const bodyParser = require("body-parser");
const { generateRandomString } = require("./generateRandomString");
const app = express();
const PORT = 80;

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", 'ejs');

const urlDatabase = {
  "LH" : "https://www.lighthouselabs.ca",
  "g" : "https://www.google.ca"
};

app.get("/", (req, resp) => {
  resp.render("urls_index", {
    'urls': urlDatabase
  });
});

app.get("/urls", (req, resp) => {
  resp.render("urls_index", {
    'urls': urlDatabase
  });
});

app.post('/urls', (req, resp) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  
  resp.send("OK");
});

app.get("/urls.json", (req, resp) => {
  resp.json(urlDatabase);
});

app.get("/urls/new", (req, resp) => {
  resp.render("urls_new");
});

app.get('urls/:shortURL', (req, resp) => {

  resp.render("urls_show", {
    longURL: urlDatabase[req.params.shortURL],
    shortURL: req.params.shortURL
  });
});

app.get(`/u/:shortURL`, (req, resp) => {
  resp.redirect(urlDatabase[req.params.shortURL], 302);
});

app.listen(PORT, () => {
  console.log(`The app listening on port ${PORT}`);
});