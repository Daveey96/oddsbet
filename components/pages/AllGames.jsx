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
import { arrange, isArray } from "@/helpers";
import DropDown from "../global/DropDown";
import { CircularLoader } from "../services/Loaders";
import ScrrollTo from "../global/ScrrollTo";

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
  const [head, setHead] = useState(false);

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

  useEffect(() => {
    if (open) {
      const cont = document.getElementById("allgames");
      cont.scrollTop > 100 ? setHead(true) : setHead(false);

      cont.addEventListener("scroll", (e) => {
        e.target.scrollTop > 100 ? setHead(true) : setHead(false);
      });
    }
  }, [open]);

  const details = [
    [
      { text: "today", v: "p" },
      { text: "tomorrow", v: "st" },
    ],
    [
      { text: "popularity", v: "p" },
      { text: "time", v: "st" },
    ],
  ];

  return (
    <Curtain
      id={"allgames"}
      setState={() => setOpen(null)}
      className="dark:bg-c4 pb-12 bg-white z-[23] overflow-y-scroll overflow-x-hidden"
    >
      <header className="fx pt-14 bg-black/40 gap-2">
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
      </header>
      <div
        className={`fx flex-col gap-3 pr-1 pt-2 w-full pb-1 bg-white sticky z-10 top-[50px] ${
          head ? "dark:bg-transparent after:absolute" : "dark:bg-black/40"
        }`}
      >
        <div className="flex gap-2">
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
              ngClass={"right-0 py-2 px-4 rounded-xl bg-black gap-1"}
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
        <ScrrollTo
          id={"allscroll"}
          list={sports[0].markets}
          className="flex py-2 w-full gap-3"
        >
          {sports[0].markets.map((v, key) => (
            <span
              key={key}
              className="py-1.5 whitespace-nowrap flex rounded-2xl bg-black/40 px-4"
            >
              {v.item}
            </span>
          ))}
        </ScrrollTo>
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
        {isArray(games) && (
          <>
            <div className="flex bg-black justify-end">
              <span className="flex w-1/2">
                {["1", "x", "2"].map((v, key) => (
                  <span key={key} className="flex-1 py-1">
                    {v}
                  </span>
                ))}
              </span>
            </div>
            {arrange(games, sort).map((game) => (
              <React.Fragment key={game.event_id}>
                <Game game={game} mkt={market} last={false} margin={false} />
                <hr className="w-full dark:border-black h-px bg-c3 dark:bg-black last-of-type:hidden last-of-type:mb-52 fx" />
              </React.Fragment>
            ))}
          </>
        )}
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
