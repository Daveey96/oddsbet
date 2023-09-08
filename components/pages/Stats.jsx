import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Curtain } from "../Animated";
import { Context } from "../layout";
import { FaLongArrowAltLeft, FaTshirt } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { categories } from "../Slider";
import { market } from "../games/Odds";
import { BiChevronLeftCircle, BiInfoCircle } from "react-icons/bi";
import { condition } from "@/helpers";
import { CircularLoader, SkeletonLoad } from "../services/Loaders";
import Retry from "../services/Retry";
import { BsWifiOff } from "react-icons/bs";
import { apiController } from "@/controllers";
import { hintService } from "@/services";

const Animate = ({ children, className }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ ease: "easeInOut", duration: 0.1 }}
    className={`w-full fx flex-col ${className}`}
  >
    {children}
  </motion.div>
);

const H2H = () => {
  const [data, setData] = useState("error");

  const getData = () => {};

  useEffect(() => {}, []);

  return (
    <Animate>
      <Retry
        state={data}
        loading={<CircularLoader className={"mt-24"} size={35} color />}
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
      ></Retry>
    </Animate>
  );
};

const Markets = ({ game, setTime, live }) => {
  const [data, setData] = useState(null);
  const { globalGames } = useContext(Context);
  const [active, setActive] = useState(0);
  const markets = useRef([]);

  const getMarkets = (active) => {
    if (data === "string" || data === null) return false;

    if (active < 2) {
      return {
        array: [
          {
            text: `${active ? "1st Half" : ""} WDL`,
            infoText: "",
            v: "WDL",
            tags: ["1", "X", "2"],
            type: true,
          },
          {
            text: `${active ? "1st Half" : ""} Total Over | Under`,
            infoText: "",
            v: "OU",
            tags: ["", "over", "under"],
          },
          {
            text: (
              <>
                {game?.home} Over | Under {active ? "(1st Half)" : ""}
              </>
            ),
            infoText: "",
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
            v: "AOU",
            tags: ["", "over", "under"],
          },
        ],
        game: active ? data?.periods?.num_1 : data?.periods?.num_0,
      };
    }
    if (active === 2) {
      return {
        array: [
          {
            text: `Total Corners`,
            infoText: "",
            v: "OU",
            period: data?.Corners?.num_0,
            tags: ["", "over", "under"],
          },
          {
            text: `Total Corners (1st Half)`,
            infoText: "",
            v: "OU",
            period: data?.Corners?.num_1,
            tags: ["", "over", "under"],
          },
        ],
      };
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mkt = useMemo(() => getMarkets(active), [data, active]);

  const getData = async () => {
    // dev
    const d = globalGames.current[game.sport].filter(
      (v) => v.event_id === game.id
    )[0];

    // hintService.hint(
    //   <>
    //     <FaLongArrowAltLeft />
    //   </>,
    //   "rounded-xl cent pt-4 pb-6 px-12"
    // );

    // production
    // const data = await apiController.getMatch(game.id);

    if (d) {
      let t = "";

      if (live) t = 24;
      else {
        let v = new Date(d.starts.split("T")[0]).toISOString();
        let f = new Date().toISOString();
        let k = "";

        if (v === f) k = v[0];

        t = `${k} ${d.starts.split("T")[1].slice(0, -3)}`;
      }

      setTime(t);
      let m = [];

      [0, 1, 2, 3].forEach((key) => {
        if (key === 0) d.periods.num_1 && m.push("Favourites");
        else if (key === 1) d.periods.num_0 && m.push("1st Half");
        else if (key === 2) d.Corners && m.push("Corners");
        else if (key === 3) d.Bookings && m.push("Bookings");
      });

      markets.current = m;

      return setData(d);
    }
    setData(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Animate>
      <Retry
        state={data}
        loading={<CircularLoader className={"mt-24"} size={35} color />}
        error={
          <div className={`w-full mt-24 gap-2 fx flex-col`}>
            <BsWifiOff className="text-2xl" />
            No Internet
            <button
              className="text-c2 bg-c2/10 px-3 rounded-lg pb-1.5 pt-1 "
              onClick={() => getData(1)}
            >
              refresh
            </button>
          </div>
        }
      >
        {typeof data === "object" && data !== null && (
          <>
            <div className="w-full dark:bg-black bg-white top-[70px] dark:shadow-lg shadow-black/50 sticky z-10">
              <div className=" flex text-xs items-center no-bars overflow-x-scroll overflow-y-hidden whitespace-nowrap w-full gap-3 pl-8 pt-2 mb-2">
                {markets.current.map((v, key) => (
                  <button
                    className={`fx active:scale-75 duration-100 px-5 py-1 relative last:mr-4 rounded-t-xl rounded-bl-xl ${
                      key === active
                        ? "dark:bg-c2/5 dark:text-c2 bg-c2 text-white"
                        : "dark:bg-c4/60 bg-c3"
                    }`}
                    onClick={() => setActive(key)}
                    key={key}
                  >
                    {v}
                  </button>
                ))}
                <button
                  className={`fx pl-3.5 pr-4 gap-1 py-1 rounded-t-xl rounded-bl-xl ${
                    active === 3
                      ? "bg-c2/5 text-c2"
                      : "dark:bg-c4/60 bg-purple-700/30 dark:text-white/80"
                  }`}
                >
                  {categories.icons[3]} Specials
                </button>
                <button
                  className={`fx gap-1 pl-3.5 pr-4 py-1 relative mr-4 rounded-t-xl rounded-bl-xl ${
                    active === 4
                      ? "bg-c2/5 text-c2"
                      : "dark:bg-c4/60 bg-orange-600/30 dark:text-white/80"
                  }`}
                >
                  {categories.icons[2]} Rocket odds
                </button>
              </div>
            </div>
            <div className="flex mb-24 flex-col w-full">
              {mkt.array.map((d, key) => (
                <div
                  key={key}
                  className="w-full mt-3 flex-col items-start flex gap-2"
                >
                  <span className="w-full dark:from-c4/60 dark:to-c4/10 from-c4/0 via-c4/10 to-c2/0 bg-gradient-to-r text-xs flex gap-1 items-center px-4 py-1.5">
                    <BiInfoCircle className="text-c2 " /> {d.text}
                  </span>
                  {d.type ? (
                    <div className="flex gap-2 px-4 w-full">
                      {market(d.period || mkt.game, d.v).odds.map((v, key) => (
                        <button
                          className="flex-1 gap-2 relative active:scale-75 duration-100 dark:bg-c4 bg-c3 fx rounded-lg h-11"
                          key={key}
                        >
                          <span className="text-11 mt-1 fx gap-2 text-c2 bottom-[105%]">
                            {d.tags[key]} |
                          </span>
                          {v.toFixed(2)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <>
                      {market(d?.period || mkt.game, d.v).odds.map(
                        (odd, key) => (
                          <div
                            key={key}
                            className="flex first-of-type:mt-3 gap-2 px-4 w-full"
                          >
                            {odd.map((v, key1) => (
                              <>
                                {key1 ? (
                                  <button
                                    className="flex-[2] mt-1 relative active:scale-75 duration-100 dark:bg-c4/40 bg-c3 fx rounded-lg h-11"
                                    key={key1}
                                  >
                                    {key1 ? v.toFixed(2) : v}
                                    {!key && (
                                      <span className="bottom-[105%] text-xs absolute text-c2">
                                        {d.tags[key1]}
                                      </span>
                                    )}
                                  </button>
                                ) : (
                                  <span
                                    className="flex-1 dark:bg-c4/40 bg-c4/50 text-white fx rounded-lg h-11"
                                    key={key1}
                                  >
                                    {key1 ? v.toFixed(2) : v}
                                  </span>
                                )}
                              </>
                            ))}
                          </div>
                        )
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </Retry>
    </Animate>
  );
};

const Lineup = () => {
  const [data, setData] = useState("error");

  const getData = () => {};

  useEffect(() => {}, []);

  return (
    <Animate>
      <Retry
        state={data}
        loading={<CircularLoader className={"mt-24"} size={35} color />}
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
      ></Retry>
    </Animate>
  );
};

export default function Stats() {
  const { game, setGame } = useContext(Context);
  const [active, setActive] = useState(1);
  const [head, setHead] = useState(false);
  const [time, setTime] = useState(null);

  useEffect(() => {
    if (game) {
      const cont = document.getElementById("scontainer");
      cont.scrollTop > 45 ? setHead(true) : setHead(false);

      cont.addEventListener("scroll", (e) => {
        e.target.scrollTop > 45 ? setHead(true) : setHead(false);
      });
    }
  }, [game]);

  return (
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
                className={`text-sm ${key ? "text-red-600" : "text-blue-700"}`}
              />
              <motion.span
                layout
                className="flex-1 duration-200 whitespace-nowrap text-ellipsis overflow-hidden relative text-xs text-center"
              >
                {key ? game?.away : game?.home}
              </motion.span>
            </span>
          ))}
          <span className="flex-1 text-c2 text-sm fx order-2 gap-5">
            {/* {game?.starts.split("T")[1].split(":").slice(0, -1).join(":")} */}
          </span>
          <button
            onClick={() => setGame(null)}
            className="flex text-xs dark:text-white/60 bottom-[110%] items-center gap-0.5 absolute"
          >
            <BiChevronLeftCircle className="mb-px" /> back
          </button>
        </div>
      }
      siblingState={head && game}
      setState={() => setGame(null)}
      className="dark:bg-black bg-white overflow-y-scroll overflow-x-hidden justify-start items-center z-[24] w-full "
    >
      <header className="top-0 dark:bg-black bg-white fx w-full">
        <div className="w-[95%] relative rounded-xl mt-9 mb-1  fx ">
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
                className=" duration-200 relative text-sm text-center"
              >
                {key ? game?.away : game?.home}
              </span>
            </span>
          ))}
          <SkeletonLoad
            state={time}
            iClass="rounded-xl"
            className="flex-1 text-c2 relative text-sm fx order-2 gap-5"
          >
            <span className="absolute">{time.split(" ")[0]}</span>
            <span className="font-bold">{time.split(" ")[1]}</span>
          </SkeletonLoad>
          <button
            onClick={() => setGame(null)}
            className="flex text-xs dark:text-white/60 bottom-[105%] items-center gap-0.5 absolute"
          >
            <BiChevronLeftCircle className="mt-px" /> back
          </button>
        </div>
      </header>
      <div className="flex w-[90%] bg-c3 rounded-xl gap-1 text-xs border-0 dark:border-b-2 border-b-c4 justify-center pt-2">
        {["Markets", "H2H", "line-ups"].map((v, key) => (
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
      {condition(
        active,
        [0, 1, 2],
        [
          <Markets setTime={(t) => setTime(t)} key={12} game={game} />,
          <H2H key={13} />,
          <Lineup key={14} />,
        ]
      )}
    </Curtain>
  );
}
