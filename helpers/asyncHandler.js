import { alertService } from "@/services";

const clientAsync = (fn, alertError = true) =>
  fn().catch((error) => {
    alertError &&
      alertService.error(
        error?.response?.data?.message || "Something went wrong"
      );
    console.log(error);
    return false;
  });

const serverAsync = (req, res, fn, id) =>
  fn(req, res, id).catch(async (err) => {
    res.status(err?.response?.statusCode || 400).json({ message: err.message });
  });

export { serverAsync, clientAsync };
