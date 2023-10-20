import { clientAsync } from "@/helpers/asyncHandler";
import axios from "axios";

const placeBet = (details) =>
  clientAsync(async () => {
    const { data } = await axios.post("/api/bets", details);
    return data;
  });

const loadBet = ({ code }) =>
  clientAsync(async () => {
    const { data } = await axios.get(`api/bets?code=${code}&type=load`);
    return data;
  });

const getCode = (details) =>
  clientAsync(async () => {
    const { data } = await axios.post("/api/bets", { ...details, type: true });
    return data;
  });

const deleteBet = ({ aid }) =>
  clientAsync(async () => {
    const { data } = await axios.delete(`/api/bets?aid=${aid}`);
    return data;
  });

const getBets = ({ active, date }) =>
  clientAsync(async () => {
    const { data } = await axios.get(
      `/api/bets?active=${active}&type=get&date=${date}`
    );
    return data;
  });

export const betController = {
  placeBet,
  loadBet,
  getBets,
  deleteBet,
  getCode,
};
