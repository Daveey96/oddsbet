import { Games, Stats, TeamId } from "@/database";
import { getDate } from "@/helpers";
import { serverAsync } from "@/helpers/asyncHandler";
import axios from "axios";
import { BsDatabaseExclamation } from "react-icons/bs";

const apiI_options = {
  method: "GET",
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
    event_type: live ? "live" : "prematch",
  };

  const { data } = await axios.request(apiII_options);
  if (data) return res.send(data.events);

  throw Error("No Internet");
};

const getEvents = async (res, id) => {
  const params = {
    sport_id: id.toString(),
    is_have_odds: "true",
    event_type: "prematch",
  };
  const options = {
    ...apiII_options,
    url: "https://pinnacle-odds.p.rapidapi.com/kit/v1/markets",
    params,
  };
  const options2 = {
    ...apiII_options,
    url: "https://pinnacle-odds.p.rapidapi.com/kit/v1/special-markets",
    params,
  };

  const { data } = await axios.request(options);
  if (!data) throw Error("No Internet Connection");

  const specialsData = await axios.request(options2);
  if (!specialsData) throw Error("No Internet Connection");

  let events = data.events
    .filter(
      (g) =>
        g.starts.includes(getDate().isoString) ||
        g.starts.includes(getDate(1).isoString) ||
        g.starts.includes(getDate(2).isoString) ||
        g.starts.includes(getDate(3).isoString) ||
        g.starts.includes(getDate(4).isoString)
    )
    .filter((v) => !v.period_results);

  let specials = events.filter((g) => g.parent_id !== null);
  let non_specials = events.filter((g) => g.parent_id === null);

  await specialsData.data.specials
    .filter((v) => v.category === "Team Props")
    .forEach((elem) => {
      for (let i = 0; i < non_specials.length; i++) {
        if (non_specials[i].event_id === elem.event_id) {
          if (!non_specials[i].periods?.specials)
            non_specials[i].periods.specials = { num_0: {}, num_1: {} };
          if (elem.name.includes("1st Half"))
            non_specials[i].periods.specials.num_1[elem.name] = elem;
          else non_specials[i].periods.specials.num_0[elem.name] = elem;
          break;
        }
      }
    });

  await specials.forEach((spe) => {
    for (let i = 0; i < non_specials.length; i++) {
      if (non_specials[i].event_id === spe.parent_id) {
        if (!non_specials[i].periods?.specials)
          non_specials[i].periods.specials = { num_0: {}, num_1: {} };
        if (spe?.periods?.num_0)
          non_specials[i].periods.specials.num_0[spe.resulting_unit] =
            spe.periods.num_0;
        if (spe?.periods?.num_1)
          non_specials[i].periods.specials.num_1[spe.resulting_unit] =
            spe.periods.num_1;

        break;
      }
    }
  });

  let i = Math.floor(non_specials.length / 10);
  let arr = [];

  while (i > 0) {
    let num = Math.floor(Math.random() * non_specials.length);
    if (!arr.includes(num)) arr.push(num);
    i--;
  }

  arr.forEach(
    (num) => (non_specials[num].rocketOdds = Math.floor(Math.random() * 2) + 3)
  );

  let d = await Games.create({
    id,
    data: non_specials,
    date: new Date().toISOString().split("T")[0],
  });

  res.send(d.data);
};

const getGlobalGames = async (req, res) => {
  const { id } = req.query;
  const games = await Games.findOne({ id });

  if (games) {
    const date = new Date().toISOString().split("T")[0];

    if (date === games.date) res.send(games.data);
    else {
      await Games.deleteOne({ id });
      await getEvents(res, id);
    }
  } else await getEvents(res, id);
};

export const getMatch = async (req, res) => {
  const { id } = req.query;
  apiII_options.url = "https://pinnacle-odds.p.rapidapi.com/kit/v1/details";
  apiII_options.params = { event_id: id };

  const { data } = await axios.request(apiII_options);

  if (data) return res.send(data.events[0]);

  throw Error("No Internet");
};

const getTeamId = async (team) => {
  let id = await TeamId.findOne({ team });

  if (id) return id.id;
  else {
    let options = {
      url: "https://sofascore.p.rapidapi.com/teams/search",
      params: { name: team },
      ...apiI_options,
    };
    const { data } = await axios.request(options);

    await TeamId.create({
      id: data.teams[0].id,
      team,
    });

    return data.teams[0].id;
  }
};

const getMatchId = async (team1, team2, teamId) => {
  let options = {
    url: "https://sofascore.p.rapidapi.com/teams/get-next-matches",
    params: {
      teamId,
      pageIndex: "0",
    },
    ...apiI_options,
  };

  const { data } = await axios.request(options);

  let game = [];

  array.forEach((element) => {});

  return data.teams[0].id;
};

const getLastMatches = async (teamId) => {
  let options = {
    url: "https://sofascore.p.rapidapi.com/teams/get-last-matches",
    params: {
      teamId,
      pageIndex: "0",
    },
    ...apiI_options,
  };

  const { data } = await axios.request(options);

  let game = [];

  array.forEach((element) => {});

  return data.teams[0].id;
};

const getTeamLogo = async (req, res) => {
  const { team } = req.query;
  const id = await getTeamId(team);
  let options = {
    url: "https://sofascore.p.rapidapi.com/teams/get-logo",
    params: { teamId: id.toString() },
    responseType: "arraybuffer",
    ...apiI_options,
  };

  const response = await axios.request(options);

  if (response.status === 200) {
    console.log(response.headers);
    const imageType = response.headers["content-type"];
    const imageData = Buffer.from(response.data, "binary").toString("base64");
    const dataURI = `data:${imageType};base64,${imageData}`;

    res.send(dataURI);
  }
};

const getStats = async (req, res) => {
  const { team1, team2, id } = req.query;

  let gameDetails = {};

  let data = await Stats.findOne({ id });

  if (data) gameDetails = data;
  else {
    const homeId = await getTeamId(team1);
    const awayId = await getTeamId(team2);
    const matchId = await getMatchId(team1, team2, homeId);

    const game = await Stats.create({ id, homeId, awayId, matchId });
    gameDetails = game;
  }

  console.log("fin");

  res.send("seen");
};

export default async function handler(req, res) {
  if (req.query.type === "matches") return serverAsync(req, res, getMatches);

  if (req.query.type === "match") return serverAsync(req, res, getMatch);

  if (req.query.type === "global") return serverAsync(req, res, getGlobalGames);

  if (req.query.type === "specials") return serverAsync(req, res, getSpecials);

  if (req.query.type === "stats") return serverAsync(req, res, getStats);

  if (req.query.type === "logo") return serverAsync(req, res, getTeamLogo);
}
