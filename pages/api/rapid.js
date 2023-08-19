import { Games } from "@/database";
import { serverAsync } from "@/helpers/asyncHandler";
import axios from "axios";

const apiI_options = {
  method: "GET",
  url: "https://sofascore.p.rapidapi.com/teams/search",
  params: { name: "Chelsea" },
  headers: {
    "X-RapidAPI-Key": process.env.X_RAPID_API_KEY,
    "X-RapidAPI-Host": "sofascore.p.rapidapi.com",
  },
};

const apiII_options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": process.env.X_RAPID_API_KEY,
    "X-RapidAPI-Host": "pinnacle-odds.p.rapidapi.com",
  },
};

const getMatches = async (req, res) => {
  const { id, live } = req.query;

  apiII_options.url = "https://pinnacle-odds.p.rapidapi.com/kit/v1/markets";
  apiII_options.params = {
    sport_id: id.toString(),
    is_have_odds: "true",
    // event_type: live ? "live" : "prematch",
  };

  // if (!live) {
  //   const games = Games.findOne({ "data.id": id });

  //   if (games?.games) res.json({ games: games.games });
  //   else {
  //     const { data } = await axios.request(apiII_options);

  //     await Games.create({ data });
  //     res.json(data);
  //   }
  //   return;
  // }

  console.log(apiII_options);
  const { data } = await axios.request(apiII_options);
  if (data) return res.json(data);

  throw Error("No Internet");
};

export const getMatch = async (req, res) => {
  const { id } = req.params;
  apiII_options.url += "details";
  apiII_options.params = { event_id: id };

  const { data } = await axios.request(apiII_options);
  if (data) return res.json(data);

  throw Error("No Internet");
};

export default async function handler(req, res) {
  console.log(req.query);
  if (req.query.type === "matches") return serverAsync(req, res, getMatches);

  if (req.query.type === "match") return serverAsync(req, res, getMatch);
}
