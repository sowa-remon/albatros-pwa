const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const authRoutes = require("./routes/auth");

require('dotenv').config();
const httpPort = process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use('/auth', authRoutes);

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(httpPort || 3000, function () {
  console.log(`Listening on port ${httpPort}!`);
});
