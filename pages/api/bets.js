import {
  ActiveBets,
  Games,
  History,
  Ticket,
  Transactions,
  User,
  connectMongo,
  isLoggedIn,
} from "@/database";

const getOutcome = async (id, outcome, mkt) => {
  //// ! development
  let g = await Games.findOne({ id: 1 });
  let game = g.filter((v) => v.event_id === parseInt(id))[0];

  return { status: "not start", game };
  //// ! production
  // const g = await axios.get(
  //   `/api/rapid?id=${parseInt(eventId)}&type=match`
  // );
};

const generateCode = () => {
  const letters = "ABCDEFGHIJKLMNPQRSTUVWXYZ";
  let code = "";
  let n = 0;
  let l = 0;

  for (let i = 0; i < 6; i++) {
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
  const { tid, slip, stake, totalOdds, confirm } = req.body;

  let user = await User.findById(id, "balance");
  if (!user) throw Error("Something went wrong");

  if (user.balance < stake) throw Error("Insufficient balance");

  let ticket = await Ticket.findOne({ tid });

  if (!ticket) {
    const code = generateCode();

    let newTicket = await Ticket.create({
      tid,
      code,
      slip,
      createdAt: new Date(),
    });
    ticket = newTicket;
  }

  await ActiveBets.create({
    user: user._id,
    ticket: ticket._id,
    totalOdds,
    toWin: (totalOdds * parseFloat(stake)).toFixed(2),
    stake,
    createdAt: new Date(),
  });

  user.balance = (user.balance - stake).toFixed(2);
  await user.save();

  const date = new Date().toLocaleTimeString().split(" ")[0].split(":");
  Transactions.create({
    user: id,
    amount: stake * -1,
    date: date.slice(0, 2).join(":"),
    info: "Sports Betting",
  });

  res.json({
    stake,
    code: ticket.code,
    toWin: (totalOdds * parseFloat(stake)).toFixed(2),
    balance: user.balance,
  });
};

const getBets = async (req, res, id) => {
  const { active, date } = req.query;

  if (active) {
    let ac = await ActiveBets.find({ user: id }).populate("ticket");
    let betlist = [];

    ac.forEach(async (betSlip) => {
      let games = [];

      betSlip.ticket.slip.forEach(({ id, mkt, outcome, odd }) => {
        let { status, game } = getOutcome(id, outcome, mkt);

        // if (status === "lost") {
        //   let history = History.findOne({ date: getDate().isoString });

        //   if (history) {
        //   }
        // } else {
        games.push({
          status,
          game,
          outcome,
          mkt,
          odd,
        });
        // }
      });

      betlist.push({
        id: betSlip._id,
        games,
        code: betSlip.ticket.code,
        toWin: betSlip.toWin,
        stake: betSlip.stake,
      });

      // if (hist) {
      //   let dateExists = false;
      //   for (let i = 0; i < history.length; i++) {
      //     if (history[i].date === new Date().toISOString()) {
      //       history[i].games.push({
      //         home,
      //         away,
      //         score,
      //         corners,
      //         sport_id,
      //         mkt,
      //       });
      //       dateExists = true;
      //     }
      //   }

      //   if (!dateExists) {
      //     let newHistory = {
      //       date: new Date().toISOString(),
      //       betList: [
      //         {
      //           code: betSlip.ticket.code,
      //           slip: betSlip.ticket.slip,
      //           odds: betSlip.odds,
      //           stake: betSlip.stake,
      //           games: games.map((g) => {
      //             return {
      //               sport_id: g.sport_id,
      //               home: g.home,
      //               away: g.away,
      //               score,
      //               corners,
      //               mkt,
      //             };
      //           }),
      //         },
      //       ],
      //     };

      //     history.unShift(newHistory);
      //   }
      // } else {
      //   betlist.push({
      //     games,
      //     code: betSlip.ticket.code,
      //     slip: betSlip.ticket.slip,
      //     odds: betSlip.odds,
      //     stake: betSlip.stake,
      //   });
      // }
    });

    res.status(200).json({ betlist: betlist.reverse() });
  } else {
    let history = await History.findOne({ id, date });

    res.json({ games: history.games });
  }
};

const loadBet = async (req, res) => {
  const { code } = req.body;

  const codeAvail = await Ticket.findOne({ code });
  if (!codeAvail) throw Error("No games found");

  let games = [];
  let { data } = await Games.findOne({ id: 1 });

  for (let i = 0; i < codeAvail.slip.split("|").length; i++) {
    const [id, mkt, outcome] = codeAvail.slip.split("|")[i].split(",");
    const { home, away, starts, sport_id } = data.filter(
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
  const { aid } = req.query;
  await ActiveBets.deleteOne({ _id: aid, user: id });
  res.json({ message: "Deleted" });
};

export default async function handler(req, res) {
  const connect = await connectMongo(res);
  if (!connect) throw Error("Server error");

  if (req.method === "POST") return isLoggedIn(req, res, placeBet);

  if (req.method === "GET" && req.query.type === "load")
    return isLoggedIn(req, res, loadBet);

  if (req.method === "GET" && req.query.type === "get")
    return isLoggedIn(req, res, getBets);

  if (req.method === "DELETE") return isLoggedIn(req, res, deleteBet);
}
