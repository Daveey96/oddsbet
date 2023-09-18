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
    if (g.length === 1) g = "0" + g;
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
    if (p === "pr") g = g.filter((v) => v.parent_id !== null);
    else if (p === "npr") g = g.filter((v) => v.parent_id === null);
    else if (p === "t") {
      g = g.sort((a, b) =>
        parseInt(a.starts.split(":")[0]) === parseInt(b.starts.split(":")[0])
          ? parseInt(a.starts.split(":")[1]) - parseInt(b.starts.split(":")[1])
          : parseInt(a.starts.split(":")[0]) - parseInt(b.starts.split(":")[0])
      );
    }
  });

  return g;
};

export const arrange = (games, query = "league") => {
  let list = [
    2627, 205451, 5264, 1980, 2196, 1842, 2436, 2036, 10419, 1928, 1977, 1979,
  ];

  games.sort(function (a, b) {
    let aIndex = list.indexOf(a.league_id);
    let bIndex = list.indexOf(b.league_id);

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

  return games;
};
