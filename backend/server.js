const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
require("dotenv").config();

// Initialize app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});
// Socket.IO handlers
require("./sockets/socketHandler")(io);

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
const commentRoutes = require("./routes/commentRoute");
const discoverRoutes = require("./routes/discoverRoute");
const userRoutes = require("./routes/userRoutes");
const searchRoutes = require("./routes/searchRoute");

// Routes
app.use("/api/comments", commentRoutes);
app.use("/api/discover", discoverRoutes);
app.use("/api/users", userRoutes);
app.use("/api/search", searchRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server + Socket.IO running on port ${PORT}`);
});
