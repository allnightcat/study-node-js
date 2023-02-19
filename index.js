const express = require("express");
const app = express();
const port = 5000;

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://allnightcat12:abcd1234@boilerplate.zyfpb1f.mongodb.net/?retryWrites=true&w=majority",
    {}
  )
  .then(() => console.log("MongoDB connedted!"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
