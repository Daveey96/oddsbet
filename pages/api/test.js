const axios = require("axios");

const handler = async (req, res) => {
  //   const options = {
  //     method: "GET",
  //     url: "https://soccerway-feed.p.rapidapi.com/v1/images/team",
  //     params: { team_id: "662" },
  //     headers: {
  //       "X-RapidAPI-Key": "22240fc084msh62a0c86d166238ep10d18cjsncc14a26e52e9",
  //       "X-RapidAPI-Host": "soccerway-feed.p.rapidapi.com",
  //     },
  //   };

  try {
    // const { data } = await axios.request(options);
    //   "https://api.betting-api.com/1xbet/football/live/all",
    let { data } = await axios.get(
      "https://api.betting-api.com/parimatch/football/line/leagues",
      {
        headers: {
          Authorization: `50b134713d5b4f4fa563d9063c0be5b9820c6bac24aa4637bfde0bb96eb5e897`,
        },
      }
    );
    res.json({ data: data });
  } catch (error) {
    res.status(400).json({ error });
  }
};

export default handler;
