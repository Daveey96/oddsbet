import React, { useContext, useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { Context } from "../layout";
import { sports } from "../games";
import Svg from "../Svg";
import {
  BsCaretDownFill,
  BsCaretLeftFill,
  BsCaretRightFill,
  BsWifiOff,
} from "react-icons/bs";
import Game from "../games/Game";
import Retry from "../services/Retry";
import Image from "next/image";
import { Curtain } from "../Animated";
import { arrange } from "@/helpers";

function AllGames() {
  const { open, setOpen, globalGames } = useContext(Context);
  const [activeSport, setActiveSport] = useState(open?.sport);
  const [games, setGames] = useState(null);

  const getGames = () => {
    if (open?.date) {
      setGames(
        globalGames.current[activeSport].filter(
          (v) => v.starts.split("T")[0] === open.date
        )
      );
    } else {
    }
  };

  useEffect(() => {
    setTimeout(() => games === null && getGames(), 300);
  }, []);

  return (
    <Curtain
      setState={() => setOpen(null)}
      className="dark:bg-c4 pb-12 bg-white z-[23] overflow-y-scroll overflow-x-hidden"
    >
      <header className="fx gap-5 mb-3 sticky w-full pt-7 dark:bg-c4 bg-white top-0 z-10">
        {[0, 1].map((key) => (
          <button
            key={key}
            className={`text-11 fx rounded-full w-4 h-4 dark:border-none dark:bg-black/20 border-black/40 border-2 ${
              key ? "order-3" : ""
            }`}
          >
            {!key ? <BsCaretLeftFill /> : <BsCaretRightFill />}
          </button>
        ))}
        <h3 className="font-bold fx dark:font-normal text-base">
          {open?.title?.split(" ")[0]}
        </h3>
      </header>
      <div className="fx mt-2 gap-2">
        {sports.map((v, key) => (
          <span
            key={key}
            className={`flex text-xs dark:border-none active:scale-90 duration-200 fx border-2 gap-0.5 rounded-xl flex-col px-2 py-1.5 ${
              key === activeSport - 1
                ? "border-c2 bg-c2/10 dark:bg-c2/5 text-c2"
                : "border-black/20 dark:bg-black/10"
            }`}
            onClick={() => setActiveSport(key)}
          >
            <Svg id={v.id} size={15} />{" "}
            <span className="">{v.item.slice(0, 6)}</span>
          </span>
        ))}
      </div>
      <div className="fx gap-3 pr-1 pt-2 w-full pb-1 dark:bg-c4 bg-white rounded-b-2xl sticky z-10 top-[50px]">
        <div
          className={`fx h-7 bg-c3 dark:bg-black duration-150 gap-0.5 px-3 rounded-2xl`}
        >
          <input
            type="text"
            className={`py-1 peer order-2 w-14 duration-150`}
            placeholder="Search"
          />
          <span className="translate-y-px duration-150 order-1 peer-focus:text-c2">
            <BiSearchAlt />
          </span>
        </div>

        {["start time", "1X2"].map((v, key) => (
          <span
            key={key}
            className="rounded-2xl py-1 h-full bg-c2/10 dark:bg-c2/5  dark:text-c2 pl-4 pr-2.5 fx gap-0.5"
          >
            {v} <BsCaretDownFill className=" text-c2 text-11" />
          </span>
        ))}
      </div>
      <Retry
        state={games}
        loading={
          <div
            className={`flex mt flex-col relative items-center w-full gap-px `}
          >
            {Array(9)
              .fill("")
              .map((i, key1) => (
                <div
                  key={key1}
                  className={`flex z-[1] rounded-inh overflow-hidden w-full flex-col px-3 pt-3 last-of-type:pb-10 md:last-of-type:rounded-b-2xl pb-3 dark:bg-c4 bg-white`}
                >
                  <div className="w-[46%] rounded-md bg-slate-600/25 leading-[14px] mb-1 fade text-[12px]"></div>
                  <div className="w-full flex overflow-hidden justify-between items-center">
                    <div className="flex h-10 flex-col justify-between w-[42%]">
                      {[0, 1].map((key) => (
                        <span
                          className="flex bg-white/0 pr-1 w-full gap-1 items-center"
                          key={key}
                        >
                          <Image
                            width={11}
                            height={10}
                            src={"/badge.svg"}
                            alt=""
                          />
                          <span className="fade rounded-md flex-1 bg-slate-600/25 text-[12px] leading-[15px] mr-1"></span>
                        </span>
                      ))}
                    </div>
                    <div className="w-[58%] flex gap-2">
                      {Array(3)
                        .fill("")
                        .map((i, key2) => (
                          <span
                            key={key2}
                            className="bg-slate-600/25 rounded-md fade flex-1 h-10"
                          ></span>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        }
        error={
          <div className={`w-full mt-24 gap-2 fx flex-col`}>
            <BsWifiOff className="text-2xl" />
            No Internet
            <button
              className="text-c2 bg-c2/10 px-3 rounded-lg pb-1.5 pt-1 "
              onClick={() => getGames(1)}
            >
              refresh
            </button>
          </div>
        }
      >
        {typeof games !== String &&
          games !== null &&
          arrange(games).map((game, key) => (
            <React.Fragment key={key}>
              <Game game={game} mkt={"1X2"} last={false} margin={false} />
              <hr className="w-full dark:border-black h-1 bg-c3 dark:bg-black last-of-type:hidden last-of-type:mb-52 fx" />
            </React.Fragment>
          ))}
      </Retry>
    </Curtain>
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
