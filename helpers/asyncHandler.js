import { alertService } from "@/services";

const clientAsync = (fn) =>
  fn().catch((error) => {
    console.log(error);
    alertService.error(error?.response?.data?.message || "Network Error");
    return false;
  });

const serverAsync = (res, fn) =>
  fn().catch((err) => {
    res.status(400).json({ message: err.message });
  });

export { serverAsync, clientAsync };
