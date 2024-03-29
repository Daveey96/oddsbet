import { Transactions, User, connectMongo, isLoggedIn } from "@/database";
import axios from "axios";

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
    date: `${new Date().toISOString()}T${date.slice(0, 2).join(":")}`,
    info: "Deposit",
  });

  res.json({ balance: user.balance });
};

const getTransactions = async (req, res, id) => {
  const transactions = await Transactions.find({ user: id });

  res.send(transactions);
};

const valiDateAccount = async (req, res) => {
  const { num, code } = req.query;

  console.log(num, code, `${process.env.BANK_VALIDATION_API_KEY}`);
  const { data } = await axios.get(
    `https://nubapi.com/api/verify?account_number=${num}&bank_code=${code}`,
    {
      headers: {
        Authorization: `${process.env.BANK_VALIDATION_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  console.log(data);
  if (data?.accountName) res.send(data.accountName);
  else throw Error("Invalid bank Details");
};

export default async function handler(req, res) {
  const connect = await connectMongo(res);
  if (!connect) throw Error("Server error");

  if (req.method === "POST") return isLoggedIn(req, res, deposit);
  else if (req.query.type) return isLoggedIn(req, res, valiDateAccount);
  else if (req.method === "GET") return isLoggedIn(req, res, getTransactions);
}
