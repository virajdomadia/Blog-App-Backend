const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const auth = require("./routes/authRoutes");
const blog = require("./routes/blogRoutes");
const comment = require("./routes/CommentRoutes");

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", auth);
app.use("/api/blogs", blog);
app.use(comment);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
