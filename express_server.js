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

app.get('/', (req, resp) => {
  resp.render("urls_index", {
    'urls': urlDatabase
  });
});

app.get('/urls', (req, resp) => {
  resp.render("urls_index", {
    'urls': urlDatabase
  });
});

app.post('/urls', (req, resp) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  resp.redirect(`urls/${shortURL}`);
});

app.get('/urls.json', (req, resp) => {
  resp.json(urlDatabase);
});

app.get('/urls/new', (req, resp) => {
  resp.render("urls_new");
});

app.get('/urls/:shortURL', (req, resp) => {
  resp.render("urls_show", {
    longURL: urlDatabase[req.params.shortURL],
    shortURL: req.params.shortURL
  });
});

app.get('/u/:shortURL', (req, resp) => {
  resp.redirect(302, urlDatabase[req.params.shortURL]);
});

app.post('/urls/:shortURL/delete', (req, resp) => {
  delete urlDatabase[req.params.shortURL];
  resp.redirect('/');
});

app.post('/urls/:shortURL/update', (req, resp) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  resp.redirect('/');
});

app.listen(PORT, () => {
  console.log(`The app listening on port ${PORT}`);
});