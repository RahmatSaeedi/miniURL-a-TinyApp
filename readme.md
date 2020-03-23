# [`miniURL`][miniurl] - a `TinyApp` Project

[`miniurl`][miniurl] is a full stack web application, built with [`Node`][node] and [`Express`][express], that allows users to shorten long URLs (similar to [bit.ly][bit.ly]). This project was built as a *proof of concept* for  for learning purposes. 

**_BEWARE:_ This application _does not store_ Users and URL databases to hard disk or external databases. Once the application is restarted all changes are lost, thus changes to [lookupURL.js][lookupURL] and [lookupUser.js][lookupUser] are needed to store these values.**

# Usage
Install it:
```bash
  npm install @rahmatsaeedi/miniurl
```

Run it:
```bash
  node express_server
```
# Security Issues
The application uses unsigned cookies, with  32 alphanumeral-characters (a-z, A-Z, 0-9) as the session identity; hence, being vulnerable to [`Pass the Cookie`][passTheCookie] attack, and [`session hijacking`][sessionHijacking] if used without TLS/SSL connection.

Also, [lookupURL.js][lookupURL] and [lookupUser.js][lookupUser] contains two registered users  ([`admin@example.com`][lookupUser] and [`example@example.com`][lookupUser]) and a session cookie ( [`sessionID`][lookupURL] ) for demonistration purposes. These `users`, their associated [`URLs`][lookupURL], and the `session` can be safely deleted.

# Dependencies
  * [`Node.js`][node]
  * [`Express`][express]
  * [`EJS`][ejs]
  * [`bcrypt`][bcrypt]
  * [`body-parser`][bparser]
  * [`cookie-parser`][cparser]

# Documentations
[`views`](/views) folder contain webpage templates.

[`express_server.js`](express_server.js) contain server logics, routing routes, and overall behaviours settings.

[`lookupURL.js`](lookupURL.js) contains logics related to processing stored shorcode for URLs, such as: 
  * `addURL (shortURL, longURL, userID)` : Stores the short/long url pair to URL database of the logged-in user with the session id `userID`.
  * `removeURL (shortURL, userID) ` : Removes the stored URL with shortcode `shortURL` from URL database of the logged-in user with session id `userID`.
  * `updateURL (shortURL, longURL, userID)` : Updates the short/long url pair of the logged-in user with the session id `userID`.
  * `getURL (shortURL, incrementVisit = false)` : Returns the url object with the shortcode `shortURL`.

  * Example of a URL object stored within the DB
    ```js
      "g" : {
        shortURL : "g",
        longURL : "https://www.google.ca",
        userID : "userID",
        lastUpdated : Date.now(),
        'visits' : 50
      }
    ```

[`lookupUser.js`](lookupUser.js) : contains logics related to processing stored shorcode for URLs: 

  * `initSessions ()` : Sets an interval to delete expired sessions routinly. Cleaning happens once every _localVariables.sessionDuration_ minutes.
  * `authenticate (email, pass)` : Authenticates plaintext password *pass* of user with email *email* against the stored hashed password.
  * `createSession (email, pass)` : Creates and returns a session key for the user with given _email_ and plaintext _pass_.
  * `destroySession (sessionID)` : Deletes the given session from _sessions_ object.
  * `extendSession (sessionID)` : Changes the expiry time of the session with given session id to _Date.now() + localVariables.sessionDuration_.
  * `getSessionUserID (sessionID)` : Returns _user id_ of the _session user_ with the given _session id_.
  * `getUserEmailByID (userID)` : Returns _email address_ of the _session user_ with the given _session id_.
  * `getSessionExpires (sessionID)` : Returns _expiry time_ of the _session_ with the given _session id_.
  * `authenticateSession (sessionID)` : Returns a _boolean_ if the session exists and has not expired yet.
  * `registerNewUser (email, pass)` : Adds a new _user object_ to the _users object_. `pass` is plaintext password, and the _user object_ contains the _hashe password_.
  * `isRegistered (email)` : Returns a _true_, if a _user object_ with the given _email address_ exists. Else, returns _false_.
  * `addToURI (uri, value, sessionID)` : Adds the object/array/value `value` to the _user object_ of the session-holder with the given _sessionID_. `uri` is a string, a key within the _user object_. 
  * `deleteFromURI (uri, value, sessionID)` : Removes the object/array/value `value` from the _user object_ of the session-holder with the given _sessionID_. `uri` is a string, a key within the _user object_.
  * `getURI (uri, sessionID)` : For the session-holder `XYZ`, this returns the value of `XYZ[uri]`. _uri_ is a string, a key, within the _user object_.

[`generateRandomString.js`](generateRandomString.js) :
  * `generateRandomString(length = 7)` generates a random string that starts with an alphabet and given _length_.

***Document Tree***

```
│
├─── doc
│   ├─── errors.PNG
│   ├─── login.PNG
│   ├─── register.PNG
│   ├─── urls.edit.PNG
│   └─── urls.PNG
│
├─── node_modules
│   ├─── ...
│   ...
│
├─── views
│   ├─── favicon.ico
│   ├─── urls_errors.ejs
│   ├─── urls_index.ejs
│   ├─── urls_login.ejs
│   ├─── urls_new.ejs
│   ├─── urls_register.ejs
│   ├─── urls_show.ejs
│   └─── _header.ejs
├─── .gitignore
├─── express_server.js
├─── generateRandomString.js
├─── lookupURL.js
├─── lookupUser.js
├─── package-lock.json
├─── package.json
└─── readme.md
```


# Final Product
## Login Page
![Login Page][login]

## Registeration Page
![Registeration Page][register]

## URLs Index
![Registered URLs][urls]

## URLs Edit / Show
![Edit / Show URLs][urls.edit]

## Example Errors
![Example Errors][errors]




[miniurl]: https://www.npmjs.com/package/@rahmatsaeedi/miniurl
[ejs]: https://www.npmjs.com/package/ejs
[bcrypt]: https://www.npmjs.com/package/bcrypt
[bparser]: https://www.npmjs.com/package/body-parser
[cparser]: https://www.npmjs.com/package/cookie-parser
[node]: https://github.com/nodejs/node
[express]: https://github.com/expressjs/express
[bit.ly]: https://bitly.com/
[passTheCookie]: https://wunderwuzzi23.github.io/blog/passthecookie.html
[sessionHijacking]: https://en.wikipedia.org/wiki/Session_hijacking
[login]: /doc/login.PNG
[register]: /doc/register.PNG
[urls]: /doc/urls.PNG
[urls.edit]: /doc/urls.edit.PNG
[errors]: /doc/errors.PNG
[lookupUser]: lookupUser.js
[lookupURL]: lookupURL.js

