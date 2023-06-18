import mongoose from "mongoose";

export const connectMongo = async () => mongoose.connect(process.env.MONGO_URI);

// import { MongoClient, ServerApiVersion } from "mongodb";
// const uri = process.env.MONGO_URI;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// export const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// export const connectMongo = async () => {
//   // Connect the client to the server	(optional starting in v4.7)
//   await client.connect();
//   // Send a ping to confirm a successful connection
//   await client.db("oddsbet").command({ ping: 1 });
//   console.log("Pinged your deployment. You successfully connected to MongoDB!");
// };
