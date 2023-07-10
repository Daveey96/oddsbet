import React, { useContext, useMemo, useState } from "react";
import { BiDownArrow, BiLockAlt } from "react-icons/bi";
import { Context } from "../layout";
import { condition } from "@/helpers";

const market = (g, v) => {
  if (!g) return false;
  const getAll = (mkt, out1, out2) => {
    let odds = [];
    if (!g[mkt] && g[mkt].length === 0) return false;
    for (let i = 0; i < g[mkt].length; i++)
      odds.push([g[mkt][i].type, g[mkt][i][out1].v, g[mkt][i][out2].v]);

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
        condition(v, ["OU", "HOU", "AOU"], ["totals", "totals1", "totals2"]),
        "over",
        "under"
      ),
      type: "td",
    };
  }
};

// const OddsChange = ({ odds }) => {
//   const [upOrDown, setUpOrDown] = useState(0);
//   let upAndDown = useRef(null);

//   useEffect(() => {
//     if (upAndDown.current === null) upAndDown.current = odds;
//     else {
//       setUpOrDown(Math.sign(odds - upAndDown.current));
//       upAndDown.current = odds;
//     }
//   }, [odds]);

//   return (
//     <>
//       {upOrDown !== 0 && (
//         <span
//           className={`absolute right-[2%] top-[10%] ${
//             upOrDown === 1 ? "text-green-500" : "text-red-500"
//           }`}
//         >
//           {upOrDown === 1 ? <BiUpArrowAlt /> : <BiDownArrowAlt />}
//         </span>
//       )}
//     </>
//   );
// };

const Layout_I = ({ currentMkt, slider, game, mkt }) => {
  const { betList, setBetList } = useContext(Context);
  const { odds, tag, name } = currentMkt;
  const [active, setActive] = useState(undefined);

  const activate = () => {
    for (let i = 0; i < betList.length; i++)
      if (betList[i].id === game.event_id && betList[i].mkt === mkt) {
        return setActive(name.indexOf(betList[i].name));
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
    const { event_id, home, away, starts } = game;

    setActive(key);
    setBetList([
      ...newBetList,
      {
        id: event_id,
        game,
        sportId: 1,
        name: name[key],
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
            <span className="absolute fx -top-0.5 left-1 text-[9px] text-white/10">
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

  const [score, setScore] = useState(odds && Math.floor(odds.length / 2));
  const [active, setActive] = useState(undefined);
  const [open, setOpen] = useState(false);

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
    const { event_id, home, away, starts } = game;

    console.log({
      id: event_id,
      key,
      name: ev ? `${name[key]}@${odds[score][0]}` : name[key],
      home,
      away,
      eventType: "",
      score: ev && score,
      time: "15:00",
      odd: odd.toFixed(2),
      mkt,
    });
    setActive(key);
    // setBetList([
    //   ...newBetList,
    //   {
    //     id: event_id,
    //     key,
    //     name: ev ? `${name[key]}@${odds[score][0]}` : name[key],
    //     home,
    //     away,
    //     eventType: "",
    //     score: ev && score,
    //     time: starts.split("T").slice(0, -3),
    //     odd: odd.toFixed(2),
    //     mkt,
    //   },
    // ]);
  };
  const locked = (key) => odds[key] && odds[key] >= 1.01;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(activate, [mkt, score, betList]);

  return (
    <>
      {[0, 1, 2].map((key) => {
        return (
          <>
            {key === 0 ? (
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
              <button
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
                  <span className="absolute fx -top-0.5 left-1 text-[11px] text-white/10">
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

export default function Odds({ className, game, slider, mkt = "1X2" }) {
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
        <span className="absolute mt-0.5 text-white/50 text-sm fx gap-7 bottom-[115%] ">
          {mkt}
        </span>
      )}
    </div>
  );
}
