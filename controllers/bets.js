import { clientAsync } from "@/helpers/asyncHandler";
import axios from "axios";

const placeBet = (details) =>
  clientAsync(async () => {
    const { data } = await axios.post("/api/bets", details);
    return data;
  });

const loadBet = (details) =>
  clientAsync(async () => {
    const { data } = await axios.get(`api/bets?code=${details.code}&type=load`);
    return data;
  });

const deleteBet = (details) =>
  clientAsync(async () => {
    const { data } = await axios.delete(`/api/bets?aid=${details?.aid}`);
    return data;
  });

const getBets = (details) =>
  clientAsync(async () => {
    const { data } = await axios.get(
      `/api/bets?active=${details.active}&type=get&date=${details?.date}`
    );
    return data;
  });

export const betController = {
  placeBet,
  loadBet,
  getBets,
  deleteBet,
};
