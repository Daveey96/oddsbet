import { User, connectMongo, cookies, joiValidate } from "@/database";
import { serverAsync } from "@/helpers/asyncHandler";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const generateToken = () => {
  let token = "";
  for (let i = 0; i < 4; i++) token += Math.floor(Math.random() * 10);
  return token;
};

const sendMail = async (email, token) => {
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
      subject: "Sign in to Oddssbet",
      html: `
       <div
          style="
            margin: 50px 10px 0 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 17px;
            gap: 0.5rem;
          "
        >
          <h3>Your verification code is <br /> ${token}</h3>
        </div>
      `,
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

  let token = generateToken();
  let hashedToken = bcrypt.hashSync(token, 10);

  let mailSent = await sendMail(email, token);
  if (!mailSent) throw Error("Couldn't send mail");
  console.log(token);

  let newUser = await User.create({
    email,
    token: hashedToken,
    currentStage: 1,
  });

  console.log("created");

  cookies.setCookie(req, res, "__sid", newUser._id, 1000 * 3600 * 24 * 30);
  res.status(201).json({ message: "Mail sent", token });
};

const verifyToken = async (req, res) => {
  let { email, token } = req.body;

  const { error } = joiValidate({ email, token }, "email token");
  if (error) throw Error("Invalid request data");

  let user = await User.findOne({ email });
  if (!user) throw Error("Something went wrong!");

  let checkPass = bcrypt.compareSync(token, user.token);
  if (!checkPass) throw Error("Code is incorrect!");

  user.token = "";
  user.currentStage = 2;
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
    let {
      currentStage = 0,
      balance,
      email,
      _id,
    } = await User.findById(id, "currentStage balance email");

    if (currentStage === 3) {
      return res.json({
        cookie: true,
        user: { id: _id, mail: email, balance },
      });
    }

    res.json({ stage: currentStage, email });
  } else res.json({ stage: 0 });
};

const resendCode = async (req, res) => {
  let id = cookies.getCookie(req, res, "__sid");

  let user = await User.findById(id);
  if (!user || user.currentStage !== 1) throw Error("Something went wrong");

  let token = generateToken();
  let hashedToken = bcrypt.hashSync(token, 10);

  let mailSent = await sendMail(email, token);
  if (!mailSent) throw Error("Couldn't send mail");

  user.token = hashedToken;
  await user.save();

  res.json({ message: "Mail resent!" });
};

const changeEmail = async (req, res) => {
  const id = cookies.getCookie(req, res, "__sid");
  if (id) {
    cookies.setCookie(req, res, "__sid", id, 0);
    await User.deleteOne({ _id: id });
  }

  res.json({ message: "changed" });
};

const forgotPassword = async (req, res) => {};

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

  // Finalise signup
  if (req.method === "POST" && req.headers?.type === "forgotpassword")
    return serverAsync(req, res, forgotPassword);

  // Change Email
  if (req.method === "DELETE") return serverAsync(req, res, changeEmail);
}
