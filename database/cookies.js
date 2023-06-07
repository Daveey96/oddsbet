import Cookies from "cookies";

const setCookie = (req, res, name, id, age = 3600000, signed = true) => {
  const c = new Cookies(req, res, { keys: [process.env.COOKIE_KEY] });
  c.set(name, id, { maxAge: age, signed });
};

const getCookie = (req, res, name, signed = true) => {
  const c = new Cookies(req, res, { keys: [process.env.COOKIE_KEY] });
  return c.get(name, { signed });
};

export const cookies = {
  setCookie,
  getCookie,
};
