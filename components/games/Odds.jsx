import React, { useContext, useMemo, useState } from "react";
import { BiLockAlt } from "react-icons/bi";
import { Context } from "../layout";
import { condition } from "@/helpers";
import { BsCaretUpFill } from "react-icons/bs";
import { motion } from "framer-motion";

export const market = (g, v, rOdds, ga) => {
  const getAll = (mkt) => {
    if (!mkt) return Array(3).fill(null);
    let odds = [];
    const values =
      v === "OU" ? Object.values(mkt).map((value) => value) : [mkt];
    values.forEach(
      (i) =>
        i.points.toString().length < 4 && odds.push([i.points, i.over, i.under])
    );

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

  if (v === "1X2") {
    return {
      name: ["1", "X", "2"],
      odds: g?.money_line
        ? rocket([g.money_line.home, g.money_line.draw, g.money_line.away])
        : Array(3).fill(null),
    };
  }
  if (v === "DB*" || v === "FTTS*") {
    let odds = [null, null, null];
    let name = condition(
      v,
      ["DB*", "FTTS*"],
      [
        ["1X", "12", "X2"],
        ["home", "none", "away"],
      ]
    );
    let query = condition(
      v,
      ["DB*", "FTTS*"],
      ["Double Chance", "First Team To Score"]
    );

    g &&
      Object.keys(g).map((value) => {
        if (value.includes(query)) {
          g[value].lines &&
            arrangeLines(g[value].lines).map((v, key) => {
              if (key === 0) odds[0] = g[value].lines[v].price;
              if (key === 1) odds[2] = g[value].lines[v].price;
              if (key === 2) odds[1] = g[value].lines[v].price;
            });
        }
      });

    return { name, odds };
  }
  if (v === "GG*" || v === "DNB*") {
    let odds = [null, null];
    let name = condition(
      v,
      ["GG*", "DNB*"],
      [
        ["Yes", "No"],
        ["home", "away"],
      ]
    );
    let query = condition(
      v,
      ["GG*", "DNB*"],
      ["Both Teams To Score?", "Draw No Bet"]
    );

    g &&
      Object.keys(g).map((value) => {
        if (value.includes(query)) {
          g[value].lines &&
            arrangeLines(g[value].lines).map((v, key) => {
              odds[key] = g[value].lines[v].price;
            });
        }
      });

    return { name, odds };
  }
  if (v === "WL") {
    return {
      name: ["1", "2"],
      odds: g?.money_line
        ? [g.money_line.home, g.money_line.away]
        : Array(2).fill(null),
    };
  }
  if (v === "OU" || v === "HOU" || v === "AOU" || v === "COR") {
    return {
      name: ["points", "Over", "Under"],
      odds: rocket(
        getAll(
          condition(
            v,
            ["OU", "HOU", "AOU", "COR"],
            [g?.totals, g?.team_total?.home, g?.team_total?.away, g?.totals]
          ),
          "over",
          "under"
        ),
        true
      ),
      type: true,
    };
  }
};

const getMarket = (v, first, out) => {
  let text = condition(
    v,
    ["1", "X", "2", "OU", "HOU", "AOU", "TC", "TB"],
    [
      "Home to Win 1",
      "1 Draw",
      "Away to Win 1",
      "1 2",
      "Home 2 1",
      "Away 2 1",
      "Total Corners 2 1",
      "Total Bookings 2 1",
    ]
  );

  text = first ? text.replace("1", "1st Half") : text.replace("1", "");
  text = out ? text.replace("2", out) : text.replace("2", "");
  return text;
};

export const Buttons = ({ currentMkt, game, mkt, tags, slider }) => {
  const { betList, setBetList } = useContext(Context);
  const { odds, name } = currentMkt;
  const [active, setActive] = useState(undefined);

  const activate = () => {
    for (let i = 0; i < betList.length; i++)
      if (betList[i].id === game.event_id && betList[i].mkt === mkt)
        return setActive(betList[i].v);
    setActive(undefined);
  };

  const addGame = (odd, v) => {
    let newBetList = betList.filter(
      (g) => g.id !== game.event_id || g.mkt !== mkt
    );

    if (active === v) {
      setBetList(newBetList);
      setActive(undefined);
      return;
    }
    const { event_id, home, away, starts, sport_id } = game;

    setActive(v);
    setBetList([
      ...newBetList,
      {
        id: event_id,
        sport_id,
        outcome: !currentMkt.type
          ? getMarket(name[v], mkt.includes("0") ? true : false)
          : getMarket(
              mkt[0] === "0" ? mkt.slice(1) : mkt,
              mkt.includes("0") ? true : false,
              name[parseInt(v[1])] + " " + odds[parseInt(v[0])][0]
            ),
        home,
        away,
        v,
        time: starts.split("T")[1].slice(0, -3),
        odd: parseFloat(odd).toFixed(2),
        mkt,
      },
    ]);
  };

  const locked = (v) => !v || v < 1.01;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(activate, [mkt, betList]);

  return (
    <>
      {!currentMkt.type ? (
        odds.map((odd, key) => (
          <button
            key={key}
            disabled={locked(odd)}
            onClick={() => addGame(odd.toFixed(2), key)}
            className={`active:scale-110 rounded-md duration-150 flex-1 relative fx ${
              key === active &&
              "dark:from-c1/90 from-c1 to-c2 dark:to-c2/90 bg-gradient-to-br text-white"
            } ${
              tags ? "gap-2 dark:bg-c4/80 bg-c3 fx h-11" : "dark:bg-black h-10"
            } ${slider ? "bg-c5" : "bg-c3"}`}
          >
            {tags && (
              <span className="text-11 fx mr-2 gap-2 text-c2 bottom-[105%]">
                {tags[key]}
              </span>
            )}
            {!locked(odd) ? (
              <span
                className={
                  game.rocketOdds &&
                  (key === active ? "text-white" : "text-orange-600 font-bold")
                }
              >
                {odd.toFixed(2)}
              </span>
            ) : (
              <BiLockAlt className="opacity-60" />
            )}
          </button>
        ))
      ) : (
        <>
          {tags ? (
            odds.map((odd, key) => (
              <div
                key={key}
                className="flex first-of-type:mt-3 gap-2 px-4 w-full"
              >
                {odd.map((v, key1) =>
                  key1 ? (
                    <button
                      className={`flex-[2] mt-2 relative active:scale-110 duration-150 dark:bg-c4/80 bg-c3 fx rounded-lg h-11 ${
                        active &&
                        parseInt(active[0]) === key &&
                        parseInt(active[1]) === key1 &&
                        "from-c1/75 to-c2/75 text-white bg-gradient-to-br"
                      }`}
                      key={key1}
                      onClick={() => addGame(v.toFixed(2), `${key}${key1}`)}
                    >
                      {v.toFixed(2)}
                      {!key && (
                        <span className="bottom-[110%] text-xs absolute opacity-25">
                          {tags[key1]}
                        </span>
                      )}
                    </button>
                  ) : (
                    <span
                      className="flex-1 mt-2 dark:bg-c4/40 bg-c4/50 text-white fx rounded-lg h-11"
                      key={key1}
                    >
                      {v}
                    </span>
                  )
                )}
              </div>
            ))
          ) : (
            <Visible
              active={active}
              locked={locked}
              betList={betList}
              odds={odds}
              game={game}
              mkt={mkt}
              addGame={addGame}
            />
          )}
        </>
      )}
    </>
  );
};

const Visible = ({ active, odds, locked, betList, addGame, game, mkt }) => {
  const checklist = (list, odds) => {
    for (let i = 0; i < list.length; i++)
      if (list[i].id === game.event_id && list[i].mkt === mkt)
        return parseInt(list[i].v[0]);
    return Math.floor(odds.length / 2);
  };
  const [visible, setVisible] = useState(odds && checklist(betList, odds));
  const [open, setOpen] = useState(false);

  return (odds[visible] ? odds[visible] : [null, null, null]).map((v, key) =>
    key === 0 ? (
      <button
        className={`h-10 text-sm w-full rounded-md relative fx ${
          open ? "dark:bg-black/50" : "dark:bg-black bg-c5"
        }`}
        disabled={v ? false : true}
        onClick={() => setOpen(!open)}
        onBlur={() => setOpen(false)}
        key={key}
      >
        {v ? (
          <>
            {v}
            <BsCaretUpFill className="text-[12px] ml-1 dark:opacity-20 opacity-60" />
            {open && (
              <span className="absolute px-3 pt-0.5 no-bars  max-w-[60vw] whitespace-nowrap overflow-y-hidden overflow-x-scroll flex bottom-[110%] z-[20]">
                <motion.ul
                  variants={{ init: { y: 10 }, show: { y: 0 } }}
                  transition={{ staggerChildren: 0.05 }}
                  initial="init"
                  animate="show"
                  className=" space-x-1 flex py-0.5"
                >
                  {odds.map((odd, key2) => (
                    <motion.li
                      key={key2}
                      variants={{
                        init: { y: 10, opacity: 0 },
                        show: { y: 0, opacity: 1 },
                      }}
                      className={`py-1 mb-1 dark:bg-black bg-c3 w-11 rounded-md ${
                        odd[0] === v ? "text-c2" : ""
                      }`}
                      onClick={() => setVisible(key2)}
                    >
                      {odd[0]}
                    </motion.li>
                  ))}
                </motion.ul>
              </span>
            )}
          </>
        ) : (
          <BiLockAlt className="opacity-60" />
        )}
      </button>
    ) : (
      <button
        disabled={locked(v)}
        onClick={() => addGame(v, `${visible}${key}`)}
        className={`bg-c3 active:scale-[3] duration-150 dark:bg-black h-10 text-sm w-full rounded-md relative fx ${
          active &&
          key === parseInt(active[1]) &&
          visible === parseInt(active[0]) &&
          "from-c1/75 to-c2/75 text-white bg-gradient-to-br"
        } `}
        key={key}
      >
        {v ? (
          <span
            className={
              game.rocketOdds &&
              (active &&
              key === parseInt(active[1]) &&
              visible === parseInt(active[0])
                ? "text-white"
                : "text-orange-600 font-bold")
            }
          >
            {v.toFixed(2)}
          </span>
        ) : (
          <BiLockAlt className="opacity-60" />
        )}
      </button>
    )
  );
};

export default function Odds({ className, game, slider, isLive, mkt = "1X2" }) {
  let g = mkt.includes("*") ? game?.periods?.specials : game?.periods;
  const currentMkt = useMemo(
    () =>
      market(
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
        currentMkt={currentMkt}
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
