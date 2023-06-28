import { Ticket, User, connectMongo, cookies, isLoggedIn } from "@/database";
import { serverAsync } from "@/helpers/asyncHandler";
import bcrypt from "bcryptjs";

const generateCode = () => {
  const letters = "abcdefghijklmnpqrstuvwxyz";
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
      ticket.users.push({ stake, id });

      await ticket.save();
      res.status(201).json({
        newSlip: {
          odds,
          stake,
          potWin: (parseFloat(odds) * parseFloat(stake)).toFixed(2),
          code,
        },
        message: "bet submitted",
      });
    } else {
      let user = await User.findById(id);

      let code = generateCode();
      const newTicket = new Ticket({ code, slip });
      await newTicket.save();

      // for (let i = 0; i < user.activeBets.length; i++) {
      //   if (user.activeBets[i].id === ticket._id)
      //     throw Error("You already have this ticket");
      // }

      user.activeBets.push({ code, odds, stake });
      await user.save();

      res.status(201).json({
        ticket: { odds, stake, code },
        message: "bet submitted",
      });
    }
  });

const getBets = (req, res) =>
  serverAsync(res, async () => {
    let id = "649b34dc6833646ae0b7b972";
    let ticks = await Ticket.findById({ "users._id": id });
    if (!ticks) throw Error("something went wrong");

    res.status(200).json({ ticks });
  });

export default async function handler(req, res) {
  await connectMongo().catch((err) =>
    res.status(500).json({ message: "Server Error" })
  );

  // if (req.method === "POST") return isLoggedIn(req, res, placeBet);
  if (req.method === "POST") return placeBet(req, res);

  // if (req.method === "GET") return isLoggedIn(req, res, getBets);
  if (req.method === "GET") return getBets(req, res);
}
