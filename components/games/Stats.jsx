import React, { useContext, useEffect, useState } from "react";
import { Context } from "../layout";
import { FaTshirt } from "react-icons/fa";
import footballGames from "@/helpers/json/football";
import { AnimatePresence, motion } from "framer-motion";
import { categories } from "../Slider";

export default function Stats() {
  const { gameId, setGameId } = useContext(Context);
  const [active, setActive] = useState(0);
  const game = gameId
    ? footballGames.events.filter(({ event_id }) => event_id === gameId)[0]
    : null;

  // useEffect(() => {
  //   const scrollElem = document.getElementById("statScroll");
  //   scrollElem.onscroll("scroll", (e) => {
  //     console.log(e);
  //   });
  // }, []);

  return (
    <AnimatePresence>
      {gameId && (
        <motion.div
          initial={{ x: "100%", opacity: 1 }}
          animate={{ x: "0%", opacity: 1, transition: { duration: 0.3 } }}
          exit={{ x: "0%", opacity: 0, transition: { duration: 0.15 } }}
          className="fixed bg-black/90 items-center flex-col inset-0 flex justify-center z-[23] w-full "
        >
          <header
            onClick={() => setGameId(null)}
            className="w-[95%] relative rounded-xl mt-10 mb-1 bg-c4/80 fx "
          >
            {[0, 1].map((key) => (
              <motion.span
                key={key}
                layout
                className={`w-1/3 px-4 pt-5 pb-4 flex justify-start items-center gap-1 ${
                  key && "order-3"
                }`}
              >
                <FaTshirt
                  className={`text-xl ${
                    key ? "text-red-600" : "text-blue-700"
                  }`}
                />
                <span className="w-full text-xs text-center">
                  {key ? game?.away : game?.home}
                </span>
              </motion.span>
            ))}
            <span className="flex-1 font-bold text-base fx order-2 gap-2">
              <span className="text-blue-700 ">69</span> :
              <span className="text-red-600 ">54</span>
            </span>
            <span className="flex bottom-[110%] items-center gap-2 absolute">
              {categories.icons[0]}
            </span>
          </header>
          <div className=" flex w-full justify-evenly pt-2">
            {["Markets", "Stats"].map((v, key) => (
              <button
                className={` relative fx pb-3 ${
                  key === active
                    ? "aft after:bottom-0 text-c2 after:rounded-t-xl after:h-1 after:from-c1 after:to-c2 after:bg-gradient-to-r after:w-1/2"
                    : ""
                }`}
                key={key}
              >
                {v}
              </button>
            ))}
          </div>
          <motion.div
            layout
            id="statScroll"
            className="flex flex-col no-bars rounded-t-[60px] bg-c4/60 overflow-y-scroll gap-4 flex-1 w-full"
          >
            <span className="w-full flex-col items-center flex gap-2">
              <span className="w-full bg-black/40 fx py-1">WDL</span>
              <div className="w-full px-4 flex gap-2">
                {["1.56", "3.45", "4.56"].map((v, key) => (
                  <span
                    className="flex-1 bg-black fx rounded-lg h-11"
                    key={key}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </span>
            <span className="w-full flex-col items-center flex gap-2">
              <span className="w-full bg-black/40 fx py-1">WDL</span>
              <div className="w-full px-4 flex gap-2">
                {["1.56", "3.45", "4.56"].map((v, key) => (
                  <span
                    className="flex-1 bg-black fx rounded-lg h-11"
                    key={key}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </span>
            <span className="w-full flex-col items-center flex gap-2">
              <span className="w-full bg-black/40 fx py-1">WDL</span>
              <div className="w-full px-4 flex gap-2">
                {["1.56", "3.45", "4.56"].map((v, key) => (
                  <span
                    className="flex-1 bg-black fx rounded-lg h-11"
                    key={key}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
