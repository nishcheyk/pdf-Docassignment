const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const authRoutes = require("./Routes/authRoutes");
const userRoutes = require("./Routes/userRoutes");
const pdfRoutes = require("./Routes/pdfRoutes");

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://pdf-doc-5gn6.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed from this origin: " + origin));
    }
  },
  credentials: true
}));
app.options("*", cors());

app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Routes
app.use("/auth", authRoutes);
app.use("/pdf", pdfRoutes);
app.use("/user", userRoutes);

app.listen(5000, () => console.log("Server is running on port 5000"));
