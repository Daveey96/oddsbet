import { clientAsync } from "@/helpers/asyncHandler";
import axios from "axios";

const placeBet = (details) =>
  clientAsync(async () => {
    const { data } = await axios.post("/api/bets", details);
    return data;
  });

const loadBet = (details) =>
  clientAsync(async () => {
    const { data } = await axios.get(
      `api/bets?path=${details.path}&type=${details?.type}&date=${details?.date}`
    );
    return data;
  });

const deleteBet = (details) =>
  clientAsync(async () => {
    const { data } = await axios.delete(`/api/bets?code=${details?.code}`);
    return data;
  });

const getBets = (details) =>
  clientAsync(async () => {
    const { data } = await axios.get(
      `/api/bets?path=${details.path}&type=${details?.type}&date=${details?.date}`
    );
    return data;
  });

export const betController = {
  placeBet,
  loadBet,
  getBets,
  deleteBet,
};
