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
  pin: Number,
  demo: Boolean,
  currentStage: Number,
  active: [
    {
      ticket: { type: Schema.Types.ObjectId, ref: "Ticket" },
      stake: Number,
      totalOdds: Number,
      odds: Array,
    },
  ],
  history: [
    {
      date: String,
      games: [
        {
          ticket: { type: Schema.Types.ObjectId, ref: "Ticket" },
          stake: Number,
          totalOdds: Number,
          odds: Array,
        },
      ],
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
