import { Schema, model, models } from "mongoose";

const betSlipSchema = new Schema({
  games: {
    type: Array,
    required: true,
  },
  odds: String,
  stake: String,
  win: String,
});

const BetSlip = models.BetSlip || model("BetSlip", betSlipSchema);

export default BetSlip;
