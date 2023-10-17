import Image from "next/image";
import Odds from "./Odds";
import { useContext, useEffect, useState } from "react";
import { Context } from "../layout";
import { categories } from "../sliders/Slider";
import { apiController } from "@/controllers";
import { mainLeagues } from "@/helpers";
import { BsFire } from "react-icons/bs";
import { FaFire } from "react-icons/fa";

const Game = ({ game, mkt, isLive, last, margin, className }) => {
  const { setGame } = useContext(Context);
  const [g, setG] = useState(game);

  useEffect(() => {
    if (isLive) {
      setTimeout(async () => {
        // const data = await apiController.getMatch(g.event_id);
        // if (data) setG(data);
      }, 20000);
    }
  }, [g]);

  if (g.event_id === 1580133770) {
    console.log(g.periods.specials);
  }

  return (
    <div className={`flex z-[2] w-full flex-col px-3 pt-3 ${className} `}>
      <div className="w-full flex gap-2 text-[11px]">
        <span className="text-c2 ">
          {isLive
            ? `${new Date(g.last).getMinutes()}'`
            : g.starts.split("T")[1].slice(0, -3)}
        </span>
        <span
          className={`flex-1 overflow-hidden dark:opacity-30  text-ellipsis whitespace-nowrap ${
            isLive ? "opacity-30" : "opacity-70"
          }`}
        >
          {g.league_name}
          {g.event_id}
        </span>
        {g.rocketOdds && (
          <span className="fx gap-1 text-orange-500 text-9 mr-3">
            <>{categories.icons[2]}</> x{g.rocketOdds}
          </span>
        )}
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
                  league: g.league_name,
                  rocketOdds: g.rocketOdds,
                  time: g.starts,
                  live: isLive,
                })
              }
              className="flex pl-1 rounded-md active:bg-white/5 duration-200  bg-white/0 gap-1 items-center"
              key={key}
            >
              <span
                className={`dark:-translate-y-0.5 dark:after:hidden dark:shadow-none fx relative ${
                  key ? "-z-[2]" : "-z-[1]"
                } ${
                  !isLive
                    ? "after:bg-white shadow-md shadow-black after:w-6 after:h-6 after:rounded-full aft"
                    : ""
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
              <span className="flex-1 text-ellipsis whitespace-nowrap overflow-hidden text-[12px] leading-[20px]">
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
          key={mkt}
          isLive={isLive}
          mkt={mkt}
          className={"w-[58%]"}
          rOdds={g.rocketOdds}
        />
      </div>
      <div className="flex mt-0.5 py-0.5 items-center gap-2 ">
        {mainLeagues.includes(g.league_id) && <>{categories.icons[1]}</>}
        {g.periods.specials && <>{categories.icons[3]}</>}
      </div>
    </div>
  );
};

export default Game;
