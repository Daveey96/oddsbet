import { Ticket, User, connectMongo, cookies, isLoggedIn } from "@/database";
import { serverAsync } from "@/helpers/asyncHandler";
import bcrypt from "bcryptjs";

const generateCode = () => {
  const letters = "ABCDEFGHIJKLMNPQRSTUVWXYZ";
  let code = "";
  let n = 0;
  let l = 0;

  for (let i = 0; i < 5; i++) {
    let x = Math.random().toFixed(2);

    if (n === 3) x = 1;
    if (l === 3) x = 0;

    if (x > 0.5) {
      let num = Math.floor(Math.random() * 25);
      code += letters.slice(num, num + 1);
      l += 1;
    } else {
      code += Math.floor(Math.random() * 9 + 1).toString();
      n += 1;
    }
  }

  return code;
};

const placeBet = (req, res, id) =>
  serverAsync(res, async () => {
    const { slip, stake, odds } = req.body;

    let ticket = await Ticket.findOne({ slip }).populate("users.user");

    if (ticket) {
      console.log(ticket);
      res.status(200).json({ ticket, message: "ticket logged" });
    } else {
      let code = generateCode();

      const newSlip = new Ticket({
        code,
        odds,
        slip,
        users: [{ stake, id }],
      });

      await newSlip.save();
      res.status(201).json({ newSlip, message: "bet submitted" });
    }
  });

export default async function handler(req, res) {
  await connectMongo().catch((err) => res.send(err));

  // sign in
  if (req.method === "POST") return isLoggedIn(req, res, placeBet);
  // if (req.method === "POST") return placeBet(req, res);
}
