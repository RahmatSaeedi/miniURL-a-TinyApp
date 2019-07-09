const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", 'ejs');

const urlDatabase = {
  "LH" : "https://www.lighthouselabs.ca",
  "g" : "https://www.google.ca"
};

app.get("/urls", (req, resp) => {
  resp.render("urls_index", {
    'urls': urlDatabase
  });
});


app.get(`/urls/:shortURL`, (req, resp) => {

  resp.render("urls_show", {
    longURL: urlDatabase[req.params.shortURL],
    shortURL: req.params.shortURL
  });
});




app.get("/urls.json", (req, resp) => {
  resp.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`The app listening on port ${PORT}`);
});