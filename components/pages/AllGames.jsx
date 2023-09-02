import { AnimatePresence, motion } from "framer-motion";
import React, { useContext } from "react";
import {
  BiChevronDown,
  BiDownArrow,
  BiDownArrowAlt,
  BiLeftArrow,
  BiSearchAlt,
  BiX,
  BiXCircle,
} from "react-icons/bi";
import { Context } from "../layout";
import Animated from "../Animated";
import { sports } from "../games";
import Svg from "../Svg";
import { FaChevronDown } from "react-icons/fa";
import { BsArrowDown, BsCaretDownFill, BsCaretLeftFill } from "react-icons/bs";
import Game from "../betlist/Game";

function AllGames() {
  const { open, setOpen, globalGames } = useContext(Context);

  console.log(globalGames);
  return (
    <Animated
      state={open}
      initial={{ y: "100%", borderRadius: "70px 70px 0 0" }}
      animate={{ y: "0%", borderRadius: "0px 0px 0 0" }}
      exit={{ y: "100%", borderRadius: "70px 70px 0 0" }}
      transition={{ duration: 0.3 }}
      className="fixed dark:bg-c4 pt-7 bg-white flex-col inset-0 flex z-[23] w-full "
    >
      <button
        onClick={() => setOpen(null)}
        className="text-red-600 absolute left-4 top-14 text-3xl"
      >
        <BsCaretLeftFill />
      </button>
      <header className="w-full fx flex-col">
        <h3 className="font-bold text-base mb-3">Today</h3>
        <div className="flex gap-2">
          {sports.map((v, key) => (
            <span
              key={key}
              className="flex fx border-2 gap-0.5 rounded-xl border-c2 flex-col px-2 py-1.5"
            >
              <Svg id={v.id} size={17} /> <span>{v.item.slice(0, 6)}</span>
            </span>
          ))}
        </div>
        <div className="flex mt-2 gap-3">
          <div className="fx bg-c3 gap-0.5 px-3 rounded-2xl">
            <BiSearchAlt className="translate-y-px" />
            <input type="text" className="py-1 w-14" placeholder="Search" />
          </div>
          <div className="rounded-lg bg-c3/40 pl-4 pr-2.5 fx gap-0.5">
            start time <BsCaretDownFill className=" text-c2 text-11" />
          </div>
          <div className="rounded-lg bg-c3 px-4 fx">all</div>
          <div className="rounded-lg bg-c3 px-4 fx">all</div>
        </div>
      </header>
      <div className="flex-1 w-full overflow-y-scroll overflow-x-hidden">
        {/* {globalGames.current[1].slice(0, 9).map((game, key) => (
          <Game key={key} game={game} mkt={"WDL"} last={false} margin={false} />
        ))} */}
      </div>
    </Animated>
  );
}
//   <motion.div
//     id="ontainer"
//     initial={{ x: "100%", opacity: 1 }}
//     animate={{ x: "0%", opacity: 1, transition: { duration: 0.3 } }}
//     exit={{ x: "0%", opacity: 0, transition: { duration: 0.15 } }}
//   ></motion.div>
// </AnimatePresence>;

export default AllGames;
