
import mongoose, { ConnectOptions } from "mongoose";

const MONGODB_URI = process.env.MONGO_DB_URL as string;

if (!MONGODB_URI) {
  throw new Error("❌ MongoDB connection string is missing in environment variables.");
}

let isConnected = false; 

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    console.log("🟡 Already connected to MongoDB.");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: "whispr", 
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    isConnected = db.connections[0].readyState === 1;

    if (isConnected) {
      console.log("🟢 Connected to MongoDB");
    } else {
      console.log("🟠 MongoDB connection failed");
    }

    mongoose.connection.on("error", (err) => {
      console.error("🔴 MongoDB connection error:", err);
    });

  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    throw error;
  }
};
