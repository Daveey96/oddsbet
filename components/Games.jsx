import React, { useContext, useRef, useState } from "react";
import { motion } from "framer-motion";
import condition from "@/helpers/condition";
import { Context } from "./layout";
import {
  BiBasketball,
  BiCaretDown,
  BiDownArrow,
  BiFootball,
  BiLockAlt,
  BiTennisBall,
  BiUpArrowAlt,
} from "react-icons/bi";

const List = () => {
  let details = [
    <>
      <BiFootball /> soccer
    </>,
    <>
      <BiBasketball /> basketball
    </>,
    <>
      <BiTennisBall /> tennis
    </>,
  ];

  return (
    <ul className="flex text-sm gap-3">
      {details.map((detail, key) => (
        <li
          className={`flex fx border-[1px] gap-1 py-1 pr-3 pl-2 rounded-xl ${
            !key ? "text-c2 border-c2/60" : "border-white/20 "
          }`}
          key={key}
        >
          {detail}
        </li>
      ))}
    </ul>
  );
};

const List2 = () => {
  const [active, setActive] = useState(0);
  const ul = useRef(null);
  let details = [
    "1X2",
    "Double Chance",
    "Over/Under",
    "GG/NG",
    "Home O/U",
    "Away O/U",
  ];

  return (
    <ul className="flex overflow-x-scroll py-1 no-bars gap-3">
      {details.map((detail, key) => (
        <li
          className={`flex fx py-1 px-3 bg-gray-700/5 shadow-[0px_2px_2px_1px] shadow-black/10 rounded-xl duration-150 whitespace-nowrap ${
            key === active ? " text-c2/100 bg-c2/5" : "text-white/40"
          }`}
          key={key}
          onClick={(e) => setActive(key)}
        >
          {detail}
        </li>
      ))}
    </ul>
  );
};

const market = (g, v) => {
  const getAll = (mkt, out1, out2) => {
    let odds = [];

    if (!g[mkt] && g[mkt].length === 0) return [0, 0, 0];
    for (let i = 0; i < g[mkt].length; i++) {
      odds.push([g[mkt][i].type, g[mkt][i][out1].v, g[mkt][i][out2].v]);
    }

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
      name: ["", "over", "under"],
      tag: ["", "over", "under"],
      odds: getAll(
        condition(v, ["OU", "HOU", "AOU"], ["totals", "totals1", "totals2"]),
        "over",
        "under"
      ),
      dropd: true,
    };
  }
};

const OverUnder = ({ values, setActive }) => {
  const { currentMkt, slider, game, active } = values;
  const [curr, setCurr] = useState(2);

  return (
    <>
      {[0, 1, 2].map((key) => {
        const locked = currentMkt.odds[curr] && currentMkt.odds[curr][key] > 1;

        return (
          <React.Fragment key={key}>
            {key === 0 ? (
              <button
                whileTap={{ scale: 1.1 }}
                // disabled={!locked}
                // onClick={() => addGame(currentMkt.name[key], key)}
                className={`bg-black h-11 rounded-md relative flex-1 fx `}
              >
                {currentMkt.odds[curr] ? (
                  <span className="fx pl-2 gap-px">
                    {currentMkt.odds[curr][key]}
                    <BiDownArrow className="text-[13px] opacity-30" />
                  </span>
                ) : (
                  <BiLockAlt className="opacity-60" />
                )}
                <span className=""></span>
              </button>
            ) : (
              <motion.button
                whileTap={{ scale: 1.1 }}
                disabled={!locked}
                onClick={() => addGame(currentMkt.name[key], key)}
                className={`bg-black h-11 rounded-md relative flex-1 fx ${
                  key === active && "from-c1/75 to-c2/75 bg-gradient-to-br"
                } `}
              >
                {locked ? (
                  currentMkt.odds[curr][key].toFixed(2)
                ) : (
                  <BiLockAlt className="opacity-60" />
                )}
                {game.minute && currentMkt.odds[key] ? (
                  <span className="absolute text-green-500 right-[2%] top-[10%]">
                    <BiUpArrowAlt />
                  </span>
                ) : (
                  <></>
                )}
                {!slider && (
                  <span className="absolute fx bottom-[110%] text-sm text-white/10">
                    {currentMkt.tag[key]}
                  </span>
                )}
              </motion.button>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

const GameLayout = ({ children, className, game, slider }) => {
  const [active, setActive] = useState(undefined);
  const { betList, setBetList } = useContext(Context);
  const [mkt, setMkt] = useState("OU");

  let currentMkt = market(game.markets, mkt);

  const addGame = (mkt, key) => {
    if (active === key) {
      let newBetList = betList.filter((g) => g.id !== game.id);
      setBetList(newBetList);
      setActive(undefined);
      return;
    }

    const { id, team1, team2, date_start, markets } = game;
    const currentmkt = condition(
      key,
      [0, 1, 2],
      [markets.win1?.v || 0, markets.winX?.v || 0, markets.win2?.v || 0]
    ).toFixed(2);

    let newBetList = betList.filter((g) => g.id !== game.id);
    setBetList([
      ...newBetList,
      {
        id,
        mkt,
        team1,
        team2,
        date_start: date_start.split("T")[1].slice(0, 5),
        currentmkt,
      },
    ]);
    setActive(key);
  };

  return (
    <>
      <>{children}</>
      <div className={"fx gap-1 relative " + className}>
        {currentMkt.dropd ? (
          <OverUnder
            values={{ slider, active, currentMkt, game }}
            setActive={setActive}
          />
        ) : (
          <>
            {[0, 1, 2].map((key) => {
              const locked = currentMkt.odds[key] && currentMkt.odds[key] > 1;
              return (
                <motion.button
                  key={key}
                  whileTap={{ scale: 1.1 }}
                  disabled={!locked}
                  onClick={() => addGame(currentMkt.name[key], key)}
                  className={`bg-black h-11 rounded-md relative flex-1 fx ${
                    key === active && "from-c1/75 to-c2/75 bg-gradient-to-br"
                  } `}
                >
                  {locked ? (
                    currentMkt.odds[key].toFixed(2)
                  ) : (
                    <BiLockAlt className="opacity-60" />
                  )}
                  {game.minute && currentMkt.odds[key] ? (
                    <span className="absolute text-green-500 right-[2%] top-[10%]">
                      <BiUpArrowAlt />
                    </span>
                  ) : (
                    <></>
                  )}
                  {!slider && (
                    <span className="absolute fx bottom-[110%] text-sm text-white/10">
                      {currentMkt.tag[key]}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </>
        )}

        {slider && (
          <span className="absolute fx gap-7 bottom-[115%] text-white/50">
            <span className="text-sm mt-0.5">1X2 FT</span>
          </span>
        )}
      </div>
    </>
  );
};

const Game = ({ game }) => {
  return (
    <div className={`flex bg-gray-700/10 flex-col px-4 pt-3 pb-3 gap-1 `}>
      <span className=" w-full flex gap-2 text-[13px]">
        <span className="text-c2 ">
          {game.minute
            ? game.minute + "' " + game.seconds + "'"
            : game.date_start.split("T")[1].slice(0, 5)}
        </span>
        <span className="w-[32%] overflow-hidden opacity-30 text-ellipsis whitespace-nowrap">
          {game.title}
        </span>
      </span>
      <div className="w-full flex justify-between items-center">
        <GameLayout game={game} className={"w-[58%]"}>
          <div className="flex flex-col w-[42%]">
            {[0, 1].map((key) => (
              <span
                className={`flex pr-1 gap-1 items-center ${
                  key === 1 && "order-3"
                }`}
                key={key}
              >
                <img src={"/badge.svg"} className={"w-5 h-5 mb-1"} alt="" />
                <span className="flex  text-sm bg--400 overflow-hidden flex-1 items-center justify-between mr-1">
                  <span
                    className={
                      "flex-1 mr-4 text-ellipsis whitespace-nowrap overflow-hidden mb-0.5"
                    }
                  >
                    {key ? game.team2 : game.team1}
                  </span>
                  {game.minute && (
                    <span className="mb-0.5 opacity-40">
                      {key ? game.score2 : game.score1}
                    </span>
                  )}
                </span>
              </span>
            ))}
          </div>
        </GameLayout>
      </div>
    </div>
  );
};

const Load = ({ className, children, opacity }) => (
  <motion.span
    animate={{
      opacity: opacity || [0.5, 1],
      transition: {
        repeat: Infinity,
        duration: 0.8,
        repeatType: "mirror",
      },
    }}
    className={"text-white/0 bg-white/5 rounded-md " + className}
  >
    {children}
  </motion.span>
);

const GameList = ({ title, className, games }) => {
  return (
    <div
      className={`flex relative flex-col w-full gap-[1px] overflow-hidden ${className}`}
    >
      <div className="flex flex-col bg-gray-700/10  pt-6 pb-2">
        <span className=" text-lg gap-3 flex items-center pl-5">
          <span>{title}</span> <span className="opacity-50">|</span>
          <List />
        </span>
        <span className="px-3 my-2">
          <List2 />
        </span>
      </div>
      {games ? (
        <>
          {games.map((game, key) => (
            <Game key={key} game={game} title={title}></Game>
          ))}
        </>
      ) : (
        <div className="flex flex-col">
          {Array(3)
            .fill("")
            .map((item, key) => (
              <div
                key={key}
                className={`flex last:pb-10 bg-gray-700/10 flex-col px-5 pt-3 pb-3 gap-1 `}
              >
                <span className=" w-full h-3 flex gap-1">
                  <Load className="w-14 "></Load>
                  <Load className="w-28" opacity={[0.1, 0.4]}></Load>
                </span>
                <div className="w-full flex justify-between gap-3 items-center">
                  <div className="flex flex-col gap-1 w-2/5">
                    {[0, 1].map((key) => (
                      <Load className="h-[18px]" key={key}></Load>
                    ))}
                  </div>
                  <div className="fx gap-1 w-3/5">
                    {[0, 1, 2].map((key) => (
                      <Load key={key} className="h-10 flex-1">
                        0.00
                      </Load>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
      {title === "Live" && games && (
        <button className="absolute bottom-2 right-7 text-c2 text-sm">
          view more
        </button>
      )}
    </div>
  );
};

export default GameList;

export { GameLayout };
