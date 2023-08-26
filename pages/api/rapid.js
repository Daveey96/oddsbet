import { Games } from "@/database";
import { getDate } from "@/helpers";
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

  const { data } = await axios.request(apiII_options);
  if (data) return res.json(data);

  throw Error("No Internet");
};

const getGlobalGames = async (req, res) => {
  const { id } = req.query;

  const games = await Games.findOne({ id });

  if (games) {
    res.send(games.data);
  } else {
    apiII_options.url = "https://pinnacle-odds.p.rapidapi.com/kit/v1/markets";
    apiII_options.params = {
      sport_id: id.toString(),
      is_have_odds: "true",
      event_type: "prematch",
    };
    const { data } = await axios.request(apiII_options);

    const events = data.events.filter(
      (g) =>
        g.starts.includes(getDate().isoString) ||
        g.starts.includes(getDate(1).isoString) ||
        g.starts.includes(getDate(2).isoString) ||
        g.starts.includes(getDate(3).isoString) ||
        g.starts.includes(getDate(4).isoString) ||
        g.starts.includes(getDate(5).isoString) ||
        g.starts.includes(getDate(6).isoString) ||
        g.starts.includes(getDate(7).isoString)
    );

    let d = await Games.create({ id, data: events });

    res.send(d.data);
  }
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
  if (req.query.type === "matches") return serverAsync(req, res, getMatches);

  if (req.query.type === "match") return serverAsync(req, res, getMatch);

  if (req.query.type === "global") return serverAsync(req, res, getGlobalGames);
}
