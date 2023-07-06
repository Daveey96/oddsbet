export const filterDate = (v) => {
  return v ? v.date_start.split("T")[1].slice(0, 5) : "";
};

export const condition = (v, values, output) => {
  for (let i = 0; i < values.length; i++) {
    if (v === values[i])
      return output ? (output === "i" ? i : output[i]) : values[i];

    if (values[i] === "*") return output[values.length - 1];
  }
};

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
  let weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
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
