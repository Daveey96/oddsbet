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
  let [year, month, day] = new Date().toISOString().split("T")[0].split("-");
  let days = [
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

  if (!d) return { day, month, year };
  let m = parseInt(month - 1);
  let r = parseInt(day) + d;

  if (Math.sign(d) === -1) {
    while (r < 1) {
      m === -1 ? 11 : (m -= 1);
      r += days[m];
    }
  } else {
    while (r > days[m]) {
      r -= days[m];
      m === 12 ? 0 : (m += 1);
    }
  }

  return { day: r, month: m + 1, year };
};
