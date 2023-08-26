import {
  User,
  connectMongo,
  cookies,
  isLoggedIn,
  joiValidate,
} from "@/database";
import { serverAsync } from "@/helpers/asyncHandler";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const emailDetails_I = (token) => {
  return {
    subject: "Sign in to Oddssbet",
    html: `
       <div
          style="
            margin: 30px 10px 0 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 17px;
            gap: 0.5rem;
          "
        >
          <h3>Your verification code is</h3>
          <h3 style="font-size: 24px;">${token}</h3>
        </div>
      `,
  };
};

const emailDetails_II = {
  subject: "Password Reset",
  html: `
       <div
          style="
            padding: 30px 10px 0 10px;
            font-size: 17px;
            gap: 1.5rem;
          "
        >
          <h3>Your sign in password has been changed successfully</h3>
        </div>
      `,
};

const generateToken = () => {
  let token = "";
  for (let i = 0; i < 4; i++) token += Math.floor(Math.random() * 10);
  return token;
};

const sendMail = async (email, details) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.MAIL,
      to: email,
      subject: details.subject,
      html: details.html,
    });
    return true;
  } catch (error) {
    return false;
  }
};

const checkEmail = async (req, res) => {
  const { email } = req.body;

  const { error } = joiValidate({ email });
  if (error) throw Error("Invalid request data");

  let user = await User.findOne({ email });

  if (user?.currentStage === 3) return res.json({ userRegistered: true });

  if (user) throw Error("Something went wrong");
  let token = generateToken();
  let hashedToken = bcrypt.hashSync(token, 10);

  let mailSent = await sendMail(email, emailDetails_I(token));
  if (!mailSent) throw Error("Couldn't send mail");
  // console.log(token);

  let newUser = await User.create({
    email,
    token: hashedToken,
    currentStage: 1,
  });

  cookies.setCookie(req, res, "__sid", newUser._id, 1000 * 3600 * 24 * 30);
  res.status(201).json({ message: "Mail sent" });
};

const verifyToken = async (req, res) => {
  let { email, token, type } = req.body;

  const { error } = joiValidate({ email, token }, "email token");
  if (error) throw Error("Invalid request data");

  let user = await User.findOne({ email });
  if (!user) throw Error("Something went wrong!");

  let checkPass = bcrypt.compareSync(token, user.token);
  if (!checkPass) throw Error("Code is incorrect!");

  user.token = "";
  if (type) user.forgotPass = 2;
  else user.currentStage = 2;

  await user.save();

  res.status(200).json({
    message: "Email verified",
    email: user.email,
  });
};

const signup = async (req, res) => {
  let { email, password } = req.body;

  let { error } = joiValidate({ email, password }, "email password");
  if (error) throw Error("Invalid request data");

  let user = await User.findOne({ email });
  if (!user || user.currentStage !== 2) throw Error("Something went wrong");

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
    let user = await User.findById(id, "currentStage balance email forgotPass");

    if (!user) {
      cookies.deleteCookie(req, res, "__sid");
      throw Error("Some error occured");
    } else if (user?.forgotPass)
      res.json({ forgotPass: user.forgotPass, email: user.email });
    else if (user?.currentStage === 3) {
      res.json({
        cookie: true,
        user: { id: user._id, mail: user.email, balance: user.balance },
      });
    } else res.json({ stage: user.currentStage, email: user.email });
  } else res.json({ stage: 0 });
};

const resendCode = async (req, res) => {
  let id = cookies.getCookie(req, res, "__sid");

  let user = await User.findById(id);
  if (!user || user[user.forgotPass ? "forgotPass" : "currentStage"] !== 1)
    throw Error("Something went wrong");

  let token = generateToken();
  let hashedToken = bcrypt.hashSync(token, 10);

  let mailSent = await sendMail(email, emailDetails_I(token));
  if (!mailSent) throw Error("Couldn't send mail");
  // console.log(token);

  user.token = hashedToken;
  await user.save();

  res.json({ message: "Mail resent!" });
};

const changeEmail = async (req, res) => {
  const id = cookies.getCookie(req, res, "__sid");
  let user = await User.findById(id, "forgotPass token");

  if (user?.forgotPass === 1) {
    cookies.setCookie(req, res, "__sid", id, 0);
    user.token = "";
    user.forgotPass = 0;
    await user.save();
  } else if (id) {
    cookies.setCookie(req, res, "__sid", id, 0);
    await User.deleteOne({ _id: id });
  }

  res.json({ message: "success" });
};

const confirmMail = async (req, res) => {
  const { email } = req.body;

  const { error } = joiValidate({ email });
  if (error) throw Error("Invalid request data");

  let user = await User.findOne({ email });

  if (user?.currentStage !== 3) throw Error("Bad Request");

  let token = generateToken();
  let hashedToken = bcrypt.hashSync(token, 10);

  let mailSent = await sendMail(email, emailDetails_I(token));
  if (!mailSent) throw Error("Couldn't send mail");
  // console.log(token);

  user.token = hashedToken;
  user.forgotPass = 1;
  await user.save();

  cookies.setCookie(req, res, "__sid", user._id, 1000 * 3600 * 24 * 30);
  res.status(201).json({ message: "Mail sent" });
};

const changePass = async (req, res, id) => {
  let { password, confirmPassword } = req.body;

  let { error } = joiValidate(
    { password, confirmPassword },
    "password confirmPassword"
  );

  if (password !== confirmPassword || error)
    throw Error(error?.details[0]?.message || "Invalid request data");

  let user = await User.findById(id);

  let pass = bcrypt.hashSync(password, 12);
  user.password = pass;
  user.forgotPass = 0;
  await user.save();

  // let mailSent = await sendMail(email, emailDetails_II);
  // if (!mailSent) throw Error("Something went wrong");

  res.status(200).json({ message: "Password changed", password });
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

  // Change Email
  if (req.method === "DELETE") return serverAsync(req, res, changeEmail);

  // ? Forgot Password
  // Confirm Email
  if (req.method === "POST" && req.headers?.type === "confirm")
    return serverAsync(req, res, confirmMail);

  // Change Password
  if (req.method === "POST" && req.headers?.type === "change")
    return isLoggedIn(req, res, changePass);
}
