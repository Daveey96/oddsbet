import { Ticket, User, connectMongo, isLoggedIn } from "@/database";
import footBallGames from "@/helpers/football";

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

const placeBet = async (req, res, id) => {
  const { slip, stake, odds, totalOdds } = req.body;

  let user = await User.findById(id, "active balance");
  if (!user) throw Error("Something went wrong");

  // if (user.balance < stake) throw Error("Insufficient balance");

  let ticket = await Ticket.findOne({ slip });

  if (!ticket) {
    const code = generateCode();
    const newTicket = new Ticket({ code, slip });
    await newTicket.save();
    ticket = newTicket;
  }

  user.active.push({
    ticket: ticket._id,
    odds,
    totalOdds,
    stake,
  });
  // user.balance -= stake;
  await user.save();

  res.json({
    odds: totalOdds,
    stake,
    code: ticket.code,
    toWin: (totalOdds * stake).toFixed(2),
  });
};

const getBets = async (req, res, id) => {
  const { type = "active", date } = req.body;

  if (type === "active") {
    let { active } = await User.findById(id, "active").populate(
      "active.ticket"
    );
    let betlist = [];

    active.forEach((betSlip) => {
      let games = [];

      betSlip.ticket.slip.split("|").forEach((elem) => {
        let g = footBallGames.events.filter(
          (v) => v.event_id === parseInt(elem.split(",")[0])
        );
        games.push(g);
      });

      betlist.push({
        games,
        code: betSlip.ticket.code,
        slip: betSlip.ticket.slip,
        odds: betSlip.odds,
        stake: betSlip.stake,
      });
    });

    res.status(200).json({ betlist: betlist.reverse() });
  } else {
    let { history } = await User.findById(id, "history").populate(
      "history.games.ticket"
    );

    const games = history.forEach((day) => {
      if (day.date === date) {
        return day.games;
      }
    });

    res.json({ games });
  }
};

const loadBet = async (req, res) => {
  const { code } = req.body;

  const codeAvail = await Ticket.findOne({ code });
  if (!codeAvail) throw Error("No games found");

  let games = [];

  for (let i = 0; i < codeAvail.slip.split("|").length; i++) {
    const [id, mkt, outcome] = codeAvail.slip.split("|")[i].split(",");
    const { home, away, starts, sport_id } = footBallGames.events.filter(
      (v) => v.event_id === parseInt(id)
    )[0];

    games.push({
      id,
      odd: "4.4",
      mkt,
      outcome,
      sport_id,
      home,
      away,
      time: starts.split("T")[1].slice(0, -3),
    });
  }

  res.json({ games });
};

const deleteBet = async (req, res, id) => {
  const { code } = req.body;
  const user = await User.findById(id, "active").populate("active.ticket");

  for (let i = 0; i < user.active.length; i++) {
    if (code === user.active[i].ticket.code) {
      user.active.splice(i, 1);
      break;
    }
  }
  await user.save();

  res.json({ message: "Deleted" });
};

export default async function handler(req, res) {
  const connect = await connectMongo(res);
  if (!connect) throw Error("Server error");

  if (req.method === "POST" && req.headers.type === "place")
    return isLoggedIn(req, res, placeBet);

  if (req.method === "POST" && req.headers.type === "load")
    return isLoggedIn(req, res, loadBet);

  if (req.method === "POST" && req.headers.type === "get")
    return isLoggedIn(req, res, getBets);

  if (req.method === "POST" && req.headers.type === "delete")
    return isLoggedIn(req, res, deleteBet);
}
