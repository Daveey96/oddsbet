import { User, connectMongo, cookies, joiSchema } from "@/database";
import { serverAsync } from "@/helpers/asyncHandler";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const generateToken = () => {
  let token = "";
  for (let i = 0; i < 4; i++) token += Math.floor(Math.random() * 10);
  return token;
};

const checkEmail = async (req, res) => {
  const { email } = req.body;

  const { error } = joiSchema({ email });
  if (error) return res.json({ message: "Invalid request data" });

  let user = await User.findOne({ email });
  if (user?.currentStage === 3) res.json({ userRegistered: true });

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

  let newUser = await User.create({
    email,
    token: hashedToken,
    verified: false,
    currentStage: 1,
  });

  cookies.setCookie(req, res, "__sid", newUser._id, 1000 * 3600 * 24 * 30);
  res.status(201).json({ message: "Mail sent" });
};

const verifyToken = async (req, res) => {
  let { email, token } = req.body;

  const { error } = joiSchema({ email, token }, "email token");
  if (error) return res.json({ message: "Invalid request data" });

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
};

const signup = async (req, res) => {
  let { email, password } = req.body;

  const { error } = joiSchema({ email, password }, "email password");
  if (error) return res.json({ message: "Invalid request data" });

  let user = await User.findOne({ email });
  if (!user) throw Error("Email doesn't exist");
  if (user.currentStage !== 2) throw Error("Unauthorized");

  password = bcrypt.hashSync(password, 12);
  user.password = password;
  user.balance = 0;
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
};

const getStage = async (req, res) => {
  let id = cookies.getCookie(req, res, "__sid");

  if (id) {
    let user = await User.findById(id);

    user?.currentStage
      ? res.json({ stage: user.currentStage, email: user.email })
      : res.json({ stage: 0 });
  } else {
    res.json({ stage: 0 });
  }
};

const resendCode = async (req, res) => {
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
};

export default async function handler(req, res) {
  const connect = await connectMongo(res);
  if (!connect) return;

  // Check Email
  if (req.method === "POST" && req.headers?.type === "check")
    return serverAsync(req, res, checkEmail);

  // verify Mail
  if (req.method === "POST" && req.headers?.type === "verify")
    return serverAsync(req, res, verifyToken);

  // resend token
  if (req.method === "POST" && req.headers?.type === "resend")
    return serverAsync(req, res, resendCode);

  // Finalise signup
  if (req.method === "POST" && req.headers?.type === "signup")
    return serverAsync(req, res, signup);

  // Getting Stage
  if (req.method === "GET" && req.headers?.type === "stage")
    return serverAsync(req, res, getStage);
}
