import mongoose from "mongoose";

console.log(process.env.MONGO_URI);
export const connectMongo = async () =>
  mongoose.connect(process.env.MONGO_URI, { dbName: "oddsbet" });
// export const connectMongo = async () => mongoose.connect(process.env.MONGO_URI);
