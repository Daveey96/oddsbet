import React, { useContext, useMemo, useState } from "react";
import { BiDownArrow, BiLockAlt } from "react-icons/bi";
import { Context } from "../layout";
import { condition } from "@/helpers";

export const market = (game, v, first) => {
  if (!game) return false;
  let g = first ? game.periods.num_1 : game.periods.num_0;

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

  if (v === "WDL") {
    return {
      name: ["home", "draw", "away"],
      tag: ["W1", "D", "W2"],
      odds: g?.money_line
        ? [g.money_line.home, g.money_line.draw, g.money_line.away]
        : Array(3).fill(null),
    };
  }
  if (v === "WL") {
    return {
      name: ["home", "away"],
      tag: ["W1", "W2"],
      odds: g?.money_line
        ? [g.money_line.home, g.money_line.away]
        : Array(2).fill(null),
    };
  }
  if (v === "DB") {
    return {
      name: ["home or draw", "draw or away", "home or away"],
      tag: ["1X", "X2", "12"],
      odds: [g.win1X?.v, g.winX2?.v, g.win12?.v],
    };
  }
  if (v === "OU" || v === "HOU" || v === "AOU" || v === "COR") {
    return {
      name: ["", "Over", "Under"],
      tag: ["", "over", "under"],
      odds: getAll(
        condition(
          v,
          ["OU", "HOU", "AOU", "COR"],
          [g?.totals, g?.team_total?.home, g?.team_total?.away, g?.totals]
        ),
        "over",
        "under"
      ),
      type: "td",
    };
  }
};

const Layout_I = ({ currentMkt, slider, game, mkt, isLive }) => {
  const { betList, setBetList } = useContext(Context);
  const { odds, tag, name } = currentMkt;
  const [active, setActive] = useState(undefined);

  const activate = () => {
    for (let i = 0; i < betList.length; i++)
      if (betList[i].id === game.event_id && betList[i].mkt === mkt) {
        return setActive(name.indexOf(betList[i].outcome));
      }

    setActive(undefined);
  };
  const addGame = (odd, key) => {
    let newBetList = betList.filter(
      (g) => g.id !== game.event_id || g.mkt !== mkt
    );

    if (active === key) {
      setBetList(newBetList);
      setActive(undefined);
      return;
    }
    const { event_id, home, away, starts, sport_id } = game;

    setActive(key);
    setBetList([
      ...newBetList,
      {
        id: event_id,
        sport_id,
        outcome: name[key],
        text: condition(
          name[key],
          ["home", "away", "*"],
          [`${home} to win`, `${away} to win`, "Draw"]
        ),
        home,
        away,
        time: starts.split("T")[1].slice(0, -3),
        odd,
        mkt,
      },
    ]);
  };
  const locked = (key) => odds[key] && odds[key] >= 1.01;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(activate, [mkt, betList]);

  return (
    <>
      {odds.map((odd, key) => (
        <button
          key={key}
          disabled={!locked(key)}
          onClick={() => addGame(odd.toFixed(2), key)}
          className={`bg-black/20 dark:bg-black h-10 active:scale-110 duration-150 text-sm w-full rounded-md relative fx ${
            key === active &&
            "dark:from-c1/90 from-c1 to-c2 dark:to-c2/90 bg-gradient-to-br text-white"
          } `}
        >
          {locked(key) ? odd.toFixed(2) : <BiLockAlt className="opacity-60" />}
          {/* {!slider && (
            <span
              className={`absolute bottom-[110%] text-[10px] leading-3 px-2 ${
                !isLive
                  ? "shadow-c4 text-white/40 shadow-[-9px_0px_6px_0] bg-c4"
                  : "text-c2/80"
              } `}
            >
              {tag[key]}
            </span>
          )} */}
        </button>
      ))}
    </>
  );
};

const Layout_II = ({ currentMkt, slider, game, mkt, isLive }) => {
  const { betList, setBetList } = useContext(Context);
  const { odds, tag, name } = currentMkt;

  const [v, setV] = useState(odds && Math.floor(odds.length / 2));
  const [active, setActive] = useState(undefined);
  const [open, setOpen] = useState(false);

  const [point, mkt1, mkt2] = useMemo(() => odds[v], [v, odds]);

  const activate = () => {
    for (let i = 0; i < betList.length; i++)
      if (
        betList[i].id === game.event_id &&
        betList[i].mkt === mkt &&
        betList[i].v === v
      )
        return setActive(name.indexOf(betList[i].outcome.split("@")[0]));

    setActive(undefined);
  };
  const addGame = (odd, key) => {
    let newBetList = betList.filter(
      (g) => g.id !== game.event_id || g.mkt !== mkt
    );

    if (active === key) {
      setBetList(newBetList);
      setActive(undefined);
      return;
    }
    const { event_id, home, away, starts, sport_id } = game;

    setActive(key);
    setBetList([
      ...newBetList,
      {
        id: event_id,
        sport_id,
        outcome: name[key] + "@" + v,
        home,
        away,
        v,
        time: starts.split("T")[1].slice(0, -3),
        odd,
        mkt,
      },
    ]);
  };
  const locked = (key) => odds[v][key] && odds[v][key] >= 1.01;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(activate, [mkt, v, betList]);

  return (
    <>
      {[0, 1, 2].map((key) => {
        return (
          <>
            {key === 0 ? (
              <button
                className={`h-10 text-sm w-full rounded-md relative fx ${
                  open ? "bg-black/50" : "bg-black"
                }`}
                disabled={odds ? false : true}
                onClick={() => setOpen(!open)}
                onBlur={() => setOpen(false)}
              >
                {odds ? (
                  <>
                    {point}
                    <BiDownArrow className="text-[13px] ml-1 opacity-20" />
                    {open && (
                      <span className="absolute px-3 pt-0.5 rounded-b-xl no-bars bg-c4 max-w-[60vw] whitespace-nowrap overflow-y-hidden overflow-x-scroll flex bottom-[110%] z-[20]">
                        <ul className=" space-x-1 flex py-0.5">
                          {odds.map((odd, key2) => (
                            <li
                              key={key2}
                              className={`py-1 mb-1 bg-black w-11 rounded-lg ${
                                odd[0] === point ? "text-c2" : ""
                              }`}
                              onClick={() => setV(key2)}
                            >
                              {odd[0]}
                            </li>
                          ))}
                        </ul>
                      </span>
                    )}
                  </>
                ) : (
                  <BiLockAlt className="opacity-60" />
                )}
              </button>
            ) : (
              <button
                disabled={!locked(key)}
                onClick={() => addGame(odds[v][key], key)}
                className={`bg-black/20 dark:bg-black h-10 text-sm w-full rounded-md relative fx ${
                  key === active && "from-c1/75 to-c2/75 bg-gradient-to-br"
                } `}
              >
                {odds ? (
                  key === 1 ? (
                    mkt1.toFixed(2)
                  ) : (
                    mkt2.toFixed(2)
                  )
                ) : (
                  <BiLockAlt className="opacity-60" />
                )}
                {/* {!slider && (
                  <span className="absolute bottom-[110%] shadow-[-15px_0px_6px_0] shadow-c4 text-[10px] bg-c4 leading-3 text-white/40 px-2 ">
                    {tag[key]}
                  </span>
                )} */}
              </button>
            )}
          </>
        );
      })}
    </>
  );
};

export default function Odds({ className, game, slider, isLive, mkt = "WDL" }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentMkt = useMemo(() => market(game, mkt), [mkt]);

  return (
    <div className={"fx gap-1 relative " + className}>
      {currentMkt.type ? (
        <Layout_II
          game={game}
          mkt={mkt}
          key={mkt}
          currentMkt={currentMkt}
          slider={slider}
          isLive={isLive}
        />
      ) : (
        <Layout_I
          game={game}
          mkt={mkt}
          key={mkt}
          currentMkt={currentMkt}
          slider={slider}
          isLive={isLive}
        />
      )}
      {slider && (
        <span className="absolute mt-0.5 text-white/50 text-xs fx gap-7 bottom-[110%] ">
          {mkt}
        </span>
      )}
    </div>
  );
}
