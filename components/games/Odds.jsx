import React, { useMemo } from "react";
import { condition, mktDb } from "@/helpers";
import { Buttons } from "./Buttons";

export const getMarket = (g, v, rOdds, game) => {
  const getAll = (mkt) => {
    if (!mkt) return Array(3).fill(null);
    let odds = [];
    const values =
      v === "HOU" || v === "AOU"
        ? [mkt]
        : Object.values(mkt).map((value) => value);
    values.forEach((i) => {
      i.points &&
        i.points.toString().length < 4 &&
        odds.push([i.points, i.over, i.under]);
    });

    odds = odds.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
    return odds;
  };

  const rocket = (v, type) => {
    let value = v;

    if (rOdds) {
      if (type) {
        value.forEach((v, key) => {
          if (v) {
            value[key][1] = v[1] * rOdds;
            value[key][2] = v[2] * rOdds;
          }
        });
      } else {
        value.forEach((v, key) =>
          v !== null ? (value[key] = v * rOdds) : null
        );
      }
    }

    return value;
  };

  const arrangeLines = (values) => {
    return Object.keys(values)
      .map((v) => v)
      .sort((a, b) => parseInt(a.slice(2)) - parseInt(b.slice(2)));
  };

  let { name, text, type, tags } = mktDb(v, game);

  if (!type) {
    if (!v.includes("*")) {
      return g?.money_line
        ? rocket(
            v === "12"
              ? [g.money_line.home, g.money_line.away]
              : [g.money_line.home, g.money_line.draw, g.money_line.away]
          )
        : Array(v === "12" ? 2 : 3).fill(null);
    } else {
      let odds = Array(tags.length).fill(null);

      g &&
        Object.keys(g).map((value) => {
          if (value.toLowerCase() === `${(name || text).toLowerCase()}`) {
            if (g[value].lines)
              tags.length === 3
                ? arrangeLines(g[value].lines).map((v, key) => {
                    if (key === 0) odds[0] = g[value].lines[v].price;
                    if (key === 1) odds[2] = g[value].lines[v].price;
                    if (key === 2) odds[1] = g[value].lines[v].price;
                  })
                : arrangeLines(g[value].lines).map((v, key) => {
                    odds[key] = g[value].lines[v].price;
                  });
          }
        });

      return odds;
    }
  }
  if (type === 1) {
    return rocket(
      getAll(
        condition(
          v,
          ["OU", "HOU", "AOU", "COR*", "BOO*"],
          [
            g?.totals,
            g?.team_total?.home,
            g?.team_total?.away,
            g?.Corners?.totals,
            g?.Bookings?.totals,
          ]
        ),
        "over",
        "under"
      ),
      1
    );
  }
  if (type === 2) {
    let odds = [];

    g &&
      Object.keys(g).map((value) => {
        if (value.toLowerCase() === `${(name || text).toLowerCase()}`) {
          if (g[value].lines)
            arrangeLines(g[value].lines).map((v, key) => {
              odds.push([
                value.toLowerCase().includes("correct score")
                  ? `${g[value].lines[v].name.split(",")[0].slice(-1)} - ${g[
                      value
                    ].lines[v].name
                      .split(",")[1]
                      .slice(-1)}`
                  : g[value].lines[v].name,
                g[value].lines[v].price,
              ]);
            });
        }
      });

    return odds;
  }
  if (type === 3) {
    let odds = [[], [], []];

    g &&
      Object.keys(g).map((value) => {
        if (value.toLowerCase() === `${(name || text).toLowerCase()}`) {
          if (g[value].lines) {
            arrangeLines(g[value].lines).map((v) => {
              let { name, price } = g[value].lines[v];
              if (name.includes(game.home) || name.includes(game.away))
                odds[name.includes(game.home) ? 0 : 1].push([
                  name.split(" ").slice(-1)[0],
                  price,
                ]);
              else odds[2].push([name, price]);
            });
          }
        }
      });

    odds[0].forEach((odd, key) => {
      if (odd[0] === odds[1][key][0]) odds[0][key].push(odds[1][key][1]);
    });

    return odds;
  }
  if (type === 4) {
    let odds = [];

    g &&
      Object.keys(g).map((value) => {
        if (value.toLowerCase().includes(text.toLowerCase())) {
          if (g[value]?.lines)
            odds.push([
              g[value].name.split(" ").slice(-1)[0],
              ...arrangeLines(g[value].lines).map(
                (v) => g[value].lines[v].price
              ),
            ]);
        }
      });

    const positiveNumbers = odds
      .filter((i) => i[0].startsWith("+"))
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

    const negativeNumbers = odds
      .filter((i) => i[0].startsWith("-"))
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]));

    return [...positiveNumbers, ...negativeNumbers];
  }
};

export default function Odds({ className, game, slider, isLive, mkt = "1X2" }) {
  let g = mkt.includes("*") ? game?.periods?.specials : game?.periods;
  const odds = useMemo(
    () =>
      getMarket(
        mkt[0] === "0" ? g?.num_1 : g?.num_0,
        mkt[0] === "0" ? mkt.slice(1) : mkt,
        game?.rocketOdds,
        game
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mkt]
  );

  return (
    <div className={"fx gap-1 relative " + className}>
      <Buttons
        game={game}
        mkt={mkt}
        key={mkt}
        odds={odds}
        isLive={isLive}
        slider={slider}
      />
      {slider && (
        <span className="absolute mt-0.5 text-white/50 text-xs fx gap-7 bottom-[110%] ">
          {mkt}
        </span>
      )}
    </div>
  );
}
