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

    let ticket = await Ticket.findOne({ slip });

    if (ticket) {
      for (let i = 0; i < ticket.users; i++)
        if (ticket.users[i].id === id) res.json({ ticket: false });

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

const getBets = (req, res, id) =>
  serverAsync(res, async () => {
    let ticks = await Ticket.find({ "users.id": id });

    console.log(ticks);
    res.status(400).json({ message: "me" });
  });

export default async function handler(req, res) {
  await connectMongo().catch((err) =>
    res.status(500).json({ message: "Server Error" })
  );

  if (req.method === "POST") return isLoggedIn(req, res, placeBet);
  // if (req.method === "POST") return placeBet(req, res);

  if (req.method === "GET") return isLoggedIn(req, res, getBets);
}
