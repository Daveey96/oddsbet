import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  balance: Number,
  verified: Boolean,
  token: String,
  currentStage: Number,
  betHistory: Array,
});

const ticketSchema = new Schema({
  code: String,
  slip: {
    type: String,
    required: true,
  },
  odds: String,
  users: [
    { stake: String, user: { type: Schema.Types.ObjectId, ref: "User" } },
  ],
});

export const Ticket = models.Ticket || model("Ticket", ticketSchema);
export const User = models.User || model("User", userSchema);
