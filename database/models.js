import { Schema, models, model } from "mongoose";

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
  activebets: [],
});

const ticketSchema = new Schema({
  code: String,
  slip: {
    type: String,
    required: true,
  },
  odds: Number,
  users: [{ stake: String, id: String }],
});

// const goatSchema = new Schema({
//   fish: String,
//   dead: Boolean,
// });

// export const Goat = models.Goat || model("Goat", goatSchema);
export const User = models?.User || model("User", userSchema);
export const Ticket = models?.Ticket || model("Ticket", ticketSchema);
