export const condition = (v, values, output) => {
  for (let i = 0; i < values.length; i++) {
    if (v === values[i])
      return output ? (output === "i" ? i : output[i]) : values[i];

    if (values[i] === "*") return output[values.length - 1];
  }
};

export const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const getDate = (d = 0) => {
  let [month, day, year] = new Date().toLocaleDateString().split("/");
  let months = [
    31,
    parseInt(year) % 4 ? 28 : 29,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  const normalize = (value) => {
    let g = value.toString();
    if (g?.length === 1) g = "0" + g;
    return g;
  };

  if (!d)
    return {
      day,
      month,
      year,
      weekDay: weekDays[new Date().getDay()],
      isoString: new Date().toISOString().split("T")[0],
    };
  let m = parseInt(month - 1);
  let r = parseInt(day) + d;

  if (Math.sign(d) === -1) {
    while (r < 1) {
      m === -1 ? 11 : (m -= 1);
      r += months[m];
    }
  } else {
    while (r > months[m]) {
      r -= months[m];
      m === 12 ? 0 : (m += 1);
    }
  }

  let weekDay = new Date(`${year}-${m + 1}-${r}`).getDay();
  return {
    day: r,
    month: m + 1,
    year,
    weekDay: weekDays[weekDay],
    isoString: `${year}-${normalize(m + 1)}-${normalize(r)}`,
  };
};

export const format = (v) => {
  let f = v.toString().split(".");
  if (f[0].length < 4) return f.join(".");

  if (parseInt(f[0]) > 50000000) f[0] = "50000000";
  let arr = f[0].split("").reverse();
  let len = arr.length;
  let count = 0;

  while (len > 3) {
    count === 1 ? arr.splice(7, 0, ",") : arr.splice(3, 0, ",");
    count = 1;
    len -= 3;
  }

  let d = f[1]?.length > 2 ? f[1].slice(0, 2) : false;
  let l = d ? `.${d}` : "";
  return `${arr.reverse().join("")}${l}`;
};

export const filterGames = (games, ...params) => {
  let g = games;

  params.forEach((p) => {
    if (p === "pr") g = g?.filter((v) => v.parent_id !== null);
    else if (p === "npr") g = g?.filter((v) => v.parent_id === null);
    else if (p === "t") {
      g = g?.sort((a, b) =>
        parseInt(a.starts.split(":")[0]) === parseInt(b.starts.split(":")[0])
          ? parseInt(a.starts.split(":")[1]) - parseInt(b.starts.split(":")[1])
          : parseInt(a.starts.split(":")[0]) - parseInt(b.starts.split(":")[0])
      );
    }
  });

  return g;
};

export const mainLeagues = [
  2627, 205451, 5264, 2630, 1980, 2196, 1842, 2436, 2036, 1834, 10419, 2663,
  1928, 1977, 1979,
];

export const arrange = (games, query = "p") => {
  let g = games;
  if (query === "st") {
    g?.sort(function (a, b) {
      let aTime = new Date(a.starts);
      let bTime = new Date(b.starts);

      if (aTime.getHours() === bTime.getHours())
        return bTime.getMinutes() - aTime.getMinutes();
      else return bTime.getHours() - aTime.getHours();
    });
  } else if (query === "p") {
    g?.sort(function (a, b) {
      let aIndex = mainLeagues.indexOf(a.league_id);
      let bIndex = mainLeagues.indexOf(b.league_id);

      if (aIndex > -1 && bIndex > -1) {
        return aIndex - bIndex; // Sort by index in list
      } else if (aIndex > -1) {
        return -1; // a comes first
      } else if (bIndex > -1) {
        return 1; // b comes first
      } else {
        return a.league_id - b.league_id; // Sort normally for non-specific numbers
      }
    });
  }

  return g;
};

export const isArray = (v) => v && typeof v === "object";

export const addZero = (v) => (v.toString().length === 1 ? `0${v}` : v);

export const mktDb = (v, g) => {
  let mkt = [
    {
      mkt: "1X2",
      text: "1X2",
      tags: ["1", "X", "2"],
      out: ["Home", "Draw", "Away"],
    },
    {
      mkt: "01X2",
      text: "1st Half 1X2",
      tags: ["1", "X", "2"],
      out: ["Home", "Draw", "Away"],
    },
    {
      mkt: "OU",
      text: "Over/Under",
      tags: ["", "over", "under"],
      type: 1,
    },
    {
      mkt: "0OU",
      text: "1st Half O/U",
      tags: ["", "over", "under"],
      type: 1,
    },
    {
      mkt: "HOU",
      text: `${g?.home} - Over/Under`,
      tags: ["points", "over", "under"],
      type: 1,
    },
    {
      mkt: "0HOU",
      text: `${g?.home} - 1st Half O/U`,
      tags: ["points", "over", "under"],
      type: 1,
    },
    {
      mkt: "AOU",
      text: `${g?.away} - Over/Under`,
      tags: ["points", "over", "under"],
      type: 1,
    },
    {
      mkt: "0AOU",
      text: `${g?.away} - 1st Half O/U`,
      tags: ["points", "over", "under"],
      type: 1,
    },
    {
      mkt: "DB*",
      text: "Double Chance",
      tags: ["1X", "12", "X2"],
      out: ["Home or Draw", "Home or Away", "Draw or Away"],
    },
    {
      name: "Double Chance 1st Half",
      mkt: "0DB*",
      text: "1st Half Double Chance",
      tags: ["1X", "12", "X2"],
      out: ["Home or Draw", "Home or Away", "Draw or Away"],
    },
    {
      mkt: "GG*",
      text: "Both Teams to Score?",
      tags: ["Yes", "No"],
    },
    {
      mkt: "0GG*",
      text: "Both Teams to Score? 1st Half",
      tags: ["Yes", "No"],
    },
    { mkt: "DNB*", text: "Draw No Bet", tags: ["home", "away"] },
    {
      name: "Draw No Bet 1st Half",
      mkt: "0DNB*",
      text: "1st Half - DNB",
      tags: ["home", "away"],
    },
    {
      name: "Corners",
      mkt: "COR*",
      text: "Total Corners",
      tags: ["points", "over", "under"],
      type: 1,
    },
    {
      name: "Corners",
      mkt: "0COR*",
      text: "1st Half Corners",
      tags: ["points", "over", "under"],
      type: 1,
    },
    {
      name: "Bookings",
      mkt: "BOO*",
      text: "Total Bookings",
      tags: ["points", "over", "under"],
      type: 1,
    },
    {
      name: "Bookings",
      mkt: "0BOO*",
      text: "1st Half Bookings",
      tags: ["points", "over", "under"],
      type: 1,
    },
    {
      mkt: "CS*",
      text: "Correct Score",
      type: 2,
    },
    {
      name: "Correct Score 1st Half",
      mkt: "0CS*",
      text: "1st Half Correct Score",
      type: 2,
    },
    { mkt: "HG*", text: `${g?.home} Goals`, type: 2, out: "Goals" },
    { mkt: "AG*", text: `${g?.away} Goals`, type: 2, out: "Goals" },
    {
      mkt: "HTS*",
      text: `${g?.home} To Score?`,
      tags: ["Yes", "No"],
    },
    {
      mkt: "ATS*",
      text: `${g?.away} To Score?`,
      tags: ["Yes", "No"],
    },
    {
      mkt: "HTWN*",
      text: `${g?.home} To Win to Nil?`,
      tags: ["Yes", "No"],
    },
    {
      mkt: "ATWN*",
      text: `${g?.away} To Win to Nil?`,
      tags: ["Yes", "No"],
    },
    {
      mkt: "0HG*",
      text: `${g?.home} Goals 1st Half`,
      type: 2,
      out: "Goals",
    },
    {
      mkt: "0AG*",
      text: `${g?.away} Goals 1st Half`,
      type: 2,
      out: "Goals",
    },
    {
      mkt: "0HTS*",
      text: `${g?.home} To Score? 1st Half`,
      tags: ["Yes", "No"],
    },
    {
      mkt: "0ATS*",
      text: `${g?.away} To Score? 1st Half`,
      tags: ["Yes", "No"],
    },
    {
      mkt: "0HTWN*",
      text: `${g?.home} To Win to Nil? 1st Half`,
      tags: ["Yes", "No"],
    },
    {
      mkt: "0ATWN*",
      text: `${g?.away} To Win to Nil? 1st Half`,
      tags: ["Yes", "No"],
    },
    {
      mkt: "ETTS*",
      text: "Either Team to Score?",
      tags: ["Yes", "No"],
    },
    {
      mkt: "0ETTS*",
      text: "Either Team to Score? 1st Half",
      tags: ["Yes", "No"],
    },
    {
      mkt: "GR*",
      text: "Total Goals Range",
      type: 2,
    },
    {
      mkt: "0GR*",
      text: "Total Goals Range 1st Half",
      type: 2,
    },
    {
      mkt: "OE*",
      text: "Total Goals Odd/Even",
      tags: ["odd", "even"],
    },
    {
      mkt: "0OE*",
      text: "Total Goals Odd/Even 1st Half",
      tags: ["odd", "even"],
    },
    {
      mkt: "WM*",
      text: "Winning Margin",
      type: 3,
      tags: ["", "home", "away"],
    },
    {
      mkt: "0WM*",
      text: "Winning Margin 1st Half",
      type: 3,
      tags: ["", "home", "away"],
    },
    {
      name: "First team to score",
      mkt: "FTTS*",
      text: "First Goal",
      tags: ["home", "none", "away"],
    },
    {
      mkt: "HAN*",
      text: "Handicap",
      type: 4,
      tags: ["", "home", "draw", "away"],
    },
  ];

  for (let i = 0; i < mkt.length; i++) if (mkt[i].mkt === v) return mkt[i];
};
