import { cookies, connectMongo, User } from "@/database";
import { serverAsync } from "@/helpers/asyncHandler";
import bcrypt from "bcryptjs";

const sessionCheck = async (req, res) => {
  let id = cookies.getCookie(req, res, "__sid");
  if (id) {
    let user = await User.findById(id);
    user && user.currentStage === 3
      ? res.json({
          user: { id: user._id, email: user.email, balance: user.balance },
        })
      : res.json({ user: undefined });
  } else {
    res.json({ user: undefined });
  }
};

const signin = async (req, res) => {
  let { email, password } = req.body;
  let user = await User.findOne({ email });

  if (!user) throw Error("Email doesn't exist");

  let pass = bcrypt.compareSync(password, user.password);
  if (!pass || !user?.verified) throw Error("Invalid email or password");

  cookies.setCookie(req, res, "__sid", user._id, 1000 * 3600 * 24 * 30);
  res.json({
    message: `Welcome ${email}`,
    user: { id: user._id, email, balance: user.balance },
  });
};

const signout = async (req, res) => {
  cookies.setCookie(req, res, "__sid", null, 1000);
  res.status(200).json({ message: "Logout Successful" });
};

export default async function handler(req, res) {
  const connect = await connectMongo(res);
  if (!connect) return;

  // sign in
  if (req.method === "POST") return serverAsync(req, res, signin);

  // session check
  if (req.method === "GET") return serverAsync(req, res, sessionCheck);

  // session check
  if (req.method === "DELETE") return serverAsync(req, res, signout);
}
