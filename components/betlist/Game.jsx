import { animate, motion, useMotionValue } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import Svg from "../global/Svg";
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
      className={`relative w-[96%] mx-auto rounded-xl my-2 flex items-center overflow-hidden`}
      initial={{ maxHeight: "70px" }}
      animate={{ maxHeight: "70px" }}
      exit={{ maxHeight: "0px", transition: { duration: 0.1 } }}
    >
      <motion.div
        drag="x"
        onDragEnd={dragEnded}
        style={{ x }}
        onDragStart={() => setDragStart(true)}
        className={`z-[1] dark:bg-black rounded-xl bg-c4 w-full justify-center items-center h-full flex `}
      >
        <div className="w-full overflow-hidden relative px-4 rounded-xl bg-c4/40 py-3.5 gap-3 flex items-center justify-between">
          <span className="fx text-white/40 flex-col">
            Today <span>{v.time}</span>
          </span>
          <span className="flex flex-1 flex-col gap-1">
            <span className="w-full flex">
              <span className="flex-1 whitespace-nowrap text-ellipsis overflow-hidden">
                {v.home} <span className="text-c2">vs</span> {v.away}
              </span>
            </span>
            <span className="flex w-full items-center gap-1 text-c2">
              <span className="text-white/30">Pick: </span>
              <span className="flex items-center capitalize gap-1">
                {v.text || v.outcome}
              </span>
            </span>
          </span>
          <span className=" gap-2 fx text-c2 text-sm">{v.odd}</span>
          <Svg
            size={50}
            className={"absolute opacity-5 left-2 -z-10 -translate-x-1/2"}
          />
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
  );
}
