const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { generateRandomString } = require("./generateRandomString");
const { lookupUser } = require('./lookupUser');
const app = express();
const PORT = 80;

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", 'ejs');

const urlDatabase = {
  "LH" : "https://www.lighthouselabs.ca",
  "g" : "https://www.google.ca"
};

const users = {
  "test1": {
    id: "test1",
    email: "email1@test",
    password: "pass"
  }
};


app.get('/', (req, resp) => {
  if (req.cookies.user_id !== undefined) {
    resp.cookie(`user_id`, req.cookies.user_id, { expires: new Date(Date.now() + 60000)});
    resp.render("urls_index", {
      'user_id': req.cookies.user_id,
      'user_email': users[req.cookies.user_id].email,
      'urls': urlDatabase
    });
  } else {
    resp.render("urls_index", {
      'ursals': {}
    });
  }
});

app.get('/login', (req, resp) => {
  if (req.cookies.user_id !== undefined) {
    resp.cookie(`user_id`, req.cookies.user_id, { expires: new Date(Date.now() + 60000)});
    resp.render("urls_index", {
      'user_id': req.cookies.user_id,
      'user_email': users[req.cookies.user_id].email,
      'urls': urlDatabase
    });
  } else {
    resp.render("urls_login");
  }
});

app.get('/register', (req, resp) => {
  if (req.cookies.user_id === undefined) {
    resp.render("urls_register");
  } else {
    resp.statusCode = 400;
    resp.json({
      "Error" : 400,
      "Info" : "It seems you are already a member. Please logout first!"
    });
  }
});

app.get('/urls', (req, resp) => {
  if (req.cookies.user_id !== undefined) {
    resp.cookie(`user_id`, req.cookies.user_id, { expires: new Date(Date.now() + 60000)});
    resp.render("urls_index", {
      'user_id': req.cookies.user_id,
      'user_email': users[req.cookies.user_id].email,
      'urls': urlDatabase
    });
  } else {
    resp.redirect('/');
  }
});

app.get('/urls.json', (req, resp) => {
  if (req.cookies.user_id !== undefined) {
    resp.cookie(`user_id`, req.cookies.user_id, { expires: new Date(Date.now() + 60000)});
    resp.json(urlDatabase);
  } else {
    resp.statusCode = 404;
    resp.json({
      "Error" : 404,
      "Info" : "Please login first!"
    });
  }
});

app.get('/urls/new', (req, resp) => {
  if (req.cookies.user_id !== undefined) {
    resp.cookie(`user_id`, req.cookies.user_id, { expires: new Date(Date.now() + 60000)});
    resp.render("urls_new", {
      'user_id': req.cookies.user_id,
      'user_email': users[req.cookies.user_id].email
    });
  } else {
    resp.redirect('/');
  }

});

app.get('/urls/:shortURL', (req, resp) => {
  if (req.cookies.user_id !== undefined) {
    resp.cookie(`user_id`, req.cookies.user_id, { expires: new Date(Date.now() + 60000)});
    resp.render("urls_show", {
      'user_id': req.cookies.user_id,
      'user_email': users[req.cookies.user_id].email,
      'longURL': urlDatabase[req.params.shortURL],
      'shortURL': req.params.shortURL
    });
  } else {
    resp.redirect('/');
  }
});

app.get('/u/:shortURL', (req, resp) => {
  resp.redirect(302, urlDatabase[req.params.shortURL]);
});

app.post('/login', (req, resp) => {
  if (lookupUser(req.body.email, req.body.password, users)) {
    resp.cookie(`user_id`, lookupUser(req.body.email, req.body.password, users), { expires: new Date(Date.now() + 60000)});
    resp.redirect('/urls');
  } else {
    resp.statusCode = 403;
    resp.json({
      "Error" : "403 - Not Found!",
      "Info" : "Unknown user!"
    });
  }
});

app.post('/logout', (req, resp) => {
  resp.cookie(`user_id`, '', { expires: new Date(Date.now()) });
  resp.redirect('/');
});

app.post('/register', (req, resp) => {
  if (req.body.email && req.body.password) {
    const email = req.body.email;
    const password = req.body.password;
    if (!lookupUser(email, null, users)) {
      const userID = generateRandomString();
      users[userID] = {
        "id": userID,
        "email": email,
        "password": password
      };
      resp.cookie('user_id', userID, { expires: new Date(Date.now() + 60000) });
      resp.redirect('/urls');
    } else {
      resp.statusCode = 400;
      resp.json({
        "Error" : 400,
        "Info" : "A user with that email address already exists!"
      });
    }
  } else {
    resp.statusCode = 400;
    resp.json({
      "Error" : 400,
      "Info" : "Empty username or password!"
    });
  }
});

app.post('/urls/new', (req, resp) => {
  // need to authenticate here
  if (req.body.longURL !== undefined) {
    const longURL = req.body.longURL;
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = longURL;
    resp.redirect(`/urls/${shortURL}`);
  }
});

app.post('/urls/:shortURL/delete', (req, resp) => {
  // need to authenticate here
  delete urlDatabase[req.params.shortURL];
  resp.redirect('/');
});

app.post('/urls/:shortURL/update', (req, resp) => {
  // need to authenticate here
  urlDatabase[req.params.shortURL] = req.body.longURL;
  resp.redirect('/');
});

app.listen(PORT, () => {
  console.log(`The app listening on port ${PORT}`);
});