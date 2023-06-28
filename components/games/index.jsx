import React, { useContext, useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { BiBasketball, BiFootball, BiTennisBall } from "react-icons/bi";
import { SkeletonLoad } from "../services/Loaders";
import Image from "next/image";
import axios from "axios";
import List from "./List";
import Odds from "./Odds";
// import { getDate } from "@/helpers";
import { Context } from "../layout";

const Game = ({ game, mkt }) => {
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
      className={`flex dark:bg-c4 bg-white w-full flex-col px-4 pt-3 gap-1 last-of-type:pb-12 pb-2`}
    >
      <SkeletonLoad
        state={g}
        iClass="scale-y-75 origin-bottom"
        className="w-[46%] flex gap-2 text-[12px]"
        style={{ width: "100%" }}
      >
        <span className="text-c2 ">
          {g.minute && g.minute + "' " + g.seconds + "'"}
        </span>
        <span className="w-[28%] overflow-hidden opacity-30 text-ellipsis whitespace-nowrap">
          {g.title}
        </span>
      </SkeletonLoad>
      <div className="w-full flex justify-between items-center">
        <div onClick={() => setGameId(g.id)} className="flex flex-col w-[42%]">
          {[0, 1].map((key) => (
            <span
              className={`flex pr-1 gap-1 items-center ${
                key === 1 && "order-3"
              }`}
              key={key}
            >
              <Image
                width={13}
                height={10}
                src={"/badge.svg"}
                className={"mb-"}
                alt=""
              />
              <SkeletonLoad
                state={g}
                iClass="scale-y-90"
                className="flex text-[12px] bg--400 overflow-hidden flex-1 items-center justify-between mr-1"
              >
                <span
                  className={
                    "flex-1 mr-4 text-ellipsis whitespace-nowrap overflow-hidden mb-0.5"
                  }
                >
                  {key ? g.team2 : g.team1}
                </span>
                {g.minute && (
                  <span className="mb-0.5 opacity-40">
                    {key ? g.score2 : g.score1}
                  </span>
                )}
              </SkeletonLoad>
            </span>
          ))}
        </div>
        <Odds game={g} mkt={mkt} className={"w-[58%]"} />
      </div>
    </div>
  );
};

export default function GameList({ title, className, games }) {
  const [mkt, setMkt] = useState("1X2");
  const { scrollY } = useScroll();
  const header = useRef(null);
  const pos = useRef(null);
  let mgames = games ? games.slice(4, 9) : Array(5).fill(false);
  // let mgames = Array(5).fill(false);

  let listOne = [
    {
      item: (
        <>
          <BiFootball className="mt-0.5" /> soccer
        </>
      ),
      v: "soccer",
    },
    {
      item: (
        <>
          <BiFootball className="mt-0.5" /> v soccer
        </>
      ),
      v: "vsoccer",
    },
    {
      item: (
        <>
          <BiBasketball className="mt-0.5" /> basketball
        </>
      ),
      v: "basketball",
    },
    {
      item: (
        <>
          <BiTennisBall className="mt-0.5" /> tennis
        </>
      ),
      v: "tennis",
    },
  ];

  let listTwo = [
    { item: "1X2" },
    { item: "Double Chance", v: "DB" },
    { item: "Over/Under", v: "OU" },
    // {item: "GG/NG", v: ""},
    { item: "Home O/U", v: "HOU" },
    { item: "Away O/U", v: "AOU" },
  ];

  useMotionValueEvent(scrollY, "change", (latest) => {
    latest > pos.current
      ? header.current.classList.add("isSticky")
      : header.current.classList.remove("isSticky");
  });

  useEffect(() => {
    pos.current = header.current.offsetTop;
  }, []);

  return (
    <>
      <header
        ref={header}
        className={`flex mb-px z-20 sticky w-full -top-[1px] flex-col dark:bg-c4 bg-white pb-2 pt-6`}
      >
        <span className=" text-lg gap-3 flex items-center pl-5">
          <span className="">{title}</span>{" "}
          <span className="opacity-50">|</span>
          <List
            iClass="border-[1px] pt-0.5 pb-0.5 mt-0.5 rounded-lg text-[13px] gap-1 pr-3 pl-2"
            activeClass={`text-c2 border-c2/60`}
            inActiveClass={"border-white/20 "}
            v={listOne}
          />
        </span>
        <List
          className={"mt-2 mb-1 py-1 px-3"}
          iClass="px-3.5 py-1 bg-gray-700/5 active:opacity-10 opacity-100 rounded-lg shadow-[0px_2px_2px_1px] shadow-black/20 duration-200"
          activeClass={"text-c2"}
          inActiveClass={"text-white/40"}
          v={listTwo}
          onClick={(v) => setMkt(v)}
        />
      </header>
      <div
        className={`flex flex-col mb-2 relative items-center w-full gap-[1px] ${className}`}
      >
        {mgames.map((game, key) => (
          <Game key={key} game={game} mkt={mkt} />
        ))}
        {title === "Live" && (
          <motion.button
            whileTap={{ opacity: 0.3 }}
            className="absolute bottom-0 bg-c2/5 text-[12px] pt-0.5 pb-1 rounded-t-xl px-3.5 text-c2"
          >
            view more
          </motion.button>
        )}
      </div>
    </>
  );
}
