import { clientAsync } from "@/helpers/asyncHandler";
import axios from "axios";

const checkEmail = (details) =>
  clientAsync(async () => {
    const { data } = await axios.post("/api/user/signup", details, {
      headers: { type: "check" },
    });
    return data;
  });

const verifyEmail = (details) =>
  clientAsync(async () => {
    const { data } = await axios.post("/api/user/signup", details, {
      headers: { type: "verify" },
    });
    return data;
  });

const signup = (details) =>
  clientAsync(async () => {
    const { data } = await axios.post("/api/user/signup", details, {
      headers: { type: "signup" },
    });
    return data;
  });

const signin = (details) =>
  clientAsync(async () => {
    const { data } = await axios.post("/api/user/signin", details);
    return data;
  });

const signout = () =>
  clientAsync(async () => {
    const { data } = await axios.delete("/api/user/signin");
    return data;
  });

const deleteUser = () =>
  clientAsync(async () => {
    const { data } = await axios.delete("/api/user/signin?type=delete");
    return data;
  });

const resendCode = (details) =>
  clientAsync(async () => {
    const { data } = await axios.post("/api/user/signup", details, {
      headers: { type: "resend" },
    });
    return data;
  });

const getStage = () =>
  clientAsync(async () => {
    const { data } = await axios.get("/api/user/signup", {
      headers: { type: "stage" },
    });
    return data;
  });

const getUser = () =>
  clientAsync(async () => {
    const { data } = await axios.get("/api/user/signin");
    return data;
  });

const changeMail = () =>
  clientAsync(async () => {
    const { data } = await axios.delete("/api/user/signup");
    return data;
  });

const forgotPass = () =>
  clientAsync(async () => {
    const { data } = await axios.get("/api/user/signin");
    return data;
  });

const confirmEmail = (details) =>
  clientAsync(async () => {
    const { data } = await axios.post("/api/user/signup", details, {
      headers: { type: "confirm" },
    });
    return data;
  });

const changePass = (details) =>
  clientAsync(async () => {
    const { data } = await axios.post("/api/user/signup", details, {
      headers: { type: "change" },
    });
    return data;
  });

export const userController = {
  checkEmail,
  confirmEmail,
  changePass,
  signup,
  signin,
  signout,
  verifyEmail,
  getStage,
  getUser,
  resendCode,
  changeMail,
  forgotPass,
  deleteUser,
};
