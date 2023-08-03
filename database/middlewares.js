import Joi from "joi";
import { cookies } from "./cookies";
import { serverAsync } from "@/helpers/asyncHandler";

export const isLoggedIn = (req, res, fn) => {
  let id = cookies.getCookie(req, res, "__sid");

  if (id) return serverAsync(req, res, fn, id);
  res.status(400).json({ message: "You're not logged in" });
};

export const joiValidate = (data, params = "email") => {
  let newObject = {};
  const objects = {
    email: Joi.string().email().min(12).lowercase().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().min(6).required(),
    token: Joi.string().length(4),
  };

  params.split(" ").forEach((v) => (newObject[v] = objects[v]));

  const { error } = Joi.object().keys(newObject).validate(data);
  return { error };
};
