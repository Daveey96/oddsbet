import React, { useContext } from "react";
import { Context } from "../layout";
import { BlurredModal } from "../Animated";
import { FaTshirt } from "react-icons/fa";
import { BsArrowLeftShort } from "react-icons/bs";
import footballGames from "@/helpers/json/football";
import { AnimatePresence, motion } from "framer-motion";

export default function Stats() {
  const { gameId, setGameId } = useContext(Context);
  const game = gameId
    ? footballGames.events.filter(({ event_id }) => event_id === gameId)[0]
    : null;

  return (
    <AnimatePresence>
      {gameId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setGameId(null)}
          className="fixed bg-black/90 items-center flex-col inset-0 flex justify-center z-30 w-full "
        >
          <>
            <motion.header
              initial={{ y: "-100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.15 }}
              className="w-[95%] rounded-xl mt-10 mb-1 bg-c4/80 fx overflow-hidden fx"
            >
              {[0, 1].map((key) => (
                <span
                  key={key}
                  className={`w-1/3 px-4 pt-5 pb-4 flex justify-start items-center flex-col gap-2 ${
                    key && "order-3"
                  }`}
                >
                  <FaTshirt
                    className={
                      "text-2xl " + `${key ? "text-red-600" : "text-blue-700"}`
                    }
                  />
                  <span className="w-full text-xs text-center">
                    {key ? game?.away : game?.home}
                  </span>
                </span>
              ))}
              <span className="flex-1 font-bold text-base fx order-2 gap-2">
                <span className="text-blue-700 text-120">69</span> :
                <span className="text-red-600 text-120">54</span>
              </span>
            </motion.header>
            <motion.div
              initial={{ y: "70%" }}
              animate={{ y: "0%" }}
              exit={{ y: "70%" }}
              transition={{ duration: 0.15 }}
              className="flex-1 relative bg-black flex flex-col justify-center rounded-t-[50px] w-full overflow-hidden"
            >
              <div className="bg-black fx w-full gap-8 pt-2 pb- top-0">
                {["Markets", "Stats"].map((v, key) => (
                  <button
                    className="border-b-2 text-c2 px-3 pb-1 border-c2"
                    key={key}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="flex flex-col overflow-y-scroll gap-20 flex-1 w-full">
                {Array(20)
                  .fill("i am a boy")
                  .map((v, key) => (
                    <span key={key}>{v}</span>
                  ))}
              </div>
            </motion.div>
            {/* <button
            onClick={() => setGameId(null)}
            className="-top-1 pl-3 pr-3 pt-4 pb-2 text-xl -left-1 absolute text-red-600 active:scale-90 duration-150 rounded-full bg-black"
          >
            <BsArrowLeftShort />
          </button> */}
          </>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
