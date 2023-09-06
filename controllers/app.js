import axios from "axios";
import { clientAsync } from "@/helpers/asyncHandler";

const deposit = (details) =>
  clientAsync(async () => {
    const { data } = await axios.post("/api/pay", details, {
      headers: { type: "depo" },
    });
    return data;
  });

const getTransactions = () =>
  clientAsync(async () => {
    const { data } = await axios.get("/api/pay?type=transactions");
    return data;
  });

export const appController = {
  deposit,
  getTransactions,
};