import Image from "next/image";
import Odds from "./Odds";
import { useContext, useState } from "react";
import { Context } from "../layout";
import { BiChart, BiReflectHorizontal, BiRocket } from "react-icons/bi";
import { categories } from "../Slider";

const Game = ({ game, mkt, isLive, last }) => {
  const [g, setG] = useState(game);
  const { setGame } = useContext(Context);

  const data = [
    { text: "rocket odds", icon: <BiRocket /> },
    { text: "specials", icon: <BiReflectHorizontal /> },
  ];

  return (
    <div
      className={`flex z-[2] bg-white w-full flex-col px-3 pt-3 last-of-type:pb-12 md:last-of-type:rounded-b-2xl pb-1 ${
        isLive ? "dark:bg-c4/50" : "dark:bg-c4"
      } ${last && "last-of-type:rounded-b-2xl"}`}
    >
      <div className="w-full flex gap-2 text-[11px]">
        <span className="text-c2 ">{g.starts.split("T")[1].slice(0, -3)}</span>
        <span className="w-[62%] overflow-hidden dark:opacity-30  text-ellipsis whitespace-nowrap">
          {g.league_name}
        </span>
      </div>
      <div className="w-full flex justify-between items-center">
        <div className="flex h-9 pr-3 flex-col justify-between w-[42%]">
          {[0, 1].map((key) => (
            <span
              onClick={() => setGame(g)}
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
        <Odds game={g} isLive={isLive} mkt={mkt} className={"w-[58%]"} />
      </div>
      <div className="flex mt-0.5 items-center gap-2 ">
        {">"} {categories.icons[2]}
        {categories.icons[0]}
        {categories.icons[3]}
      </div>
    </div>
  );
};

export default Game;
