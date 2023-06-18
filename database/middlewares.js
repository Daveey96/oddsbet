import { client } from "./connect";
import { cookies } from "./cookies";

export const isLoggedIn = (req, res, fn) => {
  let id = cookies.getCookie(req, res, "__sid");

  if (id) return fn(req, res, id);
  res.status(400).json({ message: "You're not logged in" });
};

export const json = async (data, res, status = 200) => {
  await client.close();
  return res.status(status).json({ ...data });
};
