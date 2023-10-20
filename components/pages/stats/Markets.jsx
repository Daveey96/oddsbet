import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Context } from "@/components/layout";
import { Animate } from ".";
import Retry from "@/components/services/Retry";
import { CircularLoader } from "@/components/services/Loaders";
import {
  BsArrowBarUp,
  BsCaretUpFill,
  BsChevronDoubleUp,
  BsInfoCircleFill,
  BsStar,
  BsStarFill,
  BsX,
} from "react-icons/bs";
import { getMarket } from "@/components/games/Odds";
import { categories } from "@/components/sliders/Slider";
import Error from "@/components/services/Error";
import { mktDb } from "@/helpers";
import { Buttons } from "@/components/games/Buttons";
import Animated, { Modal } from "@/components/global/Animated";
import ScrrollTo from "@/components/global/ScrrollTo";

const Markets = ({ game, live, head, setInfo }) => {
  const [data, setData] = useState(null);
  const { globalGames } = useContext(Context);
  const [active, setActive] = useState("Main");
  const [closed, setClosed] = useState([]);
  const [markets, setMarkets] = useState([
    "Favourites",
    "Main",
    "1st Half",
    "Goals",
  ]);
  const [favourites, setFavourites] = useState([]);

  const getMarkets = () => {
    if (data === "string" || data === null) return false;

    if (active === "Main")
      return [
        "1X2",
        "DB*",
        "OU",
        "GG*",
        "FTTS*",
        "HOU",
        "AOU",
        "COR*",
        "BOO*",
        "HAN*",
        "DNB*",
        "CS*",
        "OE*",
        "WM*",
      ];
    else if (active === "1st Half")
      return [
        "01X2",
        "0DB*",
        "0OU",
        "0GG*",
        "0HOU",
        "0AOU",
        "0COR*",
        "0BOO*",
        "0DNB*",
        "0CS*",
        "0OE*",
        "0WM*",
      ];
    else if (active === "Goals")
      return [
        "GG*",
        "GR*",
        "HG*",
        "HTS*",
        "HTWN*",
        "AG*",
        "ATS*",
        "ATWN*",
        "0GG*",
        "0GR*",
        "0HG*",
        "0HTS*",
        "0HTWN*",
        "0AG*",
        "0ATS*",
        "0ATWN*",
      ];
    else if (active === data?.home)
      return ["HOU", "HG*", "HTS*", "HTWN*", "0HOU", "0HG*", "0HTS*", "0HTWN*"];
    else if (active === data?.away)
      return ["AOU", "AG*", "ATS*", "ATWN*", "0AOU", "0AG*", "0ATS*", "0ATWN*"];
    else if (active === "Favourites") return favourites;

    return [];
  };

  const mkt = useMemo(getMarkets, [data, active, favourites]);

  const getData = async () => {
    // dev
    const d = globalGames.current[game.sport].filter(
      (v) => v.event_id === game.id
    )[0];

    // production
    // const data = await apiController.getMatch(game.id);

    if (d) {
      if (d?.periods?.specials) setMarkets([...markets, d.home, d.away]);
      setData(d);
    } else setData("error");
  };

  const updateFavourites = (v) => {
    if (favourites.includes(v)) {
      let removeValue = favourites.filter((m) => m !== v);
      localStorage.setItem("favourites", removeValue.join());
      setFavourites(removeValue);
    } else {
      let addValue = [...favourites, v];
      localStorage.setItem("favourites", addValue.join());
      setFavourites(addValue);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("favourites"))
      setFavourites(localStorage.getItem("favourites").split(","));

    setTimeout(() => data === null && getData(), 500);
  }, [data]);

  return (
    <Animate>
      <Retry
        state={data}
        loading={<CircularLoader className={"mt-24"} size={35} color />}
        error={
          <Error
            className={`w-full mt-24 gap-2 fx flex-col`}
            refresh={getData}
            type
          />
        }
      >
        {typeof data === "object" && data !== null && (
          <>
            <ScrrollTo
              id={"mktss"}
              className={`w-full scroll-smooth flex text-xs items-center dark:bg-black no-bars overflow-x-scroll gap-3 pl-8 pt-2 pb-2 overflow-y-hidden whitespace-nowrap bg-white top-[70px] shadow-black/30 dark:shadow-black/50 sticky z-10 ${
                head && "shadow-md"
              }`}
              iClass={markets.map(
                (v) =>
                  `fx active:scale-75 duration-100 px-5 py-1 relative last:mr-4 rounded-xl ${
                    v === active
                      ? "dark:bg-c2/5 dark:text-c2 bg-c2 text-white"
                      : "dark:bg-c4/60 bg-c3"
                  }`
              )}
              clicked={(v) => setActive(v)}
              list={markets}
            />

            <div className="flex flex-col w-full">
              <div
                className={`relative empty:after:flex after:hidden after:opacity-80 after:content-["No_markets_available"] after:text-sm aft after:w-full after:justify-center after:top-24 flex-col min-h-[70vh] w-full`}
              >
                {mkt.map((v, key) => {
                  let g = mktDb(v, data);
                  let f = v.includes("*")
                    ? data?.periods?.specials
                    : data?.periods;
                  const odds = getMarket(
                    v[0] === "0" ? f?.num_1 : f?.num_0,
                    v[0] === "0" ? v.slice(1) : v,
                    data?.rocketOdds,
                    data
                  );
                  let isNull = null;

                  odds.forEach((v) => {
                    if (v !== null && v?.length !== 0) {
                      isNull = true;
                      return;
                    }
                  });

                  return (
                    isNull && (
                      <div
                        key={key}
                        className="w-full mt-3 flex-col items-start flex gap-2"
                      >
                        <span
                          onClick={() =>
                            setClosed(
                              closed.includes(key)
                                ? closed.filter((v) => v !== key)
                                : [...closed, key]
                            )
                          }
                          className="w-full dark:from-c4/30 dark:to-c4/20 from-c3/20 dark:via-c4/10 via-c3/20 to-c3/20 bg-gradient-to-r text-xs flex gap-1 justify-between items-center px-4 py-1.5"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setInfo({
                                text: g.text,
                                info: g?.info || "i am info",
                              });
                            }}
                            className="fx gap-1"
                          >
                            <BsInfoCircleFill className="text-c2" />
                            {g.text}
                          </button>
                          <span className="fx h-full text-c2">
                            <span
                              className={`duration-150 text-c2 px-2 ${
                                closed.includes(key) ? "rotate-0" : "rotate-180"
                              }`}
                            >
                              <BsCaretUpFill />
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateFavourites(v);
                              }}
                              className="px-1"
                            >
                              {favourites.includes(v) ? (
                                <BsStarFill />
                              ) : (
                                <BsStar />
                              )}
                            </button>
                          </span>
                        </span>
                        {!closed.includes(key) && (
                          <div
                            className={`${!g.type && "flex gap-2 px-4"} w-full`}
                          >
                            <Buttons
                              odds={odds}
                              mkt={v}
                              key={active}
                              game={data}
                              main
                            />
                          </div>
                        )}
                      </div>
                    )
                  );
                })}
              </div>
              <span
                onClick={() => {
                  document.getElementById("scontainer").scrollTo(0, 0);
                }}
                className="w-full duration-200 active:scale-75 bg-c5 dark:bg-c4/50 text-c2 gap-2 text-sm pb-20 pt-5 rounded-t-3xl fx mt-8"
              >
                Back to top <BsChevronDoubleUp />
              </span>
            </div>
          </>
        )}
      </Retry>
    </Animate>
  );
};

export default Markets;
