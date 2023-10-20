import { animate, motion, useMotionValue } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import Svg from "../global/Svg";
import { BiTrashAlt } from "react-icons/bi";
import { Context } from "../layout";
import { weekDays } from "@/helpers";

export default function Game({ v, index, deleteGame, setToggle }) {
  const x = useMotionValue(0);
  const [dragStart, setDragStart] = useState(false);
  const { setGame } = useContext(Context);

  const dragEnded = (e, v) => {
    if (Math.abs(v.velocity.x) > 200) {
      animate(x, Math.sign(v.velocity.x) * e.view.outerWidth * 2, {
        duration: 0.5,
      });
      deleteGame(index);
    } else {
      setDragStart(false);
      animate(x, 0, { duration: 0.5 });
    }
  };

  let date = new Date(v.time);

  const clicked = () => {
    setGame({
      id: v.id,
      sport: v.sport_id,
      home: v.home,
      away: v.away,
      league: v.league_name,
      rocketOdds: v.rOdds,
      time: v.time,
      live: false,
    });
    setToggle(false);
  };

  const addZero = (v) => (v.toString().length === 1 ? `0${v}` : v);

  return (
    <>
      <span className="w-[100%] h-[2px] bg-c4/50 rounded-2xl fx mx-auto"></span>
      <motion.div
        onClick={clicked}
        className={`relative w-full mx-auto flex items-center overflow-hidden`}
        initial={{ maxHeight: "100px" }}
        animate={{ maxHeight: "100px" }}
        exit={{ maxHeight: "0px", transition: { duration: 0.1 } }}
      >
        <motion.div
          drag="x"
          onDragEnd={dragEnded}
          style={{ x }}
          onDragStart={() => setDragStart(true)}
          className={`z-[1] dark:bg-black bg-c4 w-full justify-center items-center h-full flex `}
        >
          <div className="w-full overflow-hidden mb-0.5 relative pr-4 shadow shadow-black/50 dark:shadow-none flex">
            <span className="fx text-white/40 py-3.5 bg-black/20 dark:bg-c4/30 px-2.5 flex-col">
              {date.getDay() === new Date().getDay()
                ? "Today"
                : weekDays[date.getDay()].slice(0, 3)}
              <span className="text-white/80">
                {addZero(date.getHours())}:{addZero(date.getMinutes())}
              </span>
            </span>
            <span className="flex px-3 py-3 relative overflow-hidden h-full  flex-1 flex-col gap-1">
              <span className="flex items-center gap-1 text-base capitalize">
                <Svg id={v.sport_id} className={" text-c1 text-lg"} />
                {v.outcome}
              </span>
              <span className=" text-c2">{v.outcomeName}</span>
              <span className="flex-1 opacity-60 whitespace-nowrap text-ellipsis overflow-hidden">
                {v.home} <span className="text-white/50">vs</span> {v.away}
              </span>
            </span>
            <span
              className={`gap-2 fx text-base ${
                v.rOdds ? "text-orange-600 font-bold" : "text-white/80"
              }`}
            >
              {v.odd}
            </span>
          </div>
        </motion.div>
        <div
          className={`absolute text-white flex inset-x-0 h-[96%] w-full justify-between ${
            dragStart ? "bg-red-600" : "dark:bg-black bg-c4"
          }`}
        >
          {dragStart &&
            [0, 1].map((key) => (
              <span key={key} className="fx w-[15%] text-2xl">
                <BiTrashAlt />
              </span>
            ))}
        </div>
      </motion.div>
    </>
  );
}
