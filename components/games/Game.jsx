import Image from "next/image";
import Odds from "./Odds";
import { useContext, useEffect, useState } from "react";
import { Context } from "../layout";
import { categories } from "../Slider";
import { apiController } from "@/controllers";

const Game = ({ game, mkt, isLive, last, margin }) => {
  const { setGame } = useContext(Context);
  const [g, setG] = useState(game);

  useEffect(() => {
    if (isLive) {
      setTimeout(async () => {
        const data = await apiController.getMatch(g.event_id);

        if (data) {
          setG(data);
        }
      }, 20000);
    }
  }, [g]);

  return (
    <div
      className={`flex z-[2] w-full flex-col px-3 pt-3 md:last-of-type:rounded-b-2xl pb-1 ${
        isLive ? "bg-c4/50 text-white" : "dark:bg-c4 bg-white"
      } ${last && "last-of-type:rounded-b-2xl"} ${
        margin ? "last-of-type:pb-9" : "last-of-type:pb-7"
      }`}
    >
      <div className="w-full flex gap-2 text-[11px]">
        <span className="text-c2 ">{g.starts.split("T")[1].slice(0, -3)}</span>
        <span className="w-[62%] overflow-hidden dark:opacity-30  text-ellipsis whitespace-nowrap">
          {g.league_name}
          {g.league_id}
        </span>
      </div>
      <div className="w-full flex justify-between items-center">
        <div className="flex h-9 pr-2 flex-col justify-between w-[42%]">
          {[0, 1].map((key) => (
            <span
              onClick={() =>
                setGame({
                  id: g.event_id,
                  sport: g.sport_id,
                  home: g.home,
                  away: g.away,
                })
              }
              className="flex pl-1 rounded-md active:bg-white/5 duration-200  bg-white/0 gap-1 items-center"
              key={key}
            >
              <span
                className={`dark:-translate-y-0.5 dark:after:hidden dark:shadow-none after:bg-white shadow-md shadow-black after:w-6 after:h-6 fx after:rounded-full aft relative ${
                  key ? "-z-[2]" : "-z-[1]"
                }`}
              >
                <Image
                  width={11}
                  height={10}
                  className="z-10"
                  src={"/badge.svg"}
                  alt=""
                />
              </span>
              <span className="flex flex-1 text-ellipsis whitespace-nowrap overflow-hidden text-[12px] leading-[20px] items-center justify-between">
                {key ? g.away : g.home}
              </span>
              {isLive && (
                <span
                  className={`w-2 ml-1 text-center ${
                    key ? "text-c2" : "text-c2"
                  }`}
                >
                  {key
                    ? g?.periods?.num_0?.meta?.away_score
                    : g?.periods?.num_0?.meta?.home_score}
                </span>
              )}
            </span>
          ))}
        </div>
        <Odds
          game={g}
          key={Math.random()}
          isLive={isLive}
          mkt={mkt}
          className={"w-[58%]"}
        />
      </div>
      <div className="flex mt-0.5 items-center gap-2 ">
        {"45 >"} {categories.icons[2]}
        {categories.icons[0]}
        {categories.icons[3]}
      </div>
    </div>
  );
};

export default Game;
