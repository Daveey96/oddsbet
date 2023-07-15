import React, { useContext, useMemo, useState } from "react";
import { BiDownArrow, BiLockAlt } from "react-icons/bi";
import { Context } from "../layout";
import { condition } from "@/helpers";

const market = (g, v) => {
  if (!g) return false;
  const getAll = (mkt) => {
    if (!mkt) return Array(3).fill(null);
    let odds = [];
    const values = Object.values(mkt).map((value) => value);
    values.forEach(
      (i) =>
        i.points.toString().length === 3 &&
        odds.push([i.points, i.over, i.under])
    );
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
  if (v === "OU" || v === "HOU" || v === "AOU") {
    return {
      name: ["", "Over", "Under"],
      tag: ["", "over", "under"],
      odds: getAll(
        condition(
          v,
          ["OU", "HOU", "AOU"],
          [g?.totals, g?.team_total?.home, g?.team_total?.away]
        ),
        "over",
        "under"
      ),
      type: "td",
    };
  }
};

const Layout_I = ({ currentMkt, slider, game, mkt }) => {
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
          className={`bg-black h-10 active:scale-110 duration-150 text-sm w-full rounded-md relative fx ${
            key === active && "from-c1/75 to-c2/75 bg-gradient-to-br"
          } `}
        >
          {locked(key) ? odd.toFixed(2) : <BiLockAlt className="opacity-60" />}
          {!slider && (
            <span
              className={`absolute bottom-[110%] shadow-[-9px_0px_6px_0] shadow-c4 text-[10px] bg-c4 leading-3 text-white/40 px-2 `}
            >
              {tag[key]}
            </span>
          )}
        </button>
      ))}
    </>
  );
};

const Layout_II = ({ currentMkt, slider, game, mkt }) => {
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
                className={`bg-black h-10 text-sm w-full rounded-md relative fx `}
                disabled={odds ? false : true}
                onClick={() => setOpen(!open)}
                onBlur={() => setOpen(false)}
              >
                {odds ? (
                  <>
                    {point}
                    <BiDownArrow className="text-[13px] ml-1 opacity-20" />
                    {open && (
                      <ul className="absolute w-full z-10 bg-c4 border-[1px] border-white/10 rounded-lg flex text-white/75 flex-col">
                        {odds.map((odd, key2) => (
                          <li
                            key={key2}
                            className="py-2 w-full"
                            onClick={() => setV(key2)}
                          >
                            {odd[0]}
                          </li>
                        ))}
                      </ul>
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
                className={`bg-black h-10 text-sm w-full rounded-md relative fx ${
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
                {!slider && (
                  <span className="absolute bottom-[110%] shadow-[-15px_0px_6px_0] shadow-c4 text-[10px] bg-c4 leading-3 text-white/40 px-2 ">
                    {tag[key]}
                  </span>
                )}
              </button>
            )}
          </>
        );
      })}
    </>
  );
};

export default function Odds({ className, game, slider, mkt = "WDL" }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentMkt = useMemo(() => market(game.periods.num_0, mkt), [mkt]);

  return (
    <div className={"fx gap-1 relative " + className}>
      {currentMkt.type ? (
        <Layout_II
          game={game}
          mkt={mkt}
          key={mkt}
          currentMkt={currentMkt}
          slider={slider}
        />
      ) : (
        <Layout_I
          game={game}
          mkt={mkt}
          key={mkt}
          currentMkt={currentMkt}
          slider={slider}
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
