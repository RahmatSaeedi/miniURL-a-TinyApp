const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { generateRandomString } = require("./generateRandomString");
const app = express();
const PORT = 80;

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", 'ejs');

const urlDatabase = {
  "LH" : "https://www.lighthouselabs.ca",
  "g" : "https://www.google.ca"
};

app.get('/', (req, resp) => {
  resp.render("urls_index", {
    'username': req.cookies.username,
    'urls': urlDatabase
  });
});
app.post('/', (req, resp) => {
  resp.cookie(`username`, req.body.username, { expires: new Date(Date.now() + 60000)});
  resp.redirect('/');
});

app.post('/logout', (req, resp) => {
  resp.cookie(`username`, '', { expires: new Date(Date.now()) });

  resp.redirect('/');
});

app.get('/register', (req, resp) => {
  resp.render("urls_register", {
    'username': req.cookies.username
  });
});


app.get('/urls', (req, resp) => {
  resp.render("urls_index", {
    'username': req.cookies.username,
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
  resp.render("urls_new",{
    'username': req.cookies.username
  });
});

app.get('/urls/:shortURL', (req, resp) => {
  resp.render("urls_show", {
    'username': req.cookies.username,
    'longURL': urlDatabase[req.params.shortURL],
    'shortURL': req.params.shortURL
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