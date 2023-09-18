import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { BiInfoCircle, BiLockAlt } from "react-icons/bi";
import { Context } from "@/components/layout";
import { Animate } from ".";
import Retry from "@/components/services/Retry";
import { CircularLoader } from "@/components/services/Loaders";
import { BsWifiOff } from "react-icons/bs";
import {
  Buttons,
  ButtonsLayout_I,
  ButtonsLayout_II,
  market,
} from "@/components/games/Odds";
import { categories } from "@/components/Slider";

const Markets = ({ game, setTime, live }) => {
  const [data, setData] = useState(null);
  const { globalGames } = useContext(Context);
  const [active, setActive] = useState(0);
  const markets = useRef([]);

  const getMarkets = (active) => {
    if (data === "string" || data === null) return false;

    let arr = [];
    const db = (text) => {
      let g = [
        { text: `${text} 1X2`, infoText: "", v: "1X2", type: true },
        { text: `${text} Total Over | Under`, infoText: "", v: "OU" },
        {
          text: (
            <>
              {game?.home} Over | Under {text ? "(1st Half)" : ""}
            </>
          ),
          infoText: "",
          v: "HOU",
        },
        {
          text: (
            <>
              {game?.away} Over | Under {text ? "(1st Half)" : ""}
            </>
          ),
          infoText: "",
          v: "AOU",
        },
      ];

      g.forEach((ga, key) => {
        ga.tags = key ? ["", "over", "under"] : ["1", "X", "2"];
        ga.mkt = text === "" ? ga.v : `1${ga.v}`;
        ga.period = text === "" ? data?.periods?.num_0 : data?.periods?.num_1;
      });

      return g;
    };

    const dc = (text) => [
      {
        text: `Total ${text}`,
        infoText: "",
        v: "OU",
        period:
          text === "Corners" ? data?.Corners?.num_0 : data?.Bookings?.num_0,
        tags: ["", "over", "under"],
        mkt: text === "Corners" ? "TC" : "TB",
      },
      {
        text: `Total ${text} (1st Half)`,
        infoText: "",
        v: "OU",
        period:
          text === "Corners" ? data?.Corners?.num_1 : data?.Bookings?.num_1,
        tags: ["", "over", "under"],
        mkt: text === "Corners" ? "1TC" : "1TB",
      },
    ];

    if (active === 0) {
      arr = [...db(""), ...db("1st Half"), ...dc("Corners"), ...dc("Bookings")];
    } else if (active === 1) arr = db("1st Half");
    else if (active > 1) arr = active === 2 ? dc("Corners") : dc("Bookings");

    return arr;
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
        if (key === 0) d.periods.num_1 && m.push("All");
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
            <div className="w-full flex text-xs items-center dark:bg-black no-bars overflow-x-scroll gap-3 pl-8 pt-2 pb-2 overflow-y-hidden whitespace-nowrap bg-white top-[70px] dark:shadow-lg shadow-black/50 sticky z-10">
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
                  active === 4
                    ? "bg-c2/5 text-c2"
                    : "dark:bg-c4/60 bg-purple-700/30 dark:text-white/80"
                }`}
              >
                {categories.icons[3]} Specials
              </button>
              <button
                className={`fx gap-1 pl-3.5 pr-4 py-1 relative mr-4 rounded-t-xl rounded-bl-xl ${
                  active === 5
                    ? "bg-c2/5 text-c2"
                    : "dark:bg-c4/60 bg-orange-600/30 dark:text-white/80"
                }`}
              >
                {categories.icons[2]} Rocket odds
              </button>
            </div>
            <div className="flex mb-24 flex-col w-full">
              {mkt.map(
                (d, key) =>
                  d.period && (
                    <div
                      key={key}
                      className="w-full mt-5 flex-col items-start flex gap-2"
                    >
                      <span className="w-full dark:from-c4/30 dark:to-c4/20 from-c4/0 via-c4/10 to-c2/0 bg-gradient-to-r text-xs flex gap-1 items-center px-4 py-1.5">
                        <BiInfoCircle className="text-c2 " /> {d.text}
                      </span>
                      {d.type ? (
                        <div className="flex gap-2 px-4 w-full">
                          <Buttons
                            currentMkt={market(d.period, d.v)}
                            mkt={d.mkt}
                            key={active}
                            game={data}
                            tags={d.tags}
                            type
                          />
                        </div>
                      ) : (
                        <Buttons
                          currentMkt={market(d.period, d.v)}
                          mkt={d.mkt}
                          key={active}
                          game={data}
                          tags={d.tags}
                        />
                      )}
                    </div>
                  )
              )}
            </div>
          </>
        )}
      </Retry>
    </Animate>
  );
};

export default Markets;
