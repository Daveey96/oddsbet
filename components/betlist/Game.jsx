import { animate, motion, useMotionValue } from "framer-motion";
import React, { useState } from "react";
import Svg from "../Svg";
import { BiTrashAlt } from "react-icons/bi";

export default function Game({ v, index, deleteGame }) {
  const x = useMotionValue(0);
  const [dragStart, setDragStart] = useState(false);

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

  return (
    <motion.div
      className={`relative h-[70px] w-full flex items-center overflow-hidden`}
      initial={{ maxHeight: "70px" }}
      animate={{ maxHeight: "70px" }}
      exit={{ maxHeight: "0px", transition: { duration: 0.1 } }}
    >
      <motion.div
        drag="x"
        onDragEnd={dragEnded}
        style={{ x }}
        onDragStart={() => setDragStart(true)}
        className={`px-5 z-[1] relative aft after:left-0 after:h-2/5 after:w-1 after:rounded-r-3xl after:bg-white/30 dark:bg-black bg-c3 w-full justify-between items-center h-full flex `}
      >
        <span className="flex w-3/4 flex-col gap-1">
          <span className="flex w-full items-center text-c2">
            {/* {v.isLive && (
              <span className="px-3 mr-1 bg-green-500/10 text-green-500 pt-px text-sm pb-0.5 rounded-r-3xl">
                Live
              </span>
            )} */}
            <Svg id={v.sport_id} className="mr-1 text-c1" />
            <span className="flex items-center capitalize gap-1">
              {v.outcome}
            </span>
          </span>
          <span className="w-full ml-2 whitespace-nowrap text-ellipsis overflow-hidden">
            {v.home} <span className="text-c2">vs</span> {v.away}
          </span>
        </span>
        <span className="mr-2 fx">{v.odd}</span>
      </motion.div>
      <div
        className={`absolute text-white flex inset-x-0 h-[97%] w-full justify-between ${
          dragStart ? "bg-red-600" : "dark:bg-black bg-c3"
        }`}
      >
        {dragStart &&
          [0, 1].map((key) => (
            <span key={key} className="fx w-1/4 text-2xl">
              <BiTrashAlt />
            </span>
          ))}
      </div>
    </motion.div>
  );
}
