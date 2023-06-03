import nodemailer from "nodemailer";

const email = process.env.MAIL;
const pass = process.env.MAILPASS;
const html = () => {
  return <></>;
};

export default async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass,
      },
    });

    await transporter.sendMail({
      from: email,
      to: "jamesevan393@gmail.com",
      subject: "Sign in to Oddssbet",
      html: "",
    });

    res.status(200).json({ message: "SENT!" });
  } catch (err) {
    res.status(400).json(err);
  }
};
