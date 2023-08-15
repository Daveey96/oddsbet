import { Games } from "@/database";
import { serverAsync } from "@/helpers/asyncHandler";
import axios from "axios";

const axios = require("axios");

const options = {
  method: "GET",
  url: "https://sportscore1.p.rapidapi.com/sports/1/teams",
  params: { page: "1" },
  headers: {
    "X-RapidAPI-Key": "c2aa108c95msh29c47e2bedfb607p14abe5jsn30c27e7eee9b",
    "X-RapidAPI-Host": "sportscore1.p.rapidapi.com",
  },
};

try {
  const response = await axios.request(options);
  console.log(response.data);
} catch (error) {
  console.error(error);
}

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
