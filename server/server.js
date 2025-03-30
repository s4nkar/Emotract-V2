import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // ✅ Import user routes

dotenv.config({ path: "./.env" });

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

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

    // Start the server after DB connection
    const PORT = process.env.PORT || 5003;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes); // ✅ Add user routes

// Root Route
app.get("/", (req, res) => {
  res.send("🚀 Chat API is running...");
});

export default app;
