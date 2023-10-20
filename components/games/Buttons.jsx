import React, { useContext, useMemo, useState } from "react";
import { BiLockAlt } from "react-icons/bi";
import { Context } from "../layout";
import { condition, mktDb } from "@/helpers";
import { BsCaretUpFill } from "react-icons/bs";
import { motion } from "framer-motion";

const Visible = ({ active, odds, locked, tags, addGame, game }) => {
  const [visible, setVisible] = useState(odds && parseInt(odds.length / 2));
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
              <span className="absolute px-3 pt-0.5 no-bars  max-w-[60vw] whitespace-nowrap overflow-y-hidden overflow-x-scroll flex bottom-[110%] z-[20]">
                <motion.ul
                  variants={{ init: { y: 10 }, show: { y: 0 } }}
                  transition={{ staggerChildren: 0.05 }}
                  initial="init"
                  animate="show"
                  className=" space-x-1 flex py-0.5"
                >
                  {odds.map((odd, key2) => (
                    <motion.li
                      key={key2}
                      variants={{
                        init: { y: 10, opacity: 0 },
                        show: { y: 0, opacity: 1 },
                      }}
                      className={`py-1 mb-1 dark:bg-black bg-c3 w-11 rounded-md ${
                        odd[0] === v ? "text-c2" : ""
                      }`}
                      onClick={() => setVisible(key2)}
                    >
                      {odd[0]}
                    </motion.li>
                  ))}
                </motion.ul>
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
        onClick={() => addGame(v, key, odds[visible][0])}
        className={`bg-c3 active:scale-[3] duration-150 dark:bg-black h-10 text-sm w-full rounded-md relative fx ${
          active === `${tags[key]} ${odds[visible] && odds[visible][0]}` &&
          "from-c1/75 to-c2/75 text-white bg-gradient-to-br"
        } `}
        key={key}
      >
        {v ? (
          <span
            className={
              game.rocketOdds &&
              (active &&
              key === parseInt(active[1]) &&
              visible === parseInt(active[0])
                ? "text-white"
                : "text-orange-600 font-bold")
            }
          >
            {v.toFixed(2)}
          </span>
        ) : (
          <BiLockAlt className="opacity-60" />
        )}
      </button>
    )
  );
};

export const Buttons = ({ odds, game, mkt, slider, isLive, main }) => {
  const { betList, setBetList } = useContext(Context);
  const [active, setActive] = useState(undefined);
  const { type, tags, out, text } = mktDb(mkt, game);

  const activate = () => {
    for (let i = 0; i < betList.length; i++)
      if (betList[i].id === game.event_id && betList[i].mkt === mkt)
        return setActive(
          !type || type === 2 ? betList[i].key : betList[i].outcome
        );
    setActive(undefined);
  };

  const addGame = (odd, key, point) => {
    let newBetList = betList.filter(
      (g) => g.id !== game.event_id || g.mkt !== mkt
    );

    let mkey = condition(
      type,
      [1, 3, 4, "*"],
      [
        `${tags && tags[key]} ${point}`,
        point ? `${key} by ${point}` : key,
        `${tags && tags[key]} (${point})`,
        key,
      ]
    );

    if (active === mkey) {
      setBetList(newBetList);
      setActive(undefined);
      return;
    }
    const { event_id, home, away, rocketOdds, starts, sport_id } = game;

    setActive(mkey);
    setBetList([
      ...newBetList,
      {
        id: event_id,
        sport_id,
        outcomeName: text,
        outcome: condition(
          type,
          [undefined, 2, "*"],
          [
            out ? out[key] : tags && tags[key],
            out ? `${key} ${out}` : key,
            mkey,
          ]
        ),
        home,
        away,
        key,
        point,
        time: starts,
        odd: parseFloat(odd).toFixed(2),
        mkt,
        rOdds: rocketOdds,
      },
    ]);
  };

  const handicap = (v) =>
    `${Math.sign(parseInt(v)) === 1 ? parseInt(v) : 0} - ${
      Math.sign(parseInt(v)) === -1 ? Math.abs(parseInt(v)) : 0
    }`;

  const locked = (v) => !v || v < 1.01;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(activate, [mkt, betList]);

  return (
    <>
      {!type &&
        odds.map((odd, key) => (
          <button
            key={key}
            disabled={locked(odd)}
            onClick={() => addGame(odd, key)}
            className={`active:scale-110 rounded-md duration-150 flex-1 relative fx ${
              key === active &&
              "dark:from-c1/90 from-c1 to-c2 dark:to-c2/90 bg-gradient-to-br text-white"
            } ${
              main ? "gap-2 dark:bg-c4/80 bg-c3 fx h-11" : "dark:bg-black h-10"
            } ${slider ? "bg-c5" : isLive ? "bg-c4/80" : "bg-c3"}`}
          >
            {main && tags && (
              <span className="text-11 fx mr-2 gap-2 text-c2 bottom-[105%]">
                {tags[key]}
              </span>
            )}
            {!locked(odd) ? (
              <span
                className={
                  game.rocketOdds &&
                  (key === active ? "text-white" : "text-orange-600 font-bold")
                }
              >
                {odd.toFixed(2)}
              </span>
            ) : (
              <BiLockAlt className="opacity-60" />
            )}
          </button>
        ))}
      {type === 1 && (
        <>
          {main ? (
            odds.map((odd, key) => (
              <div
                key={key}
                className="flex first-of-type:mt-3 gap-2 px-4 w-full"
              >
                {odd.map((v, key1) =>
                  key1 ? (
                    <button
                      className={`flex-1 mt-2 relative active:scale-110 duration-150 dark:bg-c4/80 bg-c3 fx rounded-lg h-11 ${
                        active === `${tags[key1]} ${odd[0]}` &&
                        "from-c1/75 to-c2/75 text-white bg-gradient-to-br"
                      }`}
                      key={key1}
                      onClick={() => addGame(v, key1, odd[0])}
                    >
                      {v.toFixed(2)}
                      {!key && (
                        <span className="bottom-[110%] text-xs absolute dark:opacity-25 opacity-60">
                          {tags[key1]}
                        </span>
                      )}
                    </button>
                  ) : (
                    <span
                      className="w-[25%] relative mt-2 dark:bg-c4/40 bg-c4/30 fx rounded-lg h-11"
                      key={key1}
                    >
                      {v}
                      {!key && (
                        <span className="bottom-[110%] absolute text-xs dark:opacity-25 opacity-60">
                          {tags[key1]}
                        </span>
                      )}
                    </span>
                  )
                )}
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
              tags={tags}
            />
          )}
        </>
      )}
      {type === 2 && (
        <div className="w-full fx gap-[2.5%] px-[2.5%] flex-wrap">
          {odds.map(
            (odd, key) =>
              odd[1] && (
                <button
                  key={key}
                  disabled={locked(odd[1])}
                  onClick={() => addGame(odd[1], odd[0])}
                  className={`active:scale-110 flex-1 py-1.5 mb-2 flex-col rounded-md duration-150 relative fx ${
                    odd[0] === active &&
                    "dark:from-c1/90 from-c1 to-c2 dark:to-c2/90 bg-gradient-to-br text-white"
                  } bg-c3 dark:bg-c4/80 ${
                    odds.filter((v) => v[1]).length === 4
                      ? "basis-[45%]"
                      : "basis-[30%] max-w-[32%]"
                  }`}
                >
                  <span className="text-11 mb-1 text-c2">{odd[0]}</span>
                  {!locked(odd[1]) ? (
                    <span
                      className={
                        game.rocketOdds &&
                        (key === active
                          ? "text-white"
                          : "text-orange-600 font-bold")
                      }
                    >
                      {odd[1].toFixed(2)}
                    </span>
                  ) : (
                    <BiLockAlt className="opacity-60" />
                  )}
                </button>
              )
          )}
        </div>
      )}
      {type === 3 && (
        <>
          {odds[0].map((odd, key) => (
            <div
              key={key}
              className="flex first-of-type:mt-3 gap-2 px-4 w-full"
            >
              {odd.map((v, key1) =>
                key1 ? (
                  <button
                    className={`flex-1 mt-2 relative active:scale-110 duration-150 dark:bg-c4/80 bg-c3 fx rounded-lg h-11 ${
                      active === `${tags[key1]} by ${odd[0]}` &&
                      "from-c1/75 to-c2/75 text-white bg-gradient-to-br"
                    }`}
                    key={key1}
                    onClick={() => addGame(v, tags[key1], odd[0])}
                  >
                    {v ? v.toFixed(2) : <BiLockAlt className="opacity-60" />}
                    {!key && (
                      <span className="bottom-[110%] text-xs absolute dark:opacity-25 opacity-60">
                        {key1 === 1 ? "home" : "away"}
                      </span>
                    )}
                  </button>
                ) : (
                  <span
                    className="w-[25%] relative mt-2 dark:bg-c4/40 bg-c4/30 fx rounded-lg h-11"
                    key={key1}
                  >
                    {v}
                    {!key && (
                      <span className="bottom-[110%] text-xs absolute dark:opacity-25 opacity-60">
                        points
                      </span>
                    )}
                  </span>
                )
              )}
            </div>
          ))}
          <div className="flex px-4 gap-3 mt-2">
            {odds[2].map(
              (odd, key) =>
                odd[1] && (
                  <button
                    key={key}
                    disabled={locked(odd[1])}
                    onClick={() => addGame(odd[1], odd[0])}
                    className={`active:scale-110 py-1.5 mb-2 flex-col flex-1 rounded-md duration-150 relative fx ${
                      odd[0] === active &&
                      "dark:from-c1/90 from-c1 to-c2 dark:to-c2/90 bg-gradient-to-br text-white"
                    } bg-c3 dark:bg-c4/80 `}
                  >
                    <span className="text-11 mb-1 text-c2">
                      {odd[0].includes("Any Score Draw")
                        ? "Any Score Draw except 0-0"
                        : odd[0]}
                    </span>
                    {!locked(odd[1]) ? (
                      <span
                        className={
                          game.rocketOdds &&
                          (key === active
                            ? "text-white"
                            : "text-orange-600 font-bold")
                        }
                      >
                        {odd[1].toFixed(2)}
                      </span>
                    ) : (
                      <BiLockAlt className="opacity-60" />
                    )}
                  </button>
                )
            )}
          </div>
        </>
      )}
      {type === 4 &&
        odds.map((odd, key) => (
          <div key={key} className="flex first-of-type:mt-3 gap-2 px-4 w-full">
            {odd.map((v, key1) =>
              key1 ? (
                <button
                  className={`flex-1 mt-2 relative active:scale-110 duration-150 dark:bg-c4/80 bg-c3 fx rounded-lg h-11 ${
                    active === `${tags[key1]} (${handicap(odd[0])})` &&
                    "from-c1/75 to-c2/75 text-white bg-gradient-to-br"
                  }`}
                  key={key1}
                  onClick={() => addGame(v, key1, handicap(odd[0]))}
                >
                  {v ? v.toFixed(2) : null}
                  {!key && (
                    <span className="bottom-[110%] text-xs absolute dark:opacity-25 opacity-60">
                      {tags[key]}
                    </span>
                  )}
                </button>
              ) : (
                <span
                  className="flex-1 relative mt-2 dark:bg-c4/40 bg-c4/30 fx rounded-lg h-11"
                  key={key1}
                >
                  {handicap(v)}
                  {!key && (
                    <span className="bottom-[110%] absolute text-xs dark:opacity-25 opacity-60">
                      points
                    </span>
                  )}
                </span>
              )
            )}
          </div>
        ))}
    </>
  );
};
