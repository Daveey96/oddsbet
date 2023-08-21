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

  let l = f[1] ? `.${f[1]}` : "";
  return `${arr.reverse().join("")}${l}`;
};
