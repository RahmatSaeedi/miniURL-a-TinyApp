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

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});