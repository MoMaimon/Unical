import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
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
    await mongoose.connect(MONGODB_URI!, {
      dbName: "university",
      bufferCommands: true,
    });
    console.log("Connected");
  } catch (error: Error | any) {
    console.log("Error connecting db | " + error);
    throw new DBException(error.message); // TODO improve the error handling
  }
};

export default connect;
