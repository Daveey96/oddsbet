import React, { useContext } from "react";
import Game from "./Game";
import { condition } from "@/helpers";
import { Context } from "../layout";

export default function GameList({ games, mkt, last, title }) {
  const len = condition(title.split(" ")[0], ["Today", "*"], [10, 6]);
  const { setOpen } = useContext(Context);

  return (
    <>
      {typeof games === "object" && games && (
        <div
          className={`flex flex-col relative aft after:bg-c2 after:blur-2xl after:-z-[2] after:rounded-full after:h-24 after:w-24 bef before:blur-2xl before:left-5 before:bg-c1 before:bottom-10 before:z-0 before:rounded-full before:h-28 before:w-28 items-center w-full gap-px dark:bg-transparent`}
        >
          {games &&
            games
              .slice(0, len)
              .map((game, key) => (
                <Game
                  key={key}
                  isLive={false}
                  game={game}
                  mkt={mkt}
                  last={last}
                  margin={games && games.length > len}
                />
              ))}
          {games && games.length > len && (
            <button
              onClick={() => setOpen(title)}
              className="absolute z-20 left-1/2 -translate-x-1/2 active:scale-90 duration-200 bottom-0 dark:bg-black/25 text-[12px] pt-1.5 pb-1 rounded-t-2xl px-5 "
            >
              view more <span className="text-c2">({games.length - 5})</span>
            </button>
          )}
        </div>
      )}
    </>
  );
}
