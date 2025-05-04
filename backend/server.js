const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const commentRoutes = require("./routes/commentRoute");
require("dotenv").config();

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// Secure HTTP headers
app.use(helmet());

// Rate Limiting: 100 requests per 15 mins per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Routes
app.use("/api/comments", commentRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
