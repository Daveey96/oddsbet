import { animate, motion, useMotionValue } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import Svg from "../Svg";
import { BiChart, BiTrash, BiTrashAlt } from "react-icons/bi";
import { Context } from "../layout";

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

  const clicked = (key) => {
    if (key) {
      setDragStart(true);
      animate(x, window.innerWidth * -1.5, {
        duration: 0.25,
      });
      setTimeout(() => deleteGame(index), 95);
    } else {
      setGame({
        id: v.id,
        sport: v.sport_id,
        home: v.home,
        away: v.away,
        live: false,
      });
      setToggle(false);
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
        className={`px-5 z-[1] relative aft after:left-0 after:h-2/5 after:w-1 after:rounded-r-3xl after:bg-white/30 dark:bg-black bg-c4 w-full justify-between items-center h-full flex `}
      >
        <span className="flex w-3/4 flex-col gap-1">
          <span className="flex w-full items-center text-c2">
            <Svg id={v.sport_id} className="mr-1 text-c1" />
            <span className="flex items-center capitalize gap-1">
              {v.text || v.outcome}
            </span>
            <span className="text-white ml-2">@{v.odd}</span>
          </span>
          <span className="w-full ml-2 whitespace-nowrap text-ellipsis overflow-hidden">
            {v.home} <span className="text-c2">vs</span> {v.away}
          </span>
        </span>
        <span className=" gap-2 fx">
          {["text-c2 bg-c2/5", "text-red-500 bg-red-500/5"].map(
            (className, key) => (
              <button
                className={`w-6 h-6 active:scale-75 duration-150 rounded-md fx text-sm ${className}`}
                key={key}
                onClick={() => clicked(key)}
              >
                {!key ? <BiChart /> : <BiTrash />}
              </button>
            )
          )}
        </span>
      </motion.div>
      <div
        className={`absolute text-white flex inset-x-0 h-[97%] w-full justify-between ${
          dragStart ? "bg-red-600" : "dark:bg-black bg-c4"
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
