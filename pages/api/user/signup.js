import connectMongo from "@/database/connect";
import { cookies } from "@/database/cookies";
import User from "@/database/models/user";
import { serverAsync } from "@/helpers/asyncHandler";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const generateToken = () => {
  let token = "";
  for (let i = 0; i < 4; i++) token += Math.floor(Math.random() * 10);
  return token;
};

const checkEmail = (req, res) =>
  serverAsync(res, async () => {
    const { email } = req.body;
    let user = await User.findOne({ email });

    if (user && user.currentStage === 3) res.json({ userRegistered: true });

    let token = generateToken();
    let hashedToken = bcrypt.hashSync(token, 10);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS,
      },
    });
    await transporter
      .sendMail({
        from: process.env.MAIL,
        to: email,
        subject: "Sign in to Oddssbet",
        html: `<h3>Your verification code is ${token}</h3>`,
      })
      .catch(() => {
        throw Error("Couldn't send mail");
      });

    let newUser = new User({
      email,
      token: hashedToken,
      verified: false,
      currentStage: 1,
    });
    await newUser.save();

    cookies.setCookie(req, res, "__sid", newUser._id, 1000 * 3600 * 24 * 30);
    res.status(201).json({ message: "Mail sent" });
  });

const verifyToken = (req, res) =>
  serverAsync(res, async () => {
    let { email, token } = req.body;
    let user = await User.findOne({ email });

    if (!user) throw Error("Something went wrong!");

    let checkPass = bcrypt.compareSync(token, user.token);

    if (!checkPass) throw Error("Code is incorrect!");

    user.token = "";
    user.verified = true;
    user.currentStage = 2;
    await user.save();

    res.status(200).json({
      message: "verified",
      email: user.email,
    });
  });

const signup = (req, res) =>
  serverAsync(res, async () => {
    let { email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user) throw Error("Email doesn't exist");
    if (!user?.verified) throw Error("Unauthorized email");

    password = bcrypt.hashSync(password, 12);
    user.password = password;
    user.balance = 0.0;
    user.currentStage = 3;
    let registeredUser = await user.save();

    cookies.setCookie(
      req,
      res,
      "__sid",
      registeredUser._id,
      1000 * 3600 * 24 * 30
    );
    res.status(201).json({
      message: "Registration Sucessful!",
      user: {
        id: registeredUser._id,
        email: registeredUser.email,
        balance: registeredUser.balance,
      },
    });
  });

const getStage = (req, res) =>
  serverAsync(res, async () => {
    let id = await cookies.getCookie(req, res, "__sid");

    if (id) {
      let user = await User.findById(id);

      user.currentStage
        ? res.json({ stage: user.currentStage, email: user.email })
        : res.json({ stage: user.currentStage });
    } else {
      res.json({ stage: 0 });
    }
  });

const resendCode = (req, res) =>
  serverAsync(res, async () => {
    // let resend = await cookies.getCookie(req, res, "__sc");
    // if (resend) throw Error("Something went wrong");

    let email = await cookies.getCookie(req, res, "__mail");
    let user = User.findOne({ email });
    if (user.currentStage !== 1) throw Error("Something went wrong");

    let token = generateToken();
    let hashedToken = bcrypt.hashSync(token, 10);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS,
      },
    });
    await transporter
      .sendMail({
        from: process.env.MAIL,
        to: email,
        subject: "Sign in to Oddssbet",
        html: `<h3>Your verification code is ${token}</h3>`,
      })
      .catch(() => {
        throw Error("Couldn't send mail");
      });

    user.token = hashedToken;
    await user.save();

    cookies.setCookie(req, res, "__sc", "krfd4eh3d3i5fi49fuf", 55000);

    res.json({ message: "Mail resent!" });
  });

export default async function handler(req, res) {
  await connectMongo().catch((err) => res.send(err));

  // Check Email
  if (req.method === "POST" && req.headers?.type === "check")
    return checkEmail(req, res);

  // verify Mail
  if (req.method === "POST" && req.headers?.type === "verify")
    return verifyToken(req, res);

  // resend token
  if (req.method === "POST" && req.headers?.type === "resend")
    return resendCode(req, res);

  // Finalise signup
  if (req.method === "POST" && req.headers?.type === "signup")
    return signup(req, res);

  // Getting Stage
  if (req.method === "GET" && req.headers?.type === "stage")
    return getStage(req, res);
}
