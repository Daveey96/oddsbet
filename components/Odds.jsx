import React, { useContext, useEffect, useMemo, useState } from "react";
import { SkeletonLoad } from "./services/Loaders";
import { motion } from "framer-motion";
import {
  BiDownArrow,
  BiDownArrowAlt,
  BiLockAlt,
  BiUpArrowAlt,
} from "react-icons/bi";
import { Context } from "./layout";
import condition from "@/helpers/condition";

const market = (g, v) => {
  const getAll = (mkt, out1, out2) => {
    let odds = [];
    if (!g[mkt] && g[mkt].length === 0) return false;
    for (let i = 0; i < g[mkt].length; i++)
      odds.push([g[mkt][i].type, g[mkt][i][out1].v, g[mkt][i][out2].v]);

    return odds;
  };

  if (v === "1X2") {
    return {
      name: ["home", "draw", "away"],
      tag: ["1", "X", "2"],
      odds: [g.win1?.v, g.winX?.v, g.win2?.v],
    };
  }
  if (v === "DB") {
    return {
      name: ["home or draw", "draw or away", "home or away"],
      tag: ["1X", "X2", "12"],
      odds: [g.win1X?.v, g.winX2?.v, g.win12?.v],
    };
  }
  if (v === "GGNG") {
    return {
      name: ["both teams score. Yes", "both teams score. No"],
      tag: ["GG", "NG"],
      odds: [g.bothToScore?.yes?.v, g.bothToScore?.no?.v],
    };
  }
  if (v === "OU" || v === "HOU" || v === "AOU") {
    return {
      name: ["", "Over", "Under"],
      tag: ["", "over", "under"],
      odds: getAll(
        condition(v, ["OU", "HOU", "AOU"], ["totals", "totals1", "totals2"]),
        "over",
        "under"
      ),
    };
  }
};

const OddsChange = ({ odds }) => {
  const [upOrDown, setUpOrDown] = useState(0);
  let upAndDown = useRef(null);

  useEffect(() => {
    if (upAndDown.current === null) upAndDown.current = odds;
    else {
      setUpOrDown(Math.sign(odds - upAndDown.current));
      upAndDown.current = odds;
    }
  }, [odds]);

  return (
    <>
      {upOrDown !== 0 && (
        <span
          className={`absolute right-[2%] top-[10%] ${
            upOrDown === 1 ? "text-green-500" : "text-red-500"
          }`}
        >
          {upOrDown === 1 ? <BiUpArrowAlt /> : <BiDownArrowAlt />}
        </span>
      )}
    </>
  );
};

const Select = ({ currentMkt, slider, game, mkt }) => {
  const { betList, setBetList } = useContext(Context);
  const { odds, tag, name } = currentMkt;

  const [score, setScore] = useState(odds && Math.floor(odds.length / 2));
  const [active, setActive] = useState(undefined);
  const [open, setOpen] = useState(false);
  const ev = mkt.slice(-2) === "OU";

  const activate = () => {
    for (let i = 0; i < betList.length; i++)
      if (ev) {
        if (
          betList[i].id === game.id &&
          betList[i].mkt === mkt &&
          betList[i].score === score
        ) {
          return setActive(betList[i].key);
        }
      } else {
        if (betList[i].id === game.id && betList[i].mkt === mkt) {
          return setActive(betList[i].key);
        }
      }

    setActive(undefined);
  };
  const addGame = (odd, key) => {
    let newBetList = betList.filter((g) => g.id !== game.id || g.mkt !== mkt);

    if (active === key) {
      setBetList(newBetList);
      setActive(undefined);
      return;
    }
    const { id, team1, team2, date_start } = game;

    setBetList([
      ...newBetList,
      {
        id,
        key,
        name: ev ? `${name[key]}@${odds[score][0]}` : name[key],
        team1,
        team2,
        score: ev && score,
        date_start: date_start.split("T")[1].slice(0, 5),
        odd: odd.toFixed(2),
        mkt,
      },
    ]);
    setActive(key);
  };
  const locked = (key) => odds[key] && odds[key] >= 1.01;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(activate, [mkt, score, betList]);

  return (
    <>
      {[0, 1, 2].map((key) => {
        return (
          <SkeletonLoad
            key={`${mkt}${key}`}
            state={game}
            className="flex-1 h-11"
          >
            {ev && key === 0 ? (
              <button
                className={`bg-black h-full text-sm w-full rounded-md relative fx `}
                disabled={odds ? false : true}
                onClick={() => setOpen(!open)}
                onBlur={() => setOpen(false)}
              >
                {odds ? (
                  <>
                    {odds[score][0]}
                    <BiDownArrow className="text-[13px] ml-1 opacity-20" />
                    {open && (
                      <ul className="absolute w-full z-10 bg-c4 border-[1px] border-white/10 rounded-lg flex text-white/75 flex-col">
                        {odds.map((odd, key2) => (
                          <li
                            key={key2}
                            className="py-2 w-full"
                            onClick={() => setScore(key2)}
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
              <motion.button
                whileTap={{ scale: 1.1 }}
                disabled={ev ? (odds ? false : true) : !locked(key)}
                onClick={() => addGame(ev ? odds[score][key] : odds[key], key)}
                className={`bg-black h-full text-sm w-full rounded-md relative fx ${
                  key === active && "from-c1/75 to-c2/75 bg-gradient-to-br"
                } `}
              >
                {ev ? (
                  <>
                    {odds ? (
                      `${odds[score][key].toFixed(2)}`
                    ) : (
                      <BiLockAlt className="opacity-60" />
                    )}
                  </>
                ) : (
                  <>
                    {locked(key) ? (
                      odds[key].toFixed(2)
                    ) : (
                      <BiLockAlt className="opacity-60" />
                    )}
                  </>
                )}
                {/* {game.minute && .odds[key] && (
                  <OddsChange odds={odds[key].toFixed(2)} />
                )} */}
                {!slider && (
                  <span className="absolute fx bottom-[105%] text-[12px] text-white/10">
                    {tag[key]}
                  </span>
                )}
              </motion.button>
            )}
          </SkeletonLoad>
        );
      })}
    </>
  );
};

export default function Odds({ className, game, slider, mkt = "1X2" }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentMkt = useMemo(() => market(game.markets, mkt), [mkt]);

  return (
    <div className={"fx gap-1 relative " + className}>
      <Select
        game={game}
        mkt={mkt}
        key={mkt}
        currentMkt={currentMkt}
        slider={slider}
      />
      {slider && (
        <SkeletonLoad
          state={game}
          iClass="w-10 scale-y-75"
          ngClass="text-white/50"
          className="absolute mt-0.5 text-sm fx gap-7 bottom-[115%] "
        >
          1X2 FT
        </SkeletonLoad>
      )}
    </div>
  );
}
