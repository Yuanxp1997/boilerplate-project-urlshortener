require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

const shortUrls = ["urls"];
app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});
app.use(bodyParser.urlencoded({ extended: false }));

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// get the url from the user push it to the shortUrls array and return the object
app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;
  const urlRegex = new RegExp(/^(http|https):\/\/[^ "]+$/);
  if (!urlRegex.test(url)) {
    res.json({ error: "invalid url" });
    return;
  }
  shortUrls.push(url);
  res.json({
    original_url: url,
    short_url: shortUrls.indexOf(url),
  });
});

// redirect the user to the original url
app.get("/api/shorturl/:short_url", (req, res) => {
  const short_url = req.params.short_url;
  const url = shortUrls[short_url];
  if (url) {
    res.redirect(url);
  } else {
    res.json({ error: "No short URL found for the given input" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
