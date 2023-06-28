import { Schema, models, model } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
  balance: Number,
  verified: Boolean,
  token: String,
  currentStage: Number,
  demo: false,
  demoBalance: Number,
  activebets: [{ type: Schema.Types.ObjectId, ref: "Ticket" }],
});

const ticketSchema = new Schema({
  code: String,
  slip: {
    type: String,
    required: true,
  },
});

// const goatSchema = new Schema({
//   fish: String,
//   dead: Boolean,
// });

// export const Goat = models.Goat || model("Goat", goatSchema);
export const User = models?.User || model("User", userSchema);
export const Ticket = models?.Ticket || model("Ticket", ticketSchema);
