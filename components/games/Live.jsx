import React, { useContext, useEffect, useState } from "react";
import { sports } from ".";
import Header from "./Header";
import Retry from "../services/Retry";
import Game from "./Game";
import { apiController } from "@/controllers";
import { Context } from "../layout";
import Error from "../services/Error";
import { Skeleton } from "../services/Loaders";

export default function Live() {
  const [sport, setSport] = useState(1);
  const [games, setGames] = useState(null);
  const [mkt, setMkt] = useState(sports[sport - 1].markets[0].v);
  const { setLoading } = useContext(Context);

  const getGames = async (id) => {
    (games === null || games === "error") && setGames("loading");

    let data = await apiController.getMatches(1, true);

    console.log(data);
    if (data) {
      setGames(
        data.filter(
          (g) =>
            g?.period_results === undefined && g.resulting_unit === "Regular"
        )
      );
    } else setGames("error");
  };

  console.log(games);

  // useEffect(() => {
  //   games === null && getGames();
  // }, []);

  const changeSport = async (id) => {
    setLoading(true);
    setSport(id);
    await getGames(id);
    setLoading(false);
  };

  return (
    <div
      id={"live"}
      className={`relative mb-1 dark:bg-transparent dark:mt-0 text-white mt-4 dark:bg-black bg-c4`}
    >
      <Header
        sport={sport}
        changeSport={changeSport}
        setMkt={(v) => setMkt(v)}
        live
      />
      <Retry
        state={games}
        loading={
          <div
            className={`flex aft after:bg-c2/75 after:blur-2xl after:z-0 after:rounded-full after:h-24 after:w-24 bef before:blur-2xl before:left-5 before:bg-c1 before:bottom-10 before:z-0 before:rounded-full before:h-28 before:w-28 flex-col relative items-center w-full gap-px `}
          >
            {[0, 1, 2, 3].map((key) => (
              <div
                key={key}
                className={`flex z-[1] w-full flex-col px-3 pt-2.5 last-of-type:pb-12 md:last-of-type:rounded-b-2xl pb-2 bg-c4/40`}
              >
                <Skeleton className="w-[46%] rounded-md bg-slate-600/10 after:via-slate-600/10 dl leading-[14px] mb-1 text-[12px]" />
                <div className="w-full flex justify-between items-center">
                  <div className="flex h-10 flex-col justify-between w-[42%]">
                    {[0, 1].map((key) => (
                      <span
                        className="flex bg-white/0 pr-1 w-full gap-1 items-center"
                        key={key}
                      >
                        <Skeleton className="rounded-md flex-1 bg-slate-600/20 after:via-slate-600/10 dl text-[12px] leading-[15px] mr-1"></Skeleton>
                      </span>
                    ))}
                  </div>
                  <div className="w-[58%] flex gap-2">
                    {[0, 1, 2].map((key2) => (
                      <Skeleton
                        key={key2}
                        className="bg-slate-600/20 after:via-slate-600/10 dl rounded-md flex-1 h-10"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
        error={
          <div className="relative w-full aft after:bg-c2/75 after:left-[40%] after:-top-4 after:blur-2xl after:z-0 after:rounded-full after:h-24 after:w-24 bef before:blur-2xl before:left-5 before:bg-c1 before:bottom-10 before:z-0 before:rounded-full before:h-28 before:w-28">
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
              className={`w-full h-full md:rounded-b-2xl absolute inset-0 z-20 dark:bg-c4/40`}
              refresh={getGames}
              type
            />
          </div>
        }
      >
        {typeof games === "object" && games && games.length > 0 ? (
          <div
            className={`flex flex-col relative aft after:bg-c2/75 after:blur-2xl after:z-0 after:rounded-full after:h-24 after:w-24 bef before:blur-2xl before:left-5 before:bg-c1 before:bottom-10 before:z-0 before:rounded-full before:h-28 before:w-28 items-center w-full gap-px bg-black/40`}
          >
            {games.slice(0, 5).map((game, key) => (
              <Game
                key={key}
                className={"last-of-type:pb-12 bg-c4/50 text-white pb-3"}
                isLive={true}
                game={game}
                mkt={mkt}
              />
            ))}
          </div>
        ) : (
          <div className="relative w-full aft after:bg-c2/75 after:left-[40%] after:-top-4 after:blur-2xl after:z-0 after:rounded-full after:h-24 after:w-24 bef before:blur-2xl before:left-5 before:bg-c1 before:bottom-10 before:z-0 before:rounded-full before:h-28 before:w-28">
            <div className="flex opacity-0 flex-col relative items-center w-full gap-px">
              {[0, 1, 2, 3].map((key) => (
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
            <div
              className={`w-full h-full gap-2 fx md:rounded-b-2xl absolute inset-0 z-20 fx flex-col dark:bg-c4/40`}
            >
              No Available Games
              <button className="text-c2" onClick={getGames}>
                refresh
              </button>
            </div>
          </div>
        )}
      </Retry>
      {games && typeof games === "object" && games.length > 5 && (
        <button className="absolute z-20 left-1/2 -translate-x-1/2 active:scale-90 duration-200 bottom-0 bg-black/25 text-[12px] pt-1.5 pb-1 rounded-t-2xl px-5 ">
          view more <span className="text-c2">({games.length - 5})</span>
        </button>
      )}
    </div>
  );
}
