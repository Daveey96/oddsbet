import { clientAsync } from "@/helpers/asyncHandler";
import axios from "axios";

const placeBet = (details) =>
  clientAsync(async () => {
    const { data } = await axios.post("/api/bets", details, {
      headers: { type: "place" },
    });
    return data;
  });

const loadBet = (details) =>
  clientAsync(async () => {
    const { data } = await axios.post("/api/bets", details, {
      headers: { type: "load" },
    });
    return data;
  });

const deleteBet = (details) =>
  clientAsync(async () => {
    const { data } = await axios.post("/api/bets", details, {
      headers: { type: "delete" },
    });
    return data;
  });

const getBets = (details) =>
  clientAsync(async () => {
    const { data } = await axios.post("/api/bets", details, {
      headers: { type: "get" },
    });
    return data;
  });

export const betController = {
  placeBet,
  loadBet,
  getBets,
  deleteBet,
};
