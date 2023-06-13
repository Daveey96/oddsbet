import { cookies } from "./cookies";

export const isLoggedIn = (req, res, fn) => {
  let id = cookies.getCookie(req, res, "__sid");

  if (id) return fn(req, res, id);
  res.status(400).json({ message: "authorization failed" });
};
