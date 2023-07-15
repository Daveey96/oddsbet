import React, { useContext, useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { BiFootball, BiXCircle } from "react-icons/bi";
import Image from "next/image";
import axios from "axios";
import List from "./List";
import Odds from "./Odds";
import Retry from "../services/Retry";
import { Context } from "../layout";
import { getDate } from "@/helpers";
import footBall from "@/helpers/football";
import { apiController } from "@/controllers";

export const sports = [
  {
    id: 1,
    item: "soccer",
    markets: [
      { item: "WDL", v: "WDL" },
      { item: "over | under", v: "OU" },
      { item: "home over | under", v: "HOU" },
      { item: "away over | under", v: "AOU" },
    ],
  },
  {
    id: 3,
    item: "basketball",
    markets: [
      { item: "Winner", v: "WL" },
      { item: "over | under", v: "OU" },
      { item: "home over | under", v: "HOU" },
      { item: "away over | under", v: "AOU" },
    ],
  },
  { id: 2, item: "tennis" },
  { id: 4, item: "hockey" },
  { id: 5, item: "volleyball" },
  { id: 6, item: "handball" },
  { id: 7, item: "mixed martial Arts" },
  { id: 8, item: "baseball" },
];

const Game = ({ game, mkt, isLive }) => {
  const [g, setG] = useState(game);
  const { setGameId } = useContext(Context);

  const getGame = async () => {
    if (g.minute) {
      try {
        let { data } = await axios.get(
          `https://api.betting-api.com/1xbet/football/live/${g.id}`,
          {
            headers: {
              Authorization:
                "50b134713d5b4f4fa563d9063c0be5b9820c6bac24aa4637bfde0bb96eb5e897",
            },
          }
        );

        console.log(data);
        if (data) {
          setG(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // useEffect(() => {
  //   if (g && index < 5) {
  //     setTimeout(() => {
  //       getGame();
  //     }, 3000);
  //   }
  // }, [g]);

  // useEffect(() => {
  //   !g && setG(game);
  // }, [game]);

  return (
    <div
      className={`flex bg-white w-full flex-col px-3 pt-2.5 last-of-type:pb-12 md:last-of-type:rounded-b-2xl pb-2 ${
        isLive ? "dark:bg-[#010f12]" : "dark:bg-c4"
      }`}
    >
      <div className="w-full flex gap-2 text-[11px]">
        <span className="text-c2 ">{g.starts.split("T")[1].slice(0, -3)}</span>
        <span className="w-[62%] overflow-hidden opacity-30 text-ellipsis whitespace-nowrap">
          {g.league_name}
        </span>
      </div>
      <div className="w-full flex justify-between items-center">
        <div className="flex h-9 pr-3 flex-col justify-between w-[42%]">
          {[0, 1].map((key) => (
            <span
              onClick={() => setGameId(g.event_id)}
              className="flex pl-1 rounded-md active:bg-white/5 duration-200 pr-2 bg-white/0 gap-1 items-center"
              key={key}
            >
              <Image
                width={11}
                height={10}
                src={"/badge.svg"}
                className="-translate-y-0.5"
                alt=""
              />
              <span className="flex flex-1 pr-6 text-ellipsis whitespace-nowrap overflow-hidden text-[12px] leading-[20px] items-center justify-between">
                {key ? g.away : g.home}
              </span>
            </span>
          ))}
        </div>
        <Odds game={g} mkt={mkt} className={"w-[58%]"} />
      </div>
    </div>
  );
};

const GameList = ({ title, globalGames, getGames }) => {
  const [mkt, setMkt] = useState("WDL");
  const [games, setGames] = useState(null);
  const [sportId, setSportId] = useState(1);
  const { scrollY } = useScroll();
  const header = useRef(null);
  const pos = useRef(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    latest > pos.current
      ? header.current.classList.add("isSticky")
      : header.current.classList.remove("isSticky");
  });

  useEffect(() => {
    pos.current = header.current.offsetTop;
  }, [games]);

  useEffect(() => {
    setGames(globalGames);
  }, [globalGames]);

  const changeSport = (id) => {
    getGames(id);
    setSportId(id);
  };

  return (
    <>
      <header
        ref={header}
        className={`flex mb-px z-20 md:rounded-t-2xl sticky w-full -top-[1px] flex-col bg-white pb-1 pt-5 ${
          title === "Live" ? "dark:bg-c2/5" : "dark:bg-c4"
        }`}
      >
        <span className=" text-base gap-3 flex items-center pl-5">
          <span className="">{title}</span>{" "}
          <span className="opacity-50">|</span>
          <List
            iClass="pt-0.5 pb-0.5 mt-0.5 text-[13px] gap-1 pr-3 pl-2"
            activeClass={`text-c2`}
            inActiveClass={"border-white/20"}
            onClick={changeSport}
            list={sports}
            v="id"
            icon
          />
        </span>
        <List
          className={"mt-1 mb-1 py-1 px-3"}
          iClass="px-3.5 py-1 bg-gray-700/5 active:opacity-10 opacity-100 rounded-lg shadow-[0px_2px_2px_1px] shadow-black/20 duration-200"
          activeClass={"text-c2"}
          inActiveClass={"text-white/40"}
          onClick={(v) => setMkt(v)}
          list={sports.filter((g) => g.id === sportId)[0].markets}
        />
      </header>
      <Retry
        state={games}
        loading={
          <div className="flex flex-col mb-2 relative items-center w-full gap-px">
            {Array(4)
              .fill("")
              .map((i, key) => (
                <div
                  key={key}
                  className="flex dark:bg-c4 bg-white w-full flex-col px-3 pt-2.5 last-of-type:pb-12 md:last-of-type:rounded-b-2xl pb-2"
                >
                  <div className="w-[46%] rounded-md bg-slate-600/20 leading-[14px] mb-1 fade text-[12px]"></div>
                  <div className="w-full flex justify-between items-center">
                    <div className="flex h-10 flex-col justify-between w-[42%]">
                      {[0, 1].map((key) => (
                        <span
                          className="flex bg-white/0 pr-1 w-full gap-1 items-center"
                          key={key}
                        >
                          <Image
                            width={11}
                            height={10}
                            src={"/badge.svg"}
                            alt=""
                          />
                          <span className="fade rounded-md flex-1 bg-slate-600/20 text-[12px] leading-[15px] mr-1"></span>
                        </span>
                      ))}
                    </div>
                    <div className="w-[58%] flex gap-2">
                      {Array(3)
                        .fill("")
                        .map((i, key2) => (
                          <span
                            key={key2}
                            className="bg-slate-600/20 rounded-md fade flex-1 h-10"
                          ></span>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        }
        error={
          <div className="relative fx w-full">
            <div className="flex flex-col mb-2 relative items-center w-full gap-px">
              {Array(4)
                .fill("")
                .map((i, key) => (
                  <span
                    key={key}
                    className="flex w-full flex-col px-3 pt-2.5 last-of-type:pb-12 pb-2"
                  >
                    <span className="w-full leading-[14px] mb-1 text-[12px]">
                      |
                    </span>
                    <span className="w-full h-10"></span>
                  </span>
                ))}
            </div>
            <div className="w-full h-full gap-2 fx md:rounded-b-2xl absolute bg-c4 inset-0 z-20 fx flex-col">
              <BiXCircle className="text-3xl" />
              Something went wrong
              <button className="text-c2" onClick={getGames}>
                refresh
              </button>
            </div>
          </div>
        }
      >
        {typeof games === "object" && games && (
          <div className="flex flex-col mb-2 relative items-center w-full gap-px">
            {games.slice(0, 15).map((game, key) => (
              <Game key={key} isLive={title === "Live"} game={game} mkt={mkt} />
            ))}
            <motion.button
              whileTap={{ opacity: 0.3 }}
              className="absolute bottom-0 bg-c2/5 text-[12px] pt-0.5 pb-1 rounded-t-xl px-3.5 text-c2"
            >
              view more
            </motion.button>
          </div>
        )}
      </Retry>
    </>
  );
};

export default function GameDays() {
  const [array, setArray] = useState(["Today"]);
  const [games, setGames] = useState(null);

  const filterGames = (data, isoString, len = 7) => {
    let dataArr = [];
    let dataSpecialArr = [];
    let filter = data.events.filter(
      (v) => v.starts.split("T")[0] === isoString
    );
    let l = filter.filter((v) => v.parent_id !== null);

    filter.forEach((element) => {
      if (element.parent_id) {
        let r = filter.filter((v) => v.event_id === element.parent_id);
        r[0].periods.num_0[element.resulting_unit.toLowerCase()] =
          element.periods.num_0.totals;
        dataSpecialArr.push(r[0]);
      } else {
        const g = l.filter((v) => v.parent_id === element.event_id);
        if (!g) dataArr.push(element);
      }
    });

    const Arr = [
      ...dataSpecialArr,
      ...dataArr.sort((a, b) => a.league_id - b.league_id),
    ]
      .slice(0, len)
      .sort(
        (a, b) =>
          parseInt(a.starts.split("T")[1].slice(0, 2)) -
          parseInt(b.starts.split("T")[1].slice(0, 2))
      );

    return Arr;
  };

  const getGames = async (id) => {
    setGames("loading");

    // const data = await apiController.getMatches(1);
    const data = footBall;

    if (data.events) {
      let genArray = [];
      let daysArr = [];
      let day = -8;

      for (let i = 0; i < 3; i++) {
        const { isoString, weekDay } = getDate(day);
        const games = filterGames(data, isoString, 5);
        daysArr.push(i ? weekDay : "Today");
        genArray.push(games);
        day++;
      }

      setArray(["Live", ...daysArr]);
      setGames(genArray);
    } else setGames("error");
  };

  useEffect(() => {
    setTimeout(() => {
      games === null && getGames();
    }, 3000);
  }, [games]);

  return (
    <>
      {array.map((title, key) => (
        <GameList
          title={title}
          key={key}
          globalGames={games && games[key]}
          getGames={getGames}
        />
      ))}
    </>
  );
}
