import { Schema, models, model } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  token: String,
  balance: Number,
  currentStage: Number,
  forgotPass: Number,
});

const teamIdSchema = new Schema({
  team: String,
  id: String,
});

const ticketSchema = new Schema({
  tid: String,
  code: String,
  slip: [
    {
      id: String,
      mkt: String,
      outcome: String,
      odd: String,
    },
  ],
});

const gameSchema = new Schema({
  id: Number,
  data: Array,
  date: String,
  type: Boolean,
});

const activeBetsSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  ticket: { type: Schema.Types.ObjectId, ref: "Ticket" },
  totalOdds: Number,
  toWin: Number,
  stake: Number,
});

const transactionsSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  date: String,
  info: String,
  amount: Number,
});

const vouchersSchema = new Schema({
  users: [{ id: String }],
  info: String,
  amount: Number,
  date: String,
});

const statsSchema = new Schema({
  id: String,
  homeId: String,
  awayId: String,
  matchId: String,
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
});

export const User = models?.User || model("User", userSchema);
export const Ticket = models?.Ticket || model("Ticket", ticketSchema);
export const Transactions =
  models?.Transactions || model("Transactions", transactionsSchema);
export const Games = models?.Games || model("Games", gameSchema);
export const TeamId = models?.TeamId || model("TeamId", teamIdSchema);
export const ActiveBets =
  models?.ActiveBets || model("ActiveBets", activeBetsSchema);
export const History = models?.History || model("History", historySchema);
export const Vouchers = models?.Vouchers || model("Vouchers", vouchersSchema);
export const Stats = models?.Stats || model("Stats", statsSchema);
