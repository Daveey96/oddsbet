import { connectMongo, isLoggedIn } from "@/database";
import football from "@/helpers/json/football";
import bBall from "@/helpers/json/basketball";
import tennis from "@/helpers/json/tennis";

const getGlobalGames = (req, res) => {};

export default async function handler(req, res) {
  const connect = await connectMongo(res);
  if (!connect) throw Error("Server error");

  if (req.method === "GET") return isLoggedIn(req, res, placeBet);
}
