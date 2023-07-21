import Cookies from "cookies";

const setCookie = (req, res, name, id, age = 3600000) => {
  const c = new Cookies(req, res, { keys: [process.env.COOKIE_KEY] });
  c.set(name, id, { maxAge: age, signed: true });
};

const deleteCookie = (req, res, name) => {
  const c = new Cookies(req, res, { keys: [process.env.COOKIE_KEY] });
  c.set(name, null, { maxAge: 0, signed: true });
};

const getCookie = (req, res, name) => {
  const c = new Cookies(req, res, { keys: [process.env.COOKIE_KEY] });
  return c.get(name, { signed: true });
};

export const cookies = {
  setCookie,
  getCookie,
  deleteCookie,
};
