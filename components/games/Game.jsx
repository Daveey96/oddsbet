import Image from "next/image";
import Odds from "./Odds";
import { useContext, useEffect, useState } from "react";
import { Context } from "../layout";
import { categories } from "../sliders/Slider";
import { mainLeagues } from "@/helpers";

const Game = ({ game, mkt, last, margin, className }) => {
  const { setGame } = useContext(Context);

  return (
    <div className={`flex z-[2] w-full flex-col px-3 pt-3 ${className} `}>
      <div className="w-full flex gap-2 text-[11px]">
        <span className="text-c2 ">
          {game.starts.split("T")[1].slice(0, -3)}
        </span>
        <span
          className={`flex-1 opacity-70 overflow-hidden dark:opacity-30 text-ellipsis whitespace-nowrap`}
        >
          {game.league_name}
        </span>
        {game.rocketOdds && (
          <span className="fx gap-1 text-orange-500 text-9 mr-3">
            <>{categories.icons[2]}</> x{game.rocketOdds}
          </span>
        )}
      </div>
      <div className="w-full flex justify-between items-center">
        <div className="flex h-9 pr-2 flex-col justify-between w-[42%]">
          {[0, 1].map((key) => (
            <span
              onClick={() =>
                setGame({
                  id: game.event_id,
                  sport: game.sport_id,
                  home: game.home,
                  away: game.away,
                  league: game.league_name,
                  rocketOdds: game.rocketOdds,
                  time: game.starts,
                })
              }
              className="flex pl-1 rounded-md active:bg-white/5 duration-200  bg-white/0 gap-1 items-center"
              key={key}
            >
              <span
                className={`dark:-translate-y-0.5 after:bg-white shadow-md shadow-black after:w-6 after:h-6 after:rounded-full aft dark:after:hidden dark:shadow-none fx relative ${
                  key ? "-z-[2]" : "-z-[1]"
                } `}
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
                {key ? game.away : game.home}
              </span>
            </span>
          ))}
        </div>
        <Odds
          game={game}
          key={mkt}
          mkt={mkt}
          className={"w-[58%]"}
          rOdds={game.rocketOdds}
        />
      </div>
      <div className="flex mt-0.5 py-0.5 items-center gap-2 ">
        {mainLeagues.includes(game.league_id) && <>{categories.icons[1]}</>}
        {game.periods.specials && <>{categories.icons[3]}</>}
      </div>
    </div>
  );
};

const Time = ({ v }) => {
  const [time, setTime] = useState(
    Math.round((new Date() - new Date(v * 1000)) / 1000 / 60)
  );

  setInterval(() => {
    setTime(Math.round((new Date() - new Date(v * 1000)) / 1000 / 60));
  }, 30000);

  return (
    <span className="text-c2 relative">
      {time}
      <span className="text-lg absolute -top-1.5 left-full animate-pulse">{`'`}</span>
    </span>
  );
};

export const LiveGame = ({ game, mkt, last, margin, className }) => {
  const { setGame } = useContext(Context);

  return (
    <div className={`flex z-[2] w-full flex-col px-3 pt-3 ${className} `}>
      <div className="w-full flex gap-2 text-[11px]">
        <Time v={game.time.currentPeriodStartTimestamp} />
        <span
          className={`flex-1 overflow-hidden opacity-30  text-ellipsis whitespace-nowrap `}
        >
          {game?.tournament?.name}
        </span>
        {/* {game?.rocketOdds && (
          <span className="fx gap-1 text-orange-500 text-9 mr-3">
            <>{categories.icons[2]}</> x{game.rocketOdds}
          </span>
        )} */}
      </div>
      <div className="w-full flex justify-between items-center">
        <div className="flex h-9 pr-2 flex-col justify-between w-[38%]">
          {[0, 1].map((key) => (
            <span
              onClick={() =>
                setGame({
                  id: game.event_id,
                  sport: game.sport_id,
                  home: game.home,
                  away: game.away,
                  league: game.league_name,
                  rocketOdds: game.rocketOdds,
                  time: game.starts,
                  live: isLive,
                })
              }
              className="flex pl-1 rounded-md active:bg-white/5 duration-200  bg-white/0 gap-1 items-center"
              key={key}
            >
              <span
                className={`dark:-translate-y-0.5 dark:after:hidden dark:shadow-none fx relative `}
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
                {key ? game?.homeTeam?.name : game?.awayTeam?.name}
              </span>
            </span>
          ))}
        </div>
        <div className="flex gap-0.5 bg-c2/5 rounded-lg py-1 px-2 text-c2 text-xs mr-1">
          <span className={`text-c2`}>{game?.homeScore?.current}</span>
          <span className="opacity-30">:</span>
          <span className={`text-c2`}>{game?.awayScore?.current}</span>
        </div>
        <Odds
          game={{
            home: game.homeTeam.name,
            away: game.awayTeam.name,
            periods: game.periods,
          }}
          key={mkt}
          mkt={mkt}
          isLive={true}
          className={"flex-1"}
        />
      </div>
      {/* <div className="flex mt-0.5 py-0.5 items-center gap-2 ">
        {mainLeagues.includes(game.league_id) && <>{categories.icons[1]}</>}
        {game.periods.specials && <>{categories.icons[3]}</>}
      </div> */}
    </div>
  );
};

export default Game;
