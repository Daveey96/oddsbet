import { Games, Stats, TeamId } from "@/database";
import { getDate } from "@/helpers";
import { serverAsync } from "@/helpers/asyncHandler";
import axios from "axios";

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

const sortSpecials = async (events, specialsData) => {
  let specials = events.filter((g) => g.resulting_unit !== "Regular");
  let non_specials = events.filter((g) => g.resulting_unit === "Regular");

  await specialsData.specials
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

  return non_specials;
};

const remove = (events) =>
  events.filter((v) =>
    Math.sign(new Date().getTime() - new Date(v.starts).getTime()) === 1
      ? false
      : true
  );

const getEvents = async (req, res) => {
  const { id, live, since } = req.query;

  let params = {
    sport_id: id.toString(),
    is_have_odds: "true",
    event_type: live ? "live" : "prematch",
  };
  let options = {
    ...apiII_options,
    url: "https://pinnacle-odds.p.rapidapi.com/kit/v1/markets",
    params,
  };
  let optionsSpecial = {
    ...apiII_options,
    url: "https://pinnacle-odds.p.rapidapi.com/kit/v1/special-markets",
    params,
  };

  console.log("yes", live);
  if (live === "live") {
    if (since) {
      optionsSpecial.params.since = since;
      options.params.since = since;
    }
    const options2 = {
      url: "https://sofascore.p.rapidapi.com/tournaments/get-live-events",
      params: { sport: "football" },
      ...apiI_options,
    };

    const matches = await axios.request(options2);

    if (matches.data?.events?.length > 0) {
      const { data } = await axios.request(options);
      const specials = await axios.request(optionsSpecial);

      const events = await sortSpecials(data.events, specials.data);

      let matchs = [];

      const confirm = (slug, team) => {
        let l = slug.split("-");
        let i = 0;

        l.forEach((m) => {
          if (team.toLowerCase().includes(m)) i++;
        });

        return i === l.length;
      };

      matches.data.events.forEach((event) => {
        for (let i = 0; i < events.length; i++) {
          let { home, away } = events[i];
          if (confirm(event.slug, home + away)) {
            matchs.push({
              ...event,
              pinnacle_id: events[i].event_id,
              periods: events[i].periods,
            });
            break;
          }
        }
      });

      res.send(matchs);
    }

    res.send([]);
  } else {
    const games = await Games.findOne({ id });

    if (games) {
      const date = new Date(games.updatedAt).getDate();

      console.log(date, new Date().getDate(), games.updatedAt);
      if (date === new Date().getDate()) return res.send(remove(games.data));
    }

    console.log("yes");
    const specials = await axios.request(optionsSpecial);
    console.log("yesz");
    const { data } = await axios.request(options);
    console.log("yesz2333");

    const events = await sortSpecials(
      data.events.filter((v) => !v.period_results),
      specials.data
    );

    let i = Math.floor(events.length / 10);
    let arr = [];

    while (i > 0) {
      let num = Math.floor(Math.random() * events.length);
      if (!arr.includes(num)) arr.push(num);
      i--;
    }

    arr.forEach(
      (num) => (events[num].rocketOdds = Math.floor(Math.random() * 2) + 3)
    );

    if (games) {
      let mgames = remove(games.data);

      events.forEach((event) => {
        for (let i = 0; i < mgames.length; i++) {
          if (v.event_id === event.event_id) {
            mgames[i] = { ...mgames[i], periods: event.periods };
            break;
          } else if (i === mgames.length - 1) mgames.push(event);
        }
      });

      games.data = mgames;
      await games.save();

      res.send(games.data);
    } else {
      let d = await Games.create({ id, data: remove(events) });

      res.send(d.data);
    }
  }
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
  if (req.query.type === "events") return serverAsync(req, res, getEvents);
  else if (req.query.type === "match") return serverAsync(req, res, getMatch);
  else if (req.query.type === "specials")
    return serverAsync(req, res, getSpecials);
  else if (req.query.type === "stats") return serverAsync(req, res, getStats);
  else if (req.query.type === "logo") return serverAsync(req, res, getTeamLogo);
}
