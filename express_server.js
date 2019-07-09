const express = require("express");
const app = express();
const PORT = 8080;


const urlDatabase = {
  "LH" : "https://www.lighthouselabs.ca",
  "g" : "https://www.google.ca"
};

app.get("/", (req, resp) => {
  resp.send("Welcome");
});

app.get("/urls.json", (req, resp) => {
  resp.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`The app listening on port ${PORT}`);
});