require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

const postsRoutes = require("./routers/posts.js");

// OPTIONAL
app.use(express.static("public"));

const port = 3000;
const host = "http://127.0.0.1";

// const posts = require("./db/posts.js");

// const postsControllers = require('./controllers/postControllers.js')

app.listen(port, () => {
  console.log(`App listen on ${host}:${port}`);
});

app.get("/", (req, res) => {
  res.send("Express Blog Api Crud");
});

app.use("/posts", postsRoutes);
