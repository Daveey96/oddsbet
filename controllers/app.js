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
    const { data } = await axios.get("/api/pay");
    return data;
  });

const valiDateAccount = (num, code) =>
  clientAsync(async () => {
    const { data } = await axios.get(
      `/api/pay?type=validate&num=${num}&code=${code}`
    );
    return data;
  }, true);

const getVouchers = () =>
  clientAsync(async () => {
    const { data } = await axios.get("/api/user/signin?type=vouchers");
    return data;
  });

export const appController = {
  deposit,
  getTransactions,
  getVouchers,
  valiDateAccount,
};
