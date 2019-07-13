const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { generateRandomString } = require("./generateRandomString");
const { addURL, removeURL, updateURL, getURL } = require('./lookupURL');
const {
  initSessions,
  authenticateSession,
  createSession,
  destroySession,
  extendSession,
  getSessionUserID,
  getUserEmailByID,
  getSessionExpires,
  registerNewUser,
  isRegistered,
  addToURI,
  deleteFromURI,
  getURI } = require('./lookupUser');

const PORT = 80;
const app = express();
initSessions();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", 'ejs');

const updateCookie = (resp, sessionID) => {
  sessionID = typeof(sessionID) === 'string' ? sessionID : false;
  if (sessionID && extendSession(sessionID)) {
    resp.cookie('session_id', sessionID,{ expires: getSessionExpires(sessionID) });
    return resp;
  } else {
    return resp;
  }
};

const destroyCookie = (resp, sessionID = false) => {
  destroySession(sessionID);
  resp.cookie('session_id', '', { expires: new Date(Date.now()) });
};


app.get('/', (req, resp) => {
  if (authenticateSession(req.cookies.session_id)) {
    resp.redirect('/urls');
  } else {
    resp.redirect("/login");
  }
});

app.get('/clean', (req, resp) => {
  destroyCookie(resp, req.cookies.session_id);
  resp.send('Cleaned');
});

app.get('/login', (req, resp) => {
  if (authenticateSession(req.cookies.session_id)) {
    resp.redirect("/urls");
  } else {
    resp.render("urls_login");
  }
});

app.get('/register', (req, resp) => {
  if (authenticateSession(req.cookies.session_id)) {
    resp.redirect("/");
  } else {
    resp.render("urls_register");
  }
});

app.get('/logout', (req, resp) => {
  if (authenticateSession(req.cookies.session_id)) {
    destroyCookie(resp, req.cookies.session_id);
    resp.redirect('/');
  } else {
    resp.redirect('/');
  }
});

app.get('/urls', (req, resp) => {

  if (authenticateSession(req.cookies.session_id)) {
    updateCookie(resp, req.cookies.session_id);
    
    let urls = {};
    for (let shortCode of getURI('urls', req.cookies.session_id)) {
      let URL = getURL(shortCode);
      
      if (URL) {
        urls[shortCode] = URL;
      }
    }

    resp.render("urls_index", {
      'session_id': req.cookies.session_id,
      'user_email': getUserEmailByID(getSessionUserID(req.cookies.session_id)),
      'urls': urls
    });
  } else {
    resp.render("urls_errors", {
      errorMessage : "Please Login First"
    });
  }
});

app.get('/urls.json', (req, resp) => {
  if (authenticateSession(req.cookies.session_id)) {
    updateCookie(resp, req.cookies.session_id);

    let urls = {};
    for (let shortCode of getURI('urls', req.cookies.session_id)) {
      let URL = getURL(shortCode);
      if (URL) {
        urls[shortCode] = URL;
      }
    }

    resp.json(urls);
  } else {
    resp.statusCode = 404;
    resp.json({
      "Error" : 404,
      "Info" : "Please login first!"
    });
  }
});

app.get('/urls/new', (req, resp) => {
  if (authenticateSession(req.cookies.session_id)) {
    updateCookie(resp, req.cookies.session_id);
    resp.render("urls_new", {
      'session_id': req.cookies.session_id,
      'user_email': getUserEmailByID(getSessionUserID(req.cookies.session_id))
    });
  } else {
    resp.redirect('/login');
  }

});

app.get('/urls/:shortURL', (req, resp) => {
  const url = getURL(req.params.shortURL);
  if (!url) {
    resp.render("urls_errors", {
      errorMessage : "Unknown short code",
      'session_id': req.cookies.session_id,
      'user_email': getUserEmailByID(getSessionUserID(req.cookies.session_id))
    });
  } else if (!authenticateSession(req.cookies.session_id)) {
    resp.render("urls_errors", {
      errorMessage : "Please Login First",
      'session_id': req.cookies.session_id,
      'user_email': getUserEmailByID(getSessionUserID(req.cookies.session_id))
    });
  } else if (authenticateSession(req.cookies.session_id) &&  url && getSessionUserID(req.cookies.session_id) === url.userID) {
    updateCookie(resp, req.cookies.session_id);
    resp.render("urls_show", {
      'session_id': req.cookies.session_id,
      'user_email': getUserEmailByID(getSessionUserID(req.cookies.session_id)),
      'url': url
    });
  } else {
    resp.render("urls_errors", {
      errorMessage : "Are you sure this belongs to you?",
      'session_id': req.cookies.session_id,
      'user_email': getUserEmailByID(getSessionUserID(req.cookies.session_id))
    });
  }
});

app.get('/u/:shortURL', (req, resp) => {
  const url = getURL(req.params.shortURL, true);
  if (url) {
    resp.redirect(302, url.longURL);
  } else {
    resp.render("urls_errors", {
      errorMessage : "Requested URL is no more!...",
      'session_id': req.cookies.session_id,
      'user_email': getUserEmailByID(getSessionUserID(req.cookies.session_id))
    });
  }
});

app.post('/login', (req, resp) => {
  const sessionID = createSession(req.body.email, req.body.password);
  if (sessionID) {
    updateCookie(resp, sessionID);
    resp.redirect('/urls');
  } else {
    resp.render("urls_login", {
      errorMessage : "Unknown or incorrect username / pass combination.",
      'session_id': req.cookies.session_id,
      'user_email': getUserEmailByID(getSessionUserID(req.cookies.session_id))
    });
  }
});

app.post('/logout', (req, resp) => {
  destroyCookie(resp, req.cookies.session_id);
  resp.redirect('/');
});

app.post('/register', (req, resp) => {
  if (req.body.email && req.body.password) {
    const email = req.body.email;
    const password = req.body.password;
    if (!isRegistered(email)) {
      registerNewUser(email, password);
      updateCookie(resp, createSession(email, password));
      resp.redirect('/urls');
    } else {
      resp.statusCode = 400;
      resp.render("urls_errors", {
        errorMessage : "A user with that email address already exists!",
        'session_id': req.cookies.session_id,
        'user_email': getUserEmailByID(getSessionUserID(req.cookies.session_id))
      });
    }
  } else {
    resp.statusCode = 400;
    resp.render("urls_errors", {
      errorMessage : "Empty username or password!",
      'session_id': req.cookies.session_id,
      'user_email': getUserEmailByID(getSessionUserID(req.cookies.session_id))
    });
  }
});

app.post('/urls', (req, resp) => {
  if (authenticateSession(req.cookies.session_id) && req.body.longURL !== undefined) {
    const shortURL = generateRandomString();
    let r = addURL(shortURL, req.body.longURL, getSessionUserID(req.cookies.session_id));

    if (r) {
      addToURI('urls', shortURL, req.cookies.session_id);
      resp.redirect(`/urls/${shortURL}`);
    } else {
      resp.statusCode = 500;
      resp.render("urls_errors", {
        errorMessage : "Could not process the request.",
        'session_id': req.cookies.session_id,
        'user_email': getUserEmailByID(getSessionUserID(req.cookies.session_id))
      });
    }
  } else {
    resp.statusCode = 500;
    resp.render("urls_errors", {
      errorMessage : "Unauthorized",
      'session_id': req.cookies.session_id,
      'user_email': getUserEmailByID(getSessionUserID(req.cookies.session_id))
    });
  }
});

app.post('/urls/:shortURL/delete', (req, resp) => {
  const url = getURL(req.params.shortURL);
  if (authenticateSession(req.cookies.session_id) &&  url && getSessionUserID(req.cookies.session_id) === url.userID) {
    removeURL(req.params.shortURL, getSessionUserID(req.cookies.session_id));
    deleteFromURI('urls', req.params.shortURL, req.cookies.session_id);
    resp.redirect('/');
  } else {
    resp.statusCode = 500;
    resp.render("urls_errors", {
      errorMessage : "Unauthorized",
      'session_id': req.cookies.session_id,
      'user_email': getUserEmailByID(getSessionUserID(req.cookies.session_id))
    });
  }
});

app.post('/urls/:shortURL/update', (req, resp) => {
  const url = getURL(req.params.shortURL);
  if (authenticateSession(req.cookies.session_id) &&  url && getSessionUserID(req.cookies.session_id) === url.userID) {
    updateURL(req.params.shortURL, req.body.longURL, getSessionUserID(req.cookies.session_id));
    resp.redirect('/');
  } else {
    resp.statusCode = 500;
    resp.render("urls_errors", {
      errorMessage : "Unauthorized",
      'session_id': req.cookies.session_id,
      'user_email': getUserEmailByID(getSessionUserID(req.cookies.session_id))
    });
  }
});

app.use('/favicon.ico', express.static('views/favicon.ico'));

app.listen(PORT, () => {
  console.log(`The app listening on port ${PORT}`);
});