import { clientAsync } from "@/helpers/asyncHandler";
import axios from "axios";

const placeBet = (details) =>
  clientAsync(async () => {
    const { data } = await axios.post("/api/bets", details);

    return data;
  });

const getBets = () =>
  clientAsync(async () => {
    const { data } = await axios.get("/api/bets");
    return data;
  });

export const appService = {
  placeBet,
  getBets,
};
