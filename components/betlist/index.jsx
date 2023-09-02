import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
} from "framer-motion";
import React, { useContext, useMemo, useState, useEffect, useRef } from "react";
import { Context } from "../layout";
import { BiCog, BiEditAlt, BiTrashAlt, BiX, BiXCircle } from "react-icons/bi";
import Animated from "../Animated";
import Game from "./Game";
import Code from "./Code";
import { CircularLoader } from "../services/Loaders";
import { BsUiChecks } from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa";
import { Naira } from "../layout/Nav";
import { condition, format } from "@/helpers";
import Link from "next/link";
import { overlayService } from "@/services";
import { betController } from "@/controllers";

export function calcWinPotential(totalOdds, stake) {
  return format(
    (totalOdds * parseFloat(stake === "" ? 0 : stake)).toFixed(2).toString()
  );
}

export function findTotalOdds(betList) {
  let total = 0;
  if (!betList) return 0;
  for (let i = 0; i < betList.length; i++)
    i === 0 || betList[i].odd >= 2 || total > 1.99
      ? betList[i].odd >= 2 && total < 2 && i !== 0
        ? (total += parseFloat(betList[i].odd - 1))
        : (total += parseFloat(betList[i].odd))
      : (total += parseFloat(betList[i].odd - 1));

  return total.toFixed(2);
}

const variants = {
  transition: { ease: "easeInOut" },
  init2: { opacity: 0 },
  show2: { opacity: 1 },
  exit2: { opacity: 0 },
};

export default function BetList({ toggle, setToggle }) {
  const { game, setGame, user, setUser, betList, setBetList, setPing } =
    useContext(Context);
  const [successful, setSuccessful] = useState(null);
  const [placeBet, setPlaceBet] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const [stake, setStake] = useState(
    user?.balance ? user?.balance.toString() : "100"
  );
  const totalOdds = useMemo(() => findTotalOdds(betList), [betList]);
  const [betcodeLoad, setBetcodeLoad] = useState(betList.length > 0);
  const potWin = useMemo(
    () => calcWinPotential(stake, totalOdds),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stake, betList]
  );
  const y = useMotionValue(0);
  const div = useRef(null);

  const buttonClicked = (button) => {
    if (button === "del") {
      const s = stake.slice(0, -1);
      return setStake(s);
    }
    if (stake.length > 6) return;
    if (button.toString().slice(0, 1) === "+") {
      let s =
        parseInt(button.slice(1)) + parseFloat(stake === "" ? "0" : stake);
      return setStake(s.toString());
    }

    setStake(stake + button.toString());
  };

  const removeGame = (index) => {
    let newBetList = betList.filter((v, key) => key !== index);
    setBetList(newBetList);
  };

  const submitBetSlip = async (e) => {
    setPlaceBet(true);
    overlayService.lay();

    let newBetList = [];
    let nBetList = [];

    betList.forEach(({ id, mkt, outcome, odd }) => {
      newBetList.push(`${id},${mkt},${outcome}`);
      nBetList.push({ id, mkt, outcome, odd });
    });

    const data = await betController.placeBet({
      tid: newBetList.join("|"),
      slip: nBetList,
      totalOdds: parseFloat(totalOdds),
      stake: parseFloat(stake),
    });

    if (data) {
      setToggle(false);
      setBetList([]);
      setUser({ ...user, balance: data.balance });
      game && setGame(null);
      setSuccessful({
        code: data.code,
        stake: data.stake,
        potWin: data.toWin,
      });
      setPing(true);
    }

    setPlaceBet(false);
    overlayService.clear();
  };

  useEffect(() => {
    setBetcodeLoad(betList.length > 0);
  }, [betList]);

  const dragEnded = (e, v) => {
    if (v.offset.y > 100) {
      animate(y, div.current.clientHeight + 50, { duration: 0.15 });
      setTimeout(() => setToggle(false), 200);
    } else animate(y, 0, { duration: 0.25 });
  };

  return (
    <>
      <AnimatePresence>
        {toggle && (
          <motion.div
            drag="y"
            ref={div}
            style={{ y }}
            dragElastic={0.1}
            onDragEnd={dragEnded}
            dragConstraints={{ top: 0 }}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ ease: "anticipate" }}
            onClick={(e) => e.stopPropagation()}
            className="z-[26] dark:bg-black text-white bg-c4 max-h-[calc(92vh_-_100px)] pb-12 rounded-t-[2rem] absolute inset-x-0 w-full bottom-0 fx flex-col "
          >
            <header className="pt-4 pb-2 text-sm relative justify-center w-full flex">
              {betList.length > 0 && (
                <span className="fx text-sm mt-1 absolute gap-2.5">
                  <button
                    className={`w-6 h-6 z-20 active:scale-95 duration-150 rounded-md fx ${
                      !betcodeLoad ? "bg-c1 text-c2" : "dark:bg-c4 bg-c4/10"
                    }`}
                    onClick={() => setBetcodeLoad(!betcodeLoad)}
                  >
                    <BiEditAlt />
                  </button>
                  <button
                    className={`w-6 h-6 z-20 active:scale-95 duration-150 rounded-md fx ${
                      !betcodeLoad ? "bg-c1 text-c2" : "dark:bg-c4 bg-c4/10"
                    }`}
                    onClick={() => setBetcodeLoad(!betcodeLoad)}
                  >
                    <BiCog />
                  </button>
                  <button
                    className={`w-6 h-6 z-20 active:scale-95 dark:bg-c4 bg-c4/10 duration-150 rounded-md fx `}
                    onClick={() => setBetList([])}
                  >
                    <BiTrashAlt />
                  </button>
                </span>
              )}
              <span className="justify-between relative mb-1 px-5 h-8 flex items-end w-full">
                <span className="mb-px">
                  {betList.length ? betList.length : "No active"}{" "}
                  <span className="opacity-60">
                    bet{betList.length !== 1 && "s"}
                  </span>
                </span>
                {betList.length > 0 && (
                  <label
                    onFocus={() => !keyboard && setKeyboard(true)}
                    onBlur={() => keyboard && setKeyboard(false)}
                    className=" text-sm"
                  >
                    <button
                      className={`px-3 relative min-w-[70px] py-0.5 border-c2 rounded-md border-[3px] ${
                        !stake && "text-opacity-50"
                      }`}
                    >
                      {stake ? format(stake) : "min 100"}
                      <span className="text-xs text-white absolute bottom-[130%] right-0 bg-c2 rounded-t-xl rounded-bl-xl px-3 pt-0.5 pb-px">
                        stake
                      </span>
                    </button>
                    <Animated
                      id="keyboard"
                      state={keyboard}
                      className={"absolute fx right-0 w-screen top-[130%] z-10"}
                      variants={{
                        init: { y: -7, x: 5, opacity: 0 },
                        show: { y: 0, x: 0, opacity: 1 },
                        exit: { y: -7, x: 5, opacity: 0 },
                      }}
                    >
                      <div className="gap-1 text-white flex-col rounded-2xl py-2 bg-c4 flex px-2 w-[95%] overflow-hidden justify-center">
                        {[
                          ["+1000", "+500", "+100", "00", 0, ".", "cancel"],
                          [1, 2, 3, 4, 5, 6, 7, 8, 9, "done"],
                        ].map((buttons, key) => (
                          <div
                            key={key}
                            className="flex justify-center w-full gap-1"
                          >
                            {buttons.map((button, key2) =>
                              condition(
                                button,
                                ["done", "cancel", "*"],
                                [
                                  <button
                                    key={key2}
                                    className={`py-1 active:scale-75 px-3 duration-150 fx bg-white/5 rounded-lg`}
                                    onClick={() =>
                                      setTimeout(() => setKeyboard(false), 100)
                                    }
                                  >
                                    Done
                                  </button>,
                                  <button
                                    key={key2}
                                    className={`py-1 bg-red-600 text-lg active:scale-75 duration-150 fx px-3 rounded-lg`}
                                    onClick={() => buttonClicked("del")}
                                  >
                                    <BiX />
                                  </button>,
                                  <button
                                    key={key2}
                                    className={`py-1 active:scale-75 duration-150 fx bg-black/40 rounded-lg ${
                                      button === "." ? "flex-1" : "flex-[2]"
                                    }`}
                                    onClick={() => buttonClicked(button)}
                                  >
                                    {button}
                                  </button>,
                                ]
                              )
                            )}
                          </div>
                        ))}
                      </div>
                    </Animated>
                  </label>
                )}
              </span>
              <button
                onClick={() => setToggle(false)}
                className="h-2 absolute active:scale-75 duration-150 w-12 z-20 top-0.5 rounded-b-xl from-c1 to-c2 bg-gradient-to-r"
              ></button>
            </header>
            {betList.length > 0 && (
              <div className="w-[94%] text-white mr-1 flex justify-start items-center text-xs from-c1 to-c2 bg-gradient-to-r rounded-md py-1 px-3">
                Add more to get bigger bonuses
              </div>
            )}
            <motion.div
              className="flex-1 relative pb-2 no-bars overflow-x-hidden items-center overflow-y-scroll w-full"
              layout
            >
              <AnimatePresence>
                {betList.map((mv, key) => (
                  <Game
                    v={mv}
                    deleteGame={removeGame}
                    index={key}
                    key={`${mv.id}${mv.mkt}`}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
            <div className="w-full z-40 relative">
              <Animated
                init={{ y: 40, opacity: 0 }}
                show={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                state={!betcodeLoad}
                className={` fx ${
                  betList.length < 1
                    ? "relative pb-3"
                    : "absolute bottom-full from-transparent dark:via-black dark:to-black via-c4 to-c4 bg-gradient-to-b flex-col inset-x-0 pb-3"
                }`}
              >
                <Code
                  len={betList.length < 1}
                  setBetList={(v) => setBetList(v)}
                />
              </Animated>
              {betList.length > 0 && (
                <div className="fx aft after:bottom-[95%] after:h-8 after:from-transparent dark:after:to-black after:to-c4 after:bg-gradient-to-b after:inset-x-0 relative px-4 z-10 pt-2 w-full ">
                  {betList.length > 0 && (
                    <>
                      <button
                        className={`fx text-base text-c2 h-full pr-6 pl-2 right-0 absolute`}
                      >
                        {betList.length > 1 && totalOdds}
                      </button>
                      <span
                        className={`fx flex-col z-10 h-full absolute left-0 pr-5 pl-3`}
                      >
                        <span className="text-xs text-white whitespace-nowrap absolute bottom-[95%] left-0 bg-c1 rounded-r-xl rounded-tl-xl px-3 pt-0.5 pb-px">
                          To Win
                        </span>
                        <span className={`text-base`}>{potWin}</span>
                      </span>
                    </>
                  )}
                  <button
                    onClick={() => betList.length > 0 && submitBetSlip()}
                    disabled={
                      betList.length > 0 && parseInt(stake) > 99 && !placeBet
                        ? false
                        : true
                    }
                    className="order-2 text-white active:scale-75 duration-150 fx disabled:opacity-50 px-5 pt-2 pb-1.5 mb-0.5 bg-gradient-to-r rounded-t-[20px] rounded-b-lg from-c1 to-c2"
                  >
                    <span className={placeBet ? "opacity-0" : ""}>
                      {" "}
                      Place bet
                    </span>
                    {placeBet && (
                      <CircularLoader
                        depth={2}
                        className={"border-white absolute"}
                      />
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Animated
        onClick={() => setSuccessful(null)}
        variants={variants}
        state={successful}
        variantKey="2"
        layout
        className="inset-0 absolute bg-black/80 z-[47] fx"
      >
        <motion.div
          variants={{
            init2: { y: 30 },
            show2: { y: 0 },
            exit2: { y: 30 },
          }}
          onClick={(e) => e.stopPropagation()}
          className="fx overflow-hidden mt-4 flex-col w-[94%] relative rounded-[30px] bg-c4"
        >
          <button
            onClick={() => setSuccessful(null)}
            className="absolute left-2 top-2 text-white/20 text-xl scale-[1.5] p-3"
          >
            <BiXCircle />
          </button>
          <h3 className="fx mt-3 gap-1">
            <BsUiChecks className="text-c2 text-2xl" />
            <span className="z-10 flex flex-col text-sm items-start leading-4 ">
              Bet <span> Successful</span>
            </span>
          </h3>
          <div className="flex flex-col text-sm mt-4 px-[8vw] w-full">
            {[
              { title: "Total Stake", value: successful?.stake },
              { title: "To Win", value: successful?.potWin },
              { title: "Booking Code", value: successful?.code },
            ].map((v, key) => {
              return (
                <div
                  key={key}
                  className="py-3 justify-between items-center flex flex-1 w-full"
                >
                  <span className="text-white/70">{v.title} -</span>
                  <span
                    className={`py-0.5 ${condition(
                      key,
                      [0, 1, 2],
                      [
                        "text-white ",
                        "aft relative fx after:w-[250%] after:h-full after:from-transparent after:to-transparent after:via-c2/10 after:bg-gradient-to-r",
                        "fx gap-2",
                      ]
                    )}`}
                  >
                    {key === 1 && <Naira className={"text-c2 mr-1"} />}
                    {key === 2
                      ? v.value
                      : v.value
                      ? format(v?.value?.toString())
                      : ""}
                    {key === 2 && <FaRegCopy className="text-c2" />}
                  </span>
                </div>
              );
            })}
          </div>
          <Link
            href={"/bets"}
            onClick={() => setSuccessful(null)}
            className="fx h-full w-3/4 px-14 mb-3 pt-3 pb-2 bg-gradient-to-r rounded-lg from-transparent to-transparent via-c2/10 text-c2"
          >
            Go to bets {">"}
          </Link>
        </motion.div>
      </Animated>
    </>
  );
}
