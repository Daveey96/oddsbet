import { Games } from "@/database";
import { serverAsync } from "@/helpers/asyncHandler";
import axios from "axios";

let marketoptions = {
  method: "GET",
  url: "https://pinnacle-odds.p.rapidapi.com/kit/v1/",
  params: {},
  headers: {
    "X-RapidAPI-Key": process.env.X_RAPID_API_KEY,
    "X-RapidAPI-Host": "pinnacle-odds.p.rapidapi.com",
  },
};

const getMatches = async (req, res) => {
  const { id, live } = req.query;

  marketoptions.url += "markets";
  marketoptions.params = {
    sport_id: id.toString(),
    is_have_odds: "true",
    event_type: live ? "live" : "prematch",
  };

  if (!live) {
    const games = Games.findOne({ "data.id": id });

    if (games?.games) res.json({ games: games.games });
    else {
      const { data } = await axios.request(marketoptions);

      await Games.create({ data });
      res.json(data);
    }
    return;
  }

  const { data } = await axios.request(marketoptions);
  if (data) return res.json(data);

  throw Error("No Internet");
};

export const getMatch = async (req, res) => {
  const { id } = req.params;
  marketoptions.url += "details";
  marketoptions.params = { event_id: id };

  const { data } = await axios.request(marketoptions);
  if (data) return res.json(data);

  throw Error("No Internet");
};

export default async function handler(req, res) {
  if (req.query.type === "matches") return serverAsync(req, res, getMatches);

  if (req.query.type === "match") return serverAsync(req, res, getMatch);
}
