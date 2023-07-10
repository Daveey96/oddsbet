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
  if (data) return res.json(data);

  throw Error("No Internet");
};

// const getMatchestest = async (req, res) => {
//   marketoptions.params = {
//     sport_id: 1,
//     is_have_odds: "true",
//     event_type: "prematch",
//   };

//   let { data } = await axios.request(marketoptions);
//   if (data) return res.json(data);

//   throw Error("No Internet");
// };

export default async function handler(req, res) {
  if (req.method === "POST") return serverAsync(req, res, getMatches);

  // if (req.method === "GET") return serverAsync(req, res, getMatchestest);
}
