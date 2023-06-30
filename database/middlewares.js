import { cookies } from "./cookies";
import Joi from "joi";

export const isLoggedIn = (req, res, fn, fn2 = undefined) => {
  let id = cookies.getCookie(req, res, "__sid");

  if (id) return fn2 ? fn2(req, res, fn, id) : fn(req, res, id);
  res.status(400).json({ message: "You're not logged in" });
};

export const joiSchema = (data, params = "email") => {
  let newObject = {};
  const objects = {
    email: Joi.string().email().min(12).lowercase().required(),
    password: Joi.string().min(6).required(),
    token: Joi.string().length(4),
  };

  params.split(" ").forEach((v) => (newObject[v] = objects[v]));

  const { error } = Joi.object().keys(newObject).validate(data);
  return { error };
};
