require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use(cors());

const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/post", postRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ msg: "API" });
});

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

mongoose.set("strictQuery", true);

mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@blog.sb3ugzr.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Conectou ao MongoDB!");
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => console.log(err));
