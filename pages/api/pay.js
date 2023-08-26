import { Transactions, User, connectMongo, isLoggedIn } from "@/database";

const deposit = async (req, res, id) => {
  const user = await User.findById(id, "balance");

  const { amount } = req.body;

  user.balance += parseFloat(amount);
  let floatnum = user.balance.toString().split(".")[1];

  if (floatnum && floatnum.length > 2) {
    user.balance = user.balance.toFixed(2);
  }

  await user.save();

  const date = new Date().toLocaleTimeString().split(" ")[0].split(":");
  Transactions.create({
    user: id,
    amount,
    date: date.slice(0, 2).join(":"),
    info: "Deposit",
  });

  res.json({ balance: user.balance });
};

const getTransactions = async (req, res, id) => {
  const transactions = await Transactions.find({ user: id });

  res.send(transactions);
};

export default async function handler(req, res) {
  const connect = await connectMongo(res);
  if (!connect) throw Error("Server error");

  if (req.method === "POST") return isLoggedIn(req, res, deposit);

  if (req.method === "GET") return isLoggedIn(req, res, getTransactions);
}
