import React, { useContext, useMemo, useState } from "react";
import { BiLockAlt } from "react-icons/bi";
import { Context } from "../layout";
import { condition } from "@/helpers";
import { BsCaretUpFill } from "react-icons/bs";

export const market = (g, v) => {
  if (!g) return false;

  const getAll = (mkt) => {
    if (!mkt) return Array(3).fill(null);
    let odds = [];
    const values =
      v === "OU" ? Object.values(mkt).map((value) => value) : [mkt];
    values.forEach(
      (i) =>
        i.points.toString().length < 4 && odds.push([i.points, i.over, i.under])
    );

    odds = odds.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
    return odds;
  };

  if (v === "1X2") {
    return {
      name: ["home", "draw", "away"],
      odds: g?.money_line
        ? [g.money_line.home, g.money_line.draw, g.money_line.away]
        : Array(3).fill(null),
    };
  }
  if (v === "WL") {
    return {
      name: ["home", "away"],
      odds: g?.money_line
        ? [g.money_line.home, g.money_line.away]
        : Array(2).fill(null),
    };
  }
  if (v === "DB") {
    return {
      name: ["home or draw", "draw or away", "home or away"],
      odds: [g.win1X?.v, g.winX2?.v, g.win12?.v],
    };
  }
  if (v === "OU" || v === "HOU" || v === "AOU" || v === "COR") {
    return {
      name: ["", "Over", "Under"],
      tag: ["", "over", "under"],
      odds: getAll(
        condition(
          v,
          ["OU", "HOU", "AOU", "COR"],
          [g?.totals, g?.team_total?.home, g?.team_total?.away, g?.totals]
        ),
        "over",
        "under"
      ),
      type: true,
    };
  }
};

let details = {
  X2: "",
};

export const Buttons = ({ currentMkt, game, mkt, tags, type }) => {
  const { betList, setBetList } = useContext(Context);
  const { odds, name } = currentMkt;
  const [active, setActive] = useState(undefined);

  const activate = () => {
    for (let i = 0; i < betList.length; i++)
      if (betList[i].id === game.event_id && betList[i].mkt === mkt)
        return setActive(betList[i].v);
    setActive(undefined);
  };

  const addGame = (odd, v) => {
    let newBetList = betList.filter(
      (g) => g.id !== game.event_id || g.mkt !== mkt
    );

    if (active === v) {
      setBetList(newBetList);
      setActive(undefined);
      return;
    }
    const { event_id, home, away, starts, sport_id } = game;

    setActive(v);
    setBetList([
      ...newBetList,
      {
        id: event_id,
        sport_id,
        outcome: type
          ? name[v]
          : name[parseInt(v[1])] + " " + odds[parseInt(v[0])][0],
        text: type
          ? condition(
              name[v],
              ["home", "away", "*"],
              [`Home to win`, `Away to win`, "Draw"]
            )
          : undefined,
        home,
        away,
        v,
        time: starts.split("T")[1].slice(0, -3),
        odd: parseFloat(odd).toFixed(2),
        mkt,
      },
    ]);
  };

  const locked = (v) => !v || v < 1.01;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(activate, [mkt, betList]);

  return (
    <>
      {type ? (
        odds.map((odd, key) => (
          <button
            key={key}
            disabled={locked(odd)}
            onClick={() => addGame(odd.toFixed(2), key)}
            className={`active:scale-110 duration-150 flex-1 relative fx ${
              key === active &&
              "dark:from-c1/90 from-c1 to-c2 dark:to-c2/90 bg-gradient-to-br text-white"
            } ${
              tags
                ? "gap-2 dark:bg-c4/80 bg-c3 fx rounded-md h-11"
                : "bg-c3 dark:bg-black h-10 rounded-md"
            }`}
          >
            {tags && (
              <span className="text-11 mt-1 fx gap-2 text-c2 bottom-[105%]">
                {tags[key]} |
              </span>
            )}
            {!locked(odd) ? (
              odd.toFixed(2)
            ) : (
              <BiLockAlt className="opacity-60" />
            )}
          </button>
        ))
      ) : (
        <>
          {tags ? (
            odds.map((odd, key) => (
              <div
                key={key}
                className="flex first-of-type:mt-3 gap-2 px-4 w-full"
              >
                {odd.map((v, key1) => (
                  <>
                    {key1 ? (
                      <button
                        className={`flex-[2] mt-2 relative active:scale-110 duration-150 dark:bg-c4/80 bg-c3 fx rounded-lg h-11 ${
                          active &&
                          parseInt(active[0]) === key &&
                          parseInt(active[1]) === key1 &&
                          "from-c1/75 to-c2/75 text-white bg-gradient-to-br"
                        }`}
                        key={key1}
                        onClick={() => addGame(v.toFixed(2), `${key}${key1}`)}
                      >
                        {v.toFixed(2)}
                        {!key && (
                          <span className="bottom-[110%] text-xs absolute opacity-25">
                            {tags[key1]}
                          </span>
                        )}
                      </button>
                    ) : (
                      <span
                        className="flex-1 mt-2 dark:bg-c4/40 bg-c4/50 text-white fx rounded-lg h-11"
                        key={key1}
                      >
                        {v}
                      </span>
                    )}
                  </>
                ))}
              </div>
            ))
          ) : (
            <Visible
              active={active}
              locked={locked}
              betList={betList}
              odds={odds}
              game={game}
              mkt={mkt}
              addGame={addGame}
            />
          )}
        </>
      )}
    </>
  );
};

const Visible = ({ active, odds, locked, betList, addGame, game, mkt }) => {
  const checklist = (list, odds) => {
    for (let i = 0; i < list.length; i++)
      if (list[i].id === game.event_id && list[i].mkt === mkt)
        return parseInt(list[i].v[0]);
    return Math.floor(odds.length / 2);
  };
  const [visible, setVisible] = useState(odds && checklist(betList, odds));
  const [open, setOpen] = useState(false);

  return (odds[visible] ? odds[visible] : [null, null, null]).map((v, key) =>
    key === 0 ? (
      <button
        className={`h-10 text-sm w-full rounded-md relative fx ${
          open ? "dark:bg-black/50" : "dark:bg-black bg-c5"
        }`}
        disabled={v ? false : true}
        onClick={() => setOpen(!open)}
        onBlur={() => setOpen(false)}
        key={key}
      >
        {v ? (
          <>
            {v}
            <BsCaretUpFill className="text-[12px] ml-1 dark:opacity-20 opacity-60" />
            {open && (
              <span className="absolute px-3 pt-0.5 rounded-xl no-bars dark:bg-c4 bg-white max-w-[60vw] whitespace-nowrap overflow-y-hidden overflow-x-scroll flex bottom-[110%] z-[20]">
                <ul className=" space-x-1 flex py-0.5">
                  {odds.map((odd, key2) => (
                    <li
                      key={key2}
                      className={`py-1 mb-1 dark:bg-black bg-c3 w-11 rounded-md ${
                        odd[0] === v ? "text-c2" : ""
                      }`}
                      onClick={() => setVisible(key2)}
                    >
                      {odd[0]}
                    </li>
                  ))}
                </ul>
              </span>
            )}
          </>
        ) : (
          <BiLockAlt className="opacity-60" />
        )}
      </button>
    ) : (
      <button
        disabled={locked(v)}
        onClick={() => addGame(v, `${visible}${key}`)}
        className={`bg-c3 active:scale-[3] duration-150 dark:bg-black h-10 text-sm w-full rounded-md relative fx ${
          active &&
          key === parseInt(active[1]) &&
          visible === parseInt(active[0]) &&
          "from-c1/75 to-c2/75 text-white bg-gradient-to-br"
        } `}
        key={key}
      >
        {v ? v.toFixed(2) : <BiLockAlt className="opacity-60" />}
      </button>
    )
  );
};

export default function Odds({
  className,
  game,
  slider,
  isLive,
  mkt = "1X2",
  first,
}) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentMkt = useMemo(
    () => market(first ? game?.periods?.num_1 : game?.periods?.num_0, mkt),
    [mkt]
  );

  return (
    <div className={"fx gap-1 relative " + className}>
      <Buttons
        game={game}
        mkt={mkt}
        key={mkt}
        currentMkt={currentMkt}
        isLive={isLive}
        type={!currentMkt.type}
      />
      {slider && (
        <span className="absolute mt-0.5 text-white/50 text-xs fx gap-7 bottom-[110%] ">
          {mkt}
        </span>
      )}
    </div>
  );
}
