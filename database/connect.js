import mongoose from "mongoose";

export const connectMongo = async (res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    return true;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
    return false;
  }
};
