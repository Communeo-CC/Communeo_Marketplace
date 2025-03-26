import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import gigRoute from "./routes/gig.route.js";
import orderRoute from "./routes/order.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";
import reviewRoute from "./routes/review.route.js";
import authRoute from "./routes/auth.route.js";
import channelRoute from "./routes/channel.route.js";
import videoRoute from "./routes/video.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import healthRoute from "./routes/health.route.js";
import { router as sideProjectRouter } from './routes/api.js';

// Import User and Channel models
import User from "./models/user.model.js";
import { Channel } from "./models/channel.model.js";

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

// Connect to MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit if cannot connect to database
  }
};

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Security and logging middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Basic health check route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// API Routes
app.use("/api/health", healthRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/channels", channelRoute);
app.use("/api/videos", videoRoute);
app.use("/api/side", sideProjectRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  
  // Log error for debugging
  console.error(`Error ${errorStatus}: ${errorMessage}`);
  
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start the server
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  connect(); // Connect to MongoDB
  console.log(`Backend server is running on port ${PORT}!`);
});