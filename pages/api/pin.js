import { Transactions, User, connectMongo, isLoggedIn } from "@/database";

const getTransactions = async (req, res, id) => {
  const transactions = await Transactions.find({ user: id });

  res.send(transactions);
};

export default async function handler(req, res) {
  const connect = await connectMongo(res);
  if (!connect) throw Error("Server error");

  if (req.method === "GET") return isLoggedIn(req, res, getTransactions);
}
