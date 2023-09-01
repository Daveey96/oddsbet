import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Retry from "../services/Retry";
import List from "./List";
import Game from "./Game";
import { BiXCircle } from "react-icons/bi";
import { condition } from "@/helpers";
import { Context } from "../layout";

export default function GameList({ gGames, mkt, last }) {
  const { games, title } = gGames;
  const { getGlobalGames } = useContext(Context);
  const len = condition(title.split(" ")[0], ["Today", "*"], [10, 6]);

  // const changeSport = (id) => {
  //   // setMkt(sports[id - 1].markets[0].v);
  //   getGlobalGames(id);
  // };

  const tags = (v) => {
    return condition(
      v,
      ["WDL", "WL", "DB", "*"],
      [
        ["1", "X", "2"],
        ["W1", "W2"],
        ["1X", "12", "2X"],
        ["points", "over", "under"],
      ]
    );
  };

  return (
    <>
      <header
        className={`flex px-3.5 pt-2 justify-between dark:bg-c4/70 bg-c3 z-[3] items-center w-full pb-1 `}
      >
        <span className="flex gap-1 dark:text-white/80 text-black text-sm">
          {title.split(" ")[0]}
          <span className="dark:text-white/70 text-c2">
            {title.split(" ")[1]}
          </span>
        </span>
        <span className="w-[60%] text-11 text-black dark:text-c2 fx">
          {tags(mkt).map((v, key) => (
            <span key={key} className="flex-1 text-center">
              {v}
            </span>
          ))}
        </span>
      </header>
      <Retry
        state={games}
        loading={
          <div
            className={`flex aft after:bg-c2 after:blur-2xl after:-z-[2] after:rounded-full after:h-24 after:w-24 bef before:blur-2xl before:left-5 before:bg-c1 before:bottom-5 before:z-0 before:rounded-full before:h-28 before:w-28 flex-col relative items-center w-full gap-px `}
          >
            {Array(4)
              .fill("")
              .map((i, key) => (
                <div
                  key={key}
                  className={`flex z-[1] rounded-inh overflow-hidden w-full flex-col px-3 pt-2.5 last-of-type:pb-12 md:last-of-type:rounded-b-2xl pb-2 dark:bg-c4 bg-white ${
                    last && "last-of-type:rounded-b-2xl"
                  }`}
                >
                  <div className="w-[46%] rounded-md bg-slate-600/25 leading-[14px] mb-1 fade text-[12px]"></div>
                  <div className="w-full flex overflow-hidden justify-between items-center">
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
                          <span className="fade rounded-md flex-1 bg-slate-600/25 text-[12px] leading-[15px] mr-1"></span>
                        </span>
                      ))}
                    </div>
                    <div className="w-[58%] flex gap-2">
                      {Array(3)
                        .fill("")
                        .map((i, key2) => (
                          <span
                            key={key2}
                            className="bg-slate-600/25 rounded-md fade flex-1 h-10"
                          ></span>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        }
        error={
          <div className="relative w-full aft after:bg-c2 after:left-[40%] after:-top-4 after:blur-2xl after:-z-[2] after:rounded-full after:h-24 after:w-24 bef before:blur-2xl before:left-5 before:bg-c1 before:bottom-10 before:z-0 before:rounded-full before:h-28 before:w-28">
            <div className="flex opacity-0 flex-col relative items-center w-full gap-px">
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
            <div
              className={`w-full h-full gap-2 fx md:rounded-b-2xl absolute inset-0 z-20 fx flex-col ${
                last && "rounded-b-2xl"
              } dark:bg-c4`}
            >
              <BiXCircle className="text-3xl" />
              Something went wrong
              <button
                className="text-c2"
                onClick={() => getGlobalGames(sportId)}
              >
                refresh
              </button>
            </div>
          </div>
        }
      >
        {typeof games === "object" && games && (
          <div
            className={`flex flex-col relative aft after:bg-c2 after:blur-2xl after:-z-[2] after:rounded-full after:h-24 after:w-24 bef before:blur-2xl before:left-5 before:bg-c1 before:bottom-10 before:z-0 before:rounded-full before:h-28 before:w-28 items-center w-full gap-px dark:bg-transparent`}
          >
            {games &&
              games
                .slice(0, len)
                .map((game, key) => (
                  <Game
                    key={key}
                    isLive={false}
                    game={game}
                    mkt={mkt}
                    last={last}
                    margin={games && games.length > len}
                  />
                ))}
            {games && games.length > len && (
              <button className="absolute z-20 left-1/2 -translate-x-1/2 active:scale-90 duration-200 bottom-0 dark:bg-black/25 text-[12px] pt-1.5 pb-1 rounded-t-2xl px-5 ">
                view more <span className="text-c2">({games.length - 5})</span>
              </button>
            )}
          </div>
        )}
      </Retry>
    </>
  );
}
