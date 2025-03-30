import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import messageRoutes from "./routes/messageRoutes.js";

// Load environment variables from .env file
dotenv.config({ path: "./.env" }); 

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS for cross-origin requests

// MongoDB Connection
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined. Check your .env file.");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected...");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // Exit process with failure
  }
};

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api", messageRoutes);

// Root Route (Optional)
app.get("/", (req, res) => {
  res.send("🚀 Chat API is running...");
});

// Start the Server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
