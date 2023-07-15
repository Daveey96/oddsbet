import React, { useContext } from "react";
import { Context } from "../layout";
import { BlurredModal } from "../Animated";
import footballGames from "@/helpers/football";
import { FaTshirt } from "react-icons/fa";
import { BiX } from "react-icons/bi";
import { BsArrowLeftShort } from "react-icons/bs";

export default function GameAnalysis() {
  const { gameId, setGameId } = useContext(Context);
  const game = gameId
    ? footballGames.events.filter(({ event_id }) => event_id === gameId)[0]
    : null;

  return (
    <BlurredModal
      state={gameId !== null}
      iClass={
        "w-[97%] bg-black relative flex flex-col rounded-[40px] h-[92vh] mb-3"
      }
      className="fixed flex backdrop-blur-xl items-end justify-center inset-0 z-30 w-full "
    >
      <>
        <header className="w-full rounded-t-inh overflow-hidden fx flex-col">
          <div className="bg-c4 fx w-full">
            {[0, 1].map((key) => (
              <span
                key={key}
                className={`w-1/3 px-4 pt-7 pb-5 flex justify-start items-center flex-col gap-2 ${
                  key && "order-3"
                }`}
              >
                <FaTshirt
                  className={
                    "text-3xl " + `${key ? "text-red-600" : "text-blue-700"}`
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
          </div>
          <ul className="fx gap-3">
            {["markets", "stats"].map((v, key) => (
              <li
                key={key}
                className="px-4 bg-c4 rounded-b-xl rounded-t-md py-0.5"
              >
                {v}
              </li>
            ))}
          </ul>
        </header>
        <div className="flex-1 w-full overflow-hidden">
          <div className="flex flex-col overflow-y-scroll gap-20 h-full w-full">
            {Array(20)
              .fill(<span>i am a boy</span>)
              .map((v) => v)}
          </div>
        </div>
        <button
          onClick={() => setGameId(null)}
          className="-top-1 pl-3 pr-3 pt-4 pb-2 text-xl -left-1 absolute text-red-600 active:scale-90 duration-150 rounded-full bg-black"
        >
          <BsArrowLeftShort />
        </button>
      </>
    </BlurredModal>
  );
}
