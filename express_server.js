const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", 'ejs');

const urlDatabase = {
  "LH" : "https://www.lighthouselabs.ca",
  "g" : "https://www.google.ca"
};

app.get("/", (req, resp) => {

  resp.render('index', {urlDatabase});
});

app.get("/about", (req, resp) => {
  resp.render('about');
});


app.get("/urls.json", (req, resp) => {
  resp.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`The app listening on port ${PORT}`);
});