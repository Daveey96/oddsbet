import { alertService } from "@/services";

const clientAsync = (fn) =>
  fn().catch((error) => {
    alertService.error(error?.response?.data?.message || "Network Error");
    return false;
  });

const serverAsync = (req, res, fn, id) =>
  fn(req, res, id).catch(async (err) => {
    res.status(400).json({ message: err.message });
  });

export { serverAsync, clientAsync };
