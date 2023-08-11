import { Schema, models, model } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  token: String,
  pin: Number,
  balance: Number,
  currentStage: Number,
  forgotPass: Number,
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

const gameSchema = new Schema({
  data: Object,
  createdAt: { default: Date.now, type: Date, expires: "1m" },
});

const activeBetsSchema = new Schema({
  id: Schema.Types.ObjectId,
  ticket: { type: Schema.Types.ObjectId, ref: "Ticket" },
  totalOdds: Number,
  stake: Number,
  odds: Array,
});

const historySchema = new Schema({
  id: Schema.Types.ObjectId,
  date: String,
  games: [
    {
      ticket: { type: Schema.Types.ObjectId, ref: "Ticket" },
      totalOdds: Number,
      stake: Number,
      odds: Array,
    },
  ],
  createdAt: { type: Date, expires: "15d" },
});

export const User = models?.User || model("User", userSchema);
export const Ticket = models?.Ticket || model("Ticket", ticketSchema);
export const Games = models?.Games || model("Games", gameSchema);
export const ActiveBets =
  models?.ActiveBets || model("ActiveBets", activeBetsSchema);
export const History = models?.History || model("History", historySchema);
