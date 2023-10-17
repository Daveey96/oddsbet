import React, { useContext, useEffect, useMemo, useState } from "react";
import { FaTshirt } from "react-icons/fa";
import { motion } from "framer-motion";
import { BiChevronLeftCircle } from "react-icons/bi";
import MatchStats from "./MatchStats";
import Markets from "./Markets";
import { Context } from "@/components/layout";
import { BsCaretLeftFill, BsInfoCircleFill, BsX } from "react-icons/bs";
import { Skeleton } from "@/components/services/Loaders";
import { Curtain, Modal } from "@/components/global/Animated";
import { categories } from "@/components/sliders/Slider";

export const Animate = ({ children, className }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ ease: "easeInOut", duration: 0.1 }}
    className={`w-full fx flex-col ${className}`}
  >
    {children}
  </motion.div>
);

export default function Stats() {
  const { game, setGame } = useContext(Context);
  const [active, setActive] = useState(0);
  const [head, setHead] = useState(false);
  const [time, setTime] = useState(null);
  const [info, setInfo] = useState(null);

  const shadow = useMemo(
    () => (active ? "shadow-lg shadow-black/50" : ""),
    [active]
  );

  useEffect(() => {
    if (game) {
      const cont = document.getElementById("scontainer");
      cont.scrollTop > 100 ? setHead(true) : setHead(false);

      cont.addEventListener("scroll", (e) => {
        e.target.scrollTop > 100 ? setHead(true) : setHead(false);
      });
    }
  }, [game]);

  return (
    <>
      {info && (
        <Modal
          state={info}
          setState={() => setInfo(false)}
          className={"fixed bg-black/60 z-40 fx inset-0"}
          iClass={"w-4/5 h-1/2 flex flex-col overflow-hidden bg-c4 rounded-3xl"}
        >
          <header className="pt-3 pb-2 flex relative items-center gap-2 px-4 bg-black/50 text-sm">
            <BsInfoCircleFill className="text-c2" /> {info?.text}
            <button
              onClick={() => setInfo(null)}
              className="text-c2 text-xl right-3 absolute"
            >
              <BsX />
            </button>
          </header>
          <div className="flex-1 px-4 py-3 overflow-y-scroll">{info?.info}</div>
        </Modal>
      )}
      <Curtain
        id={"scontainer"}
        sibling={
          <div className="w-[95%] relative rounded-xl mt-9 dark:bg-c4/80 bg-c3 fx ">
            {[0, 1].map((key) => (
              <span
                key={key}
                className={`w-2/5 px-4 pt-2.5 pb-2 flex justify-start items-center gap-1.5 mt-px ${
                  key && "order-3"
                }`}
              >
                <FaTshirt
                  className={`text-sm ${
                    key ? "text-red-600" : "text-blue-700"
                  }`}
                />
                <motion.span
                  layout
                  className="flex-1 duration-200 whitespace-nowrap text-ellipsis overflow-hidden relative text-xs text-center"
                >
                  {key ? game?.away : game?.home}
                </motion.span>
              </span>
            ))}
            <span className="flex-1 text-green-500 fx order-2 gap-5">
              {"60'"}
            </span>
          </div>
        }
        siblingState={head && game}
        siblingClass={shadow}
        setState={() => setGame(null)}
        className="dark:bg-black scroll-smooth bg-white overflow-y-scroll overflow-x-hidden justify-start items-center z-[24] w-full "
      >
        <header className="top-0 dark:bg-black bg-white fx flex-col w-full">
          <div className="w-[95%] relative rounded-xl mt-9 fx ">
            {[0, 1].map((key) => (
              <span
                key={key}
                className={`w-2/5 px-4 rounded-3xl pt-5 pb-4 fx gap-2 ${
                  key && "order-3"
                }`}
              >
                <FaTshirt
                  className={`text-base mb-0.5 ${
                    key ? "text-red-600" : "text-blue-700"
                  }`}
                />
                <span
                  layout
                  className="duration-200 relative text-sm text-center"
                >
                  {key ? game?.away : game?.home}
                </span>
              </span>
            ))}
            <span className="flex-1 text-c2 relative text-sm fx order-2 gap-5">
              {game?.time}
            </span>
            {game?.rocketOdds && (
              <span className="fx text-10 bottom-[105%] gap-1 text-orange-500 rounded-xl bg-orange-500/10 py-0.5 px-2 absolute">
                {categories.icons[2]} rocket odds
              </span>
            )}
          </div>
          <span className="fx text-11 opacity-30 bottom-[105%] gap-1 mb-2 rounded-xl py-0.5 px-2">
            {game?.league}
          </span>
        </header>
        <div className="flex w-[90%] bg-c3 dark:bg-c4/40 rounded-xl gap-1 text-xs justify-center pt-2">
          {["Markets", "Stats"].map((v, key) => (
            <button
              className={`aft after:bottom-0 after:duration-200 after:rounded-xl after:from-c1 after:to-c2 after:bg-gradient-to-r relative fx flex-1 pb-2.5 ${
                key === active
                  ? "after:w-4 after:h-1 text-c2"
                  : "after:w-0 after:h-0"
              }`}
              key={key}
              onClick={() => setActive(key)}
            >
              {v}
            </button>
          ))}
        </div>
        {!active ? (
          <Markets
            head={head}
            setTime={(t) => setTime(t)}
            key={12}
            game={game}
            setInfo={(i) => setInfo(i)}
          />
        ) : (
          <MatchStats home={game?.home} away={game?.away} />
        )}
      </Curtain>
    </>
  );
}
