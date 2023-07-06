import { serverAsync } from "@/helpers/asyncHandler";
import axios from "axios";

let marketoptions = {
  method: "GET",
  url: "https://pinnacle-odds.p.rapidapi.com/kit/v1/markets",
  params: {},
  headers: {
    "X-RapidAPI-Key": process.env.X_RAPID_API_KEY,
    "X-RapidAPI-Host": "pinnacle-odds.p.rapidapi.com",
  },
};

const getMatches = async (req, res) => {
  const { sportId, live } = req.body;
  marketoptions.params = {
    sport_id: sportId.toString(),
    is_have_odds: "true",
    event_type: live ? "live" : "prematch",
  };

  let { data } = await axios.request(marketoptions);
  data && res.json(data);

  throw Error("No Internet");
};

export default async function handler(req, res) {
  // if () return isLoggedIn(req, res, serverAsync, placeBet);
  if (req.method === "POST") return serverAsync(req, res, getMatches);
}
