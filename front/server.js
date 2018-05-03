const express = require("express");
const path = require("path");
const app = express();


app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "build")));


app.listen(2000);
