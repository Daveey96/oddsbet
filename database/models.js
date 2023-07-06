import { Schema, models, model } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  balance: Number,
  token: String,
  currentStage: Number,
  activeBets: [
    {
      ticket: { type: Schema.Types.ObjectId, ref: "Ticket" },
      stake: String,
      odds: String,
    },
  ],
});

const ticketSchema = new Schema(
  {
    code: String,
    slip: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const User = models?.User || model("User", userSchema);
export const Ticket = models?.Ticket || model("Ticket", ticketSchema);
