import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { Context } from "../layout";
import { sports } from "../games";
import Svg from "../global/Svg";
import {
  BsCaretDownFill,
  BsCaretLeftFill,
  BsCaretRightFill,
  BsWifiOff,
} from "react-icons/bs";
import Game from "../games/Game";
import Retry from "../services/Retry";
import Image from "next/image";
import { Curtain } from "../global/Animated";
import { arrange } from "@/helpers";
import DropDown from "../global/DropDown";
import { CircularLoader } from "../services/Loaders";

function AllGames() {
  const { open, setOpen, globalGames } = useContext(Context);
  const [activeSport, setActiveSport] = useState(open?.sport);
  const [games, setGames] = useState(null);
  const [value, setValue] = useState("");
  const mainGames = useRef(null);
  const input = useRef(null);
  const [searchLoad, setSearchLoad] = useState(false);
  const [market, setMarket] = useState("1X2");
  const [sort, setSort] = useState("st");

  const getGames = () => {
    let g = globalGames.current[activeSport].filter(
      (v) => v.starts.split("T")[0] === open.date
    );
    mainGames.current = g;
    setGames(g);
  };

  const time = (v) => {
    setTimeout(async () => {
      if (input.current.value === v) {
        let g = await mainGames.current.filter(
          (v) =>
            v.league_name.toLowerCase().includes(value.toLowerCase()) ||
            v.home.toLowerCase().includes(value.toLowerCase()) ||
            v.away.toLowerCase().includes(value.toLowerCase())
        );
        setGames(g);
        setSearchLoad(false);
      }
    }, 2000);
  };

  const typing = (value) => {
    setValue(value);
    setSearchLoad(true);
    time(value);
  };

  const changed = (v, key) => {
    console.log(v, key);
    key ? setMarket(v) : setSort(v);
  };

  useEffect(() => {
    setTimeout(() => games === null && getGames(), 500);
  }, [games]);

  const details = [
    [
      { text: "popularity", v: "p" },
      { text: "start time", v: "st" },
    ],
    [
      { text: "1X2", v: "1X2" },
      { text: "1st Half - 1X2", v: "01X2" },
      { text: "Over Under", v: "OU" },
      { text: "Home O|U", v: "HOU" },
      { text: "Away O|U", v: "AOU" },
    ],
  ];

  return (
    <Curtain
      id={"allgames"}
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
          className={`fx h-7 bg-c3 dark:bg-black duration-150 gap-1 px-3 rounded-2xl`}
        >
          <input
            type="text"
            ref={input}
            className={`py-1 peer order-2 w-14 duration-150`}
            placeholder="Search"
            value={value}
            onChange={({ target }) => typing(target.value)}
          />
          <span className="translate-y-px duration-150 order-1 fx relative peer-focus:text-c2">
            <BiSearchAlt className={searchLoad ? "opacity-0" : ""} />
            {searchLoad && (
              <CircularLoader
                depth={2}
                size={12}
                className={"mr-1 absolute"}
                color
              />
            )}
          </span>
        </div>
        {details.map((v, key) => (
          <DropDown
            ngClass={"right-0 mt-2 py-2 px-4 rounded-xl bg-black gap-1"}
            changed={(key2) => changed(v[key2].v, key)}
            className="fx gap-1 z-30 text-c2 bg-c2/5 rounded-3xl py-1.5 px-3"
            iClass="text-c2 bg-black whitespace-nowrap rounded-3xl pt-2 pb-2.5"
            item={<BsCaretDownFill className=" text-c2 text-9 mt-0.5" />}
            key={key}
          >
            {v.map((v2, key) => (
              <React.Fragment key={key}>{v2.text}</React.Fragment>
            ))}
          </DropDown>
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
          arrange(games, sort).map((game) => (
            <React.Fragment key={game.event_id}>
              <Game game={game} mkt={market} last={false} margin={false} />
              <hr className="w-full dark:border-black h-px bg-c3 dark:bg-black last-of-type:hidden last-of-type:mb-52 fx" />
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
