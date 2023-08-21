import React, { useContext, useEffect, useMemo, useState } from "react";
import Animated from "../Animated";
import { Context } from "../layout";
import { FaTshirt } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { categories } from "../Slider";
import { market } from "./Odds";
import { BiChevronLeftCircle, BiInfoCircle } from "react-icons/bi";

export default function Stats() {
  const { game, setGame, specials } = useContext(Context);
  const [mainActive, setMainActive] = useState(0);
  const [active, setActive] = useState(0);
  const [head, setHead] = useState(false);

  let { arr, ga } = useMemo(() => {
    if (active < 2) {
      return {
        arr: [
          {
            text: `${active ? "1st Half" : ""} WDL`,
            infoText: "",
            type: "single",
            v: "WDL",
            period: active ? true : false,
            tags: ["1", "X", "2"],
          },
          {
            text: `${active ? "1st Half" : ""} Total Over | Under`,
            infoText: "",
            type: "multiple",
            v: "OU",
            period: active ? true : false,
            tags: ["", "over", "under"],
          },
          {
            text: (
              <>
                {game?.home} Over | Under {active ? "(1st Half)" : ""}
              </>
            ),
            infoText: "",
            type: "multiple",
            v: "HOU",
            tags: ["", "over", "under"],
          },
          {
            text: (
              <>
                {game?.away} Over | Under {active ? "(1st Half)" : ""}
              </>
            ),
            infoText: "",
            type: "multiple",
            v: "AOU",
            tags: ["", "over", "under"],
          },
        ],
        ga: game,
      };
    }
    if (active === 2) {
      return {
        arr: [
          {
            text: `Total Corners`,
            infoText: "",
            type: "multiple",
            v: "OU",
            period: false,
            tags: ["", "over", "under"],
          },
          {
            text: `Total Corners (1st Half)`,
            infoText: "",
            type: "multiple",
            v: "OU",
            period: true,
            tags: ["", "over", "under"],
          },
        ],
        ga: specials.current.filter(
          (g) =>
            g?.parent_id === game?.event_id && g?.resulting_unit === "Corners"
        )[0],
      };
    }
  }, [active, game]);

  useEffect(() => {
    if (game) {
      const cont = document.getElementById("scontainer");
      // setTop(`${document.getElementById("header").clientHeight - 4}px`);
      cont.scrollTop > 45 ? setHead(true) : setHead(false);

      cont.addEventListener("scroll", (e) => {
        e.target.scrollTop > 45 ? setHead(true) : setHead(false);
      });
    }
  }, [game]);

  return (
    <AnimatePresence>
      {game && (
        <>
          <motion.div
            id="scontainer"
            initial={{ x: "100%", opacity: 1 }}
            animate={{ x: "0%", opacity: 1, transition: { duration: 0.3 } }}
            exit={{ x: "0%", opacity: 0, transition: { duration: 0.15 } }}
            className="fixed bg-black overflow-y-scroll overflow-x-hidden justify-start items-center flex-col inset-0 flex z-[23] w-full "
          >
            <header className="top-0 bg-black fx w-full">
              <div className="w-[95%] relative rounded-xl mt-9 mb-1  fx ">
                {[0, 1].map((key) => (
                  <span
                    key={key}
                    className={`w-2/5 px-4 fx gap-2 ${key && "order-3"}`}
                  >
                    <FaTshirt
                      className={`text-base mt-0.5 ${
                        key ? "text-red-600" : "text-blue-700"
                      }`}
                    />
                    <motion.span
                      layout
                      className=" pt-5 duration-200 pb-4 relative text-sm text-center"
                    >
                      {key ? game?.away : game?.home}
                    </motion.span>
                  </span>
                ))}
                <span className="flex-1 text-c2 text-sm fx order-2 gap-5">
                  {game?.starts.split("T")[1].split(":").slice(0, -1).join(":")}
                </span>
                <button
                  onClick={() => setGame(null)}
                  className="flex text-xs text-white/60 bottom-[105%] items-center gap-0.5 absolute"
                >
                  <BiChevronLeftCircle className="mt-px" /> back
                </button>
              </div>
            </header>
            <div className="flex w-[90%] gap-1 text-xs border-b-2 border-b-c4 justify-center pt-2">
              {["Markets", "H2H", "line-ups"].map((v, key) => (
                <button
                  className={`aft after:bottom-0 after:duration-200 after:rounded-xl after:from-c1 after:to-c2 after:bg-gradient-to-r relative fx flex-1 pb-2.5 ${
                    key === mainActive
                      ? "after:w-4 after:h-1 text-c2"
                      : "after:w-0 after:h-0 text-white"
                  }`}
                  key={key}
                  onClick={() => setMainActive(key)}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="w-full bg-black top-[70px] shadow-lg shadow-black/50 sticky z-10">
              <div className=" flex text-xs items-center no-bars overflow-x-scroll overflow-y-hidden whitespace-nowrap w-full gap-3 pl-8 pt-2 mb-2">
                {["Favourites", "1st half", "Corners"].map((v, key) => (
                  <button
                    className={`fx active:scale-75 duration-100 px-5 py-1 relative last:mr-4 rounded-t-xl rounded-bl-xl ${
                      key === active
                        ? "bg-c2/5 text-c2"
                        : "bg-c4/60 text-white/80"
                    }`}
                    onClick={() => setActive(key)}
                    key={key}
                  >
                    {v}
                  </button>
                ))}
                <button
                  className={`fx pl-3.5 pr-4 gap-1 py-1 rounded-t-xl rounded-bl-xl ${
                    active === 3 ? "bg-c2/5 text-c2" : "bg-c4/60 text-white/80"
                  }`}
                >
                  {categories.icons[3]} Specials
                </button>
                <button
                  className={`fx gap-1 pl-3.5 pr-4 py-1 relative mr-4 rounded-t-xl rounded-bl-xl ${
                    active === 4 ? "bg-c2/5 text-c2" : "bg-c4/60 text-white/80"
                  }`}
                >
                  {categories.icons[2]} Rocket odds
                </button>
              </div>
            </div>
            <div className="flex mb-24 flex-col w-full">
              {arr.map((d, key) => (
                <div
                  key={key}
                  className="w-full mt-3 flex-col items-start flex gap-2"
                >
                  <span className="w-full from-c4/60 to-c4/10 bg-gradient-to-r text-xs flex gap-1 items-center px-4 py-1.5">
                    <BiInfoCircle className="text-c2" /> {d.text}
                  </span>
                  {d.type === "single" ? (
                    <div className="flex gap-2 px-4 w-full">
                      {market(ga, d.v, d.period).odds.map((v, key) => (
                        <button
                          className="flex-1 gap-2 relative active:scale-75 duration-100 bg-c4 fx rounded-lg h-11"
                          key={key}
                        >
                          <span className="text-11 fx gap-2 text-c2 bottom-[105%]">
                            {d.tags[key]} |
                          </span>
                          {v.toFixed(2)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <>
                      {market(ga, d.v, d.period).odds.map((odd, key) => (
                        <div
                          key={key}
                          className="flex first-of-type:mt-3 gap-2 px-4 w-full"
                        >
                          {odd.map((v, key1) => (
                            <>
                              {key1 ? (
                                <button
                                  className="flex-[2] relative active:scale-75 duration-100 first:bg-c4/40 bg-c4 fx rounded-lg h-11"
                                  key={key1}
                                >
                                  {key1 ? v.toFixed(2) : v}
                                  {!key && (
                                    <span className="bottom-[103%] text-xs absolute text-c2">
                                      {d.tags[key1]}
                                    </span>
                                  )}
                                </button>
                              ) : (
                                <span
                                  className="first:bg-c4/40 flex-1 bg-c4 fx rounded-lg h-11"
                                  key={key1}
                                >
                                  {key1 ? v.toFixed(2) : v}
                                </span>
                              )}
                            </>
                          ))}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
          <Animated
            id="header"
            state={head}
            init={{ opacity: 0 }}
            show={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="top-0 fixed z-30 bg-black fx w-full"
          >
            <div className="w-[95%] relative rounded-xl mt-9 bg-c4/80 fx ">
              {[0, 1].map((key) => (
                <span
                  key={key}
                  className={`w-2/5 px-4 flex justify-start items-center gap-1.5 mt-px ${
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
                    className="flex-1 pt-3 duration-200 pb-2 whitespace-nowrap text-ellipsis overflow-hidden relative text-xs text-center"
                  >
                    {key ? game?.away : game?.home}
                  </motion.span>
                </span>
              ))}
              <span className="flex-1 text-c2 text-sm fx order-2 gap-5">
                {game?.starts.split("T")[1].split(":").slice(0, -1).join(":")}
              </span>
              <button
                onClick={() => setGame(null)}
                className="flex text-xs text-white/60 bottom-[105%] items-center gap-0.5 absolute"
              >
                <BiChevronLeftCircle className="mt-px" /> back
              </button>
            </div>
          </Animated>
        </>
      )}
    </AnimatePresence>
  );
}
