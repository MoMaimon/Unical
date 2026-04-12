import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
  // Validate environment variable on startup
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI environment variable is not defined. " +
        "Please define it in your .env.local or environment configuration.",
    );
  }

  const connectionState = mongoose.connection.readyState;
  if (connectionState === 1) {
    console.log("DB is already connected");
    return;
  }

  if (connectionState === 2) {
    console.log("DB is connecting...");
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "university",
      bufferCommands: true,
    });
    console.log("Connected");
  } catch (error: Error | any) {
    console.log("Error connecting db | " + error);
    throw new Error(error.message); // TODO improve the error handling
  }
};

export default connect;
