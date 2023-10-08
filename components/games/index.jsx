import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Retry from "../services/Retry";
import { BiFootball } from "react-icons/bi";
import { condition, getDate } from "@/helpers";
import { Context } from "../layout";
import Header from "./Header";
import GameList from "./GameList";
import { alertService } from "@/services";
import { Skeleton } from "../services/Loaders";
import { apiController } from "@/controllers";
import Error from "../services/Error";
import { inView } from "framer-motion";
import { market } from "./Odds";

export const sports = [
  {
    id: 1,
    item: "soccer",
    markets: [
      { item: "1X2", v: "1X2" },
      { item: "1X2 - 1st half", v: "01X2" },
      { item: "Double Chance", v: "DB*" },
      { item: "Over | Under", v: "OU" },
      { item: "GG", v: "GG*" },
      { item: "Fisrt Goal", v: "FTTS*" },
      { item: "DNB", v: "DNB*" },
    ],
  },
  {
    id: 2,
    item: "tennis",
    markets: [
      { item: "12", v: "WL" },
      { item: "over | under", v: "OU" },
      { item: "home over | under", v: "HOU" },
      { item: "away over | under", v: "AOU" },
    ],
  },
  {
    id: 3,
    item: "basketball",
    markets: [
      { item: "Winner", v: "WL" },
      { item: "over | under", v: "OU" },
      { item: "home over | under", v: "HOU" },
      { item: "away over | under", v: "AOU" },
    ],
  },
];

export default function GameLayout() {
  const { globalGames, setLoading } = useContext(Context);
  const [sport, setSport] = useState(1);
  const [mkt, setMkt] = useState(sports[sport - 1].markets[0].v);
  const [games, setGames] = useState([null]);

  const group = (data) => {
    let genArray = [];

    for (let i = 0; i < 8; i++) {
      const { isoString, weekDay } = getDate(i);
      const games = data.filter(
        (v) => v.starts.split("T")[0] === isoString && v.parent_id === null
      );
      const md = `${isoString.split("-")[2]}/${isoString.split("-")[1]}`;

      if (games.length > 0) {
        genArray.push({
          title: i ? `${weekDay} ${md}` : `Today ${md}`,
          date: isoString,
          games,
        });
      }
    }

    setGames(genArray);
  };

  const getGames = async (id, load) => {
    !load && setGames(["loading"]);

    if (globalGames.current[id]) {
      group(globalGames.current[id]);
      if (load) {
        return true;
      }
    } else {
      // if (!window.navigator.onLine) {
      //   if (load) return false;
      //   else setGames(["error"]);
      //   return;
      // }
      console.log("yes1");
      const data = await apiController.getGlobalGames(id);
      console.log("yes2");

      if (data) {
        globalGames.current[id] = data;
        group(data);
        if (load) return true;
      } else {
        if (load) return false;
        else setGames(["error"]);
      }
    }
  };

  const changeSport = async (id) => {
    setLoading(true);
    const bool = await getGames(id, true);
    setLoading(false);

    if (bool) {
      setMkt(sports[id - 1].markets[0].v);
      setSport(id);
    } else alertService.error("No Internet Connection");
  };

  useEffect(() => {
    let gamesContainer = document.getElementById("notLive");
    inView(gamesContainer, () => games[0] === null && getGames(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id={`notLive`} className={`relative dark:bg-c3/0 bg-c3 mb-1`}>
      <Header
        sport={sport}
        changeSport={changeSport}
        title={"Games"}
        setMkt={(v) => setMkt(v)}
      />
      {games.length ? (
        games.map((v, key) => (
          <Retry
            state={v}
            key={key}
            loading={
              <div
                className={`flex aft after:bg-c2 after:blur-2xl after:-z-[2] after:rounded-full after:h-24 after:w-24 bef before:blur-2xl before:left-5 before:bg-c1 before:bottom-5 before:z-0 before:rounded-full before:h-28 before:w-28 flex-col relative items-center w-full gap-px `}
              >
                {[0, 1, 2, 3].map((key1) => (
                  <div
                    key={key1}
                    className={`flex z-[1] rounded-inh overflow-hidden w-full flex-col px-3 pt-3 last-of-type:pb-10 md:last-of-type:rounded-b-2xl pb-3 dark:bg-c4 bg-white ${
                      key === games.length - 1 && "last-of-type:rounded-b-2xl"
                    }`}
                  >
                    <Skeleton className="w-[46%] opacity-50 rounded-md leading-[14px] mb-1 text-[12px]"></Skeleton>
                    <div className="w-full flex overflow-hidden justify-between items-center">
                      <div className="flex h-10 flex-col justify-between w-[42%]">
                        {[0, 1].map((key) => (
                          <span
                            className="flex bg-white/0 pr-1 w-full gap-1 items-center"
                            key={key}
                          >
                            <Skeleton className="fade rounded-md flex-1 text-[12px] leading-[15px] mr-1" />
                          </span>
                        ))}
                      </div>
                      <div className="w-[58%] flex gap-2">
                        {[0, 1, 2].map((key2) => (
                          <Skeleton
                            key={key2}
                            className="rounded-md flex-1 h-10"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
            error={
              <div className="relative w-full aft after:bg-c2 after:left-[40%] after:-top-4 after:blur-2xl after:-z-[2] after:rounded-full after:h-24 after:w-24 bef before:blur-2xl before:left-5 before:bg-c1 before:bottom-10 before:z-0 before:rounded-full before:h-28 before:w-28">
                <div className="flex opacity-0 flex-col relative items-center w-full gap-px">
                  {Array(4)
                    .fill("")
                    .map((i, key) => (
                      <span
                        key={key}
                        className="flex w-full flex-col px-3 pt-2.5 last-of-type:pb-12 pb-2"
                      >
                        <span className="w-full leading-[14px] mb-1 text-[12px]">
                          |
                        </span>
                        <span className="w-full h-10"></span>
                      </span>
                    ))}
                </div>
                <Error
                  className={`w-full bg-white h-full md:rounded-b-2xl absolute inset-0 z-20 ${
                    key === games.length - 1 && "rounded-b-2xl"
                  } dark:bg-c4`}
                  refresh={() => getGames(1)}
                  type
                />
              </div>
            }
          >
            <header
              className={`flex px-3.5 pt-2 justify-between dark:bg-c4/70 bg-c3 z-[3] items-center w-full pb-1 `}
            >
              <span className="flex gap-1 dark:text-white/80 text-black text-sm">
                {v?.title?.split(" ")[0]}
                <span className="dark:text-white/70 text-c2">
                  {v?.title?.split(" ")[1]}
                </span>
              </span>
              <span className="w-[60%] text-11 text-black dark:text-c2 fx">
                {market(
                  undefined,
                  mkt[0] === "0" ? mkt.slice(1) : mkt
                ).name.map((u, key1) => (
                  <span key={key1} className="flex-1 text-center">
                    {u}
                  </span>
                ))}
              </span>
            </header>
            <GameList
              mkt={mkt}
              key={sport}
              title={v?.title}
              date={v?.date}
              last={key === games.length - 1}
              games={v?.games}
              sport={sport}
            />
          </Retry>
        ))
      ) : (
        <div className="relative w-full aft after:bg-c2 after:left-[40%] after:-top-4 after:blur-2xl after:-z-[2] after:rounded-full after:h-24 after:w-24 bef before:blur-2xl before:left-5 before:bg-c1 before:bottom-10 before:z-0 before:rounded-full before:h-28 before:w-28">
          <div className="flex opacity-0 flex-col relative items-center w-full gap-px">
            {Array(4)
              .fill("")
              .map((i, key) => (
                <span
                  key={key}
                  className="flex w-full flex-col px-3 pt-2.5 last-of-type:pb-12 pb-2"
                >
                  <span className="w-full mb-11 leading-[14px] text-[12px]">
                    |
                  </span>
                </span>
              ))}
          </div>
          <Error
            className={`w-full bg-white h-full gap-2 fx md:rounded-b-2xl absolute inset-0 z-20 fx flex-col rounded-b-2xl`}
            refresh={getGames}
          >
            <span className=" relative aft after:h-1 rotate-45 fx after:w-[120%] after:bg-c2">
              <BiFootball className="text-3xl" />
            </span>
            There are no games available
          </Error>
        </div>
      )}
    </div>
  );
}
