const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const path = require("path");
const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  cloud: {
    id: "Test:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyRhYzM1ZmE1MzVmZDY0OGRmOTliNzM3MzljZGIwYjc2OSQ2NDBmOWMwNGI0YTI0YTVmOTI5MjMzMzE2ZDIzNjBiNQ==",
  },
  auth: { username: "elastic", password: "xAhAjdXu4Cl7HAwLAPDOT61Z" },
});

const connectDB = require("./server/database/connection");

const app = express();

app.use((req, res, next) => {
  req.elastic = client;
  next();
});

dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8080;

// log requests
app.use(morgan("tiny"));

// mongodb connection
connectDB();

// parse request to body-parser
app.use(bodyparser.urlencoded({ extended: true }));

// set view engine
app.set("view engine", "ejs");
//app.set("views", path.resolve(__dirname, "views/ejs"))

// load assets
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/img", express.static(path.resolve(__dirname, "assets/img")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));

// load routers
app.use("/", require("./server/routes/router"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
