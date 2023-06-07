import connectMongo from "@/database/connect";
import { cookies } from "@/database/cookies";
import User from "@/database/models/user";
import { serverAsync } from "@/helpers/asyncHandler";
import bcrypt from "bcryptjs";

const isLoggedIn = (req, res) =>
  serverAsync(res, async () => {
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
  });

const signin = (req, res) =>
  serverAsync(res, async () => {
    let { email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user) throw Error("Email doesn't exist");
    if (!user?.verified) throw Error("Unauthorized email");

    let pass = bcrypt.compareSync(password, user.password);
    if (!pass) throw Error("Invalid email or password");

    cookies.setCookie(req, res, "__sid", user._id, 1000 * 3600 * 24 * 30);
    res.json({
      message: `Welocme ${email}`,
      user: { id: user._id, email, balance: user.balance },
    });
  });

export default async function handler(req, res) {
  await connectMongo().catch((err) => res.send(err));

  // sign in
  if (req.method === "POST") return signin(req, res);

  // session check
  if (req.method === "GET") return isLoggedIn(req, res);
}
