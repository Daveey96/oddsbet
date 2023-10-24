import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
} from "framer-motion";
import React, { useContext, useMemo, useState, useEffect, useRef } from "react";
import { Context } from "../layout";
import {
  BiCog,
  BiEditAlt,
  BiTrashAlt,
  BiUpArrow,
  BiUpArrowAlt,
  BiX,
  BiXCircle,
} from "react-icons/bi";
import Animated from "../global/Animated";
import Game from "./Game";
import Code, { ShareCode } from "./Code";
import { CircularLoader } from "../services/Loaders";
import {
  BsCaretUpFill,
  BsChevronDown,
  BsMenuUp,
  BsShare,
  BsTrash,
  BsUiChecks,
} from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa";
import { Naira } from "../layout/Nav";
import { condition, format } from "@/helpers";
import Link from "next/link";
import { overlayService } from "@/services";
import { betController } from "@/controllers";
import Retry from "../services/Retry";

export function calcWinPotential(totalOdds, stake) {
  return format(
    (totalOdds * parseFloat(stake === "" ? 0 : stake)).toFixed(2).toString()
  );
}

export function findTotalOdds(betList) {
  let total = 1;
  if (!betList) return 0;

  betList.forEach(({ odd }) => (total *= odd));

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
  const [stake, setStake] = useState(
    user?.balance ? Math.floor(user?.balance).toString() : "100"
  );
  const [share, setShare] = useState(false);
  const totalOdds = useMemo(() => findTotalOdds(betList), [betList]);
  const [betcodeLoad, setBetcodeLoad] = useState(betList.length > 0);
  const potWin = useMemo(
    () => calcWinPotential(stake, totalOdds),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stake, betList]
  );
  const div = useRef(null);

  const buttonClicked = (button) => {
    if (button === "clear") return setStake("");
    if (stake.length > 6) return;
    if (button.toString().slice(0, 1) === "+") {
      let s =
        parseInt(button.slice(1)) + parseFloat(stake === "" ? "0" : stake);
      return setStake(s.toString());
    }

    setStake(stake + button.toString());
  };

  const copy = (v) => {
    navigator.clipboard.writeText(v);
    alertService.success("Copied");
  };

  const removeGame = (index) => {
    let newBetList = betList.filter((v, key) => key !== index);
    setBetList(newBetList);
  };

  const getTicket = () => {
    let newBetList = [];
    let nBetList = [];

    betList.forEach(({ id, mkt, outcome, odd }) => {
      newBetList.push(`${id},${mkt},${outcome}`);
      nBetList.push({ id, mkt, outcome, odd });
    });

    return { tid: newBetList.join("|"), slip: nBetList };
  };

  const submitBetSlip = async (e) => {
    setPlaceBet(true);
    overlayService.lay();

    const { tid, slip } = getTicket();

    const data = await betController.placeBet({
      tid,
      slip,
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

  useEffect(() => {
    if (toggle) document.getElementById("betScroll").scrollTo(0, 2000);
  }, [toggle]);

  return (
    <>
      <AnimatePresence>
        {toggle && (
          <motion.div
            ref={div}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ ease: "anticipate" }}
            className={`z-[26] dark:bg-black text-white bg-c4 max-h-[80vh] pb-12 fixed inset-x-0 w-full -bottom-1 fx flex-col ${
              !betList.length && "rounded-t-[2rem]"
            }`}
          >
            <header
              onClick={() => setToggle(null)}
              className={`pt-3.5 pb-2 text-sm items-center relative justify-between w-full flex ${
                betList.length ? "bg-black/20 dark:bg-c4/20 px-3" : "mb-3 px-5"
              }`}
            >
              <span className="flex items-center gap-5">
                Betslip
                {betList.length ? (
                  <span className="relative fx aft after:w-6 after:h-6 text-c2 after:bg-c2/5 after:rounded-lg">
                    {betList.length}
                  </span>
                ) : (
                  <></>
                )}
              </span>
              {betList.length > 0 && (
                <span className="fx text-sm mt-1 gap-3.5">
                  {[<BsShare key={12} />, <BsTrash key={23} />].map(
                    (v, key) => (
                      <button
                        key={key}
                        className={` z-20 gap-1 active:scale-95 duration-150 flex-col rounded-md fx `}
                        onClick={(e) => {
                          e.stopPropagation();
                          !key ? setShare(true) : setBetList([]);
                        }}
                      >
                        <span
                          className={`w-6 h-6 rounded-md fx ${
                            !key
                              ? "dark:bg-c4 bg-c4/10"
                              : "text-red-600 bg-red-600/10"
                          }`}
                        >
                          {v}
                        </span>
                        <span className="text-10">
                          {key ? "clear All" : "share code"}
                        </span>
                      </button>
                    )
                  )}
                </span>
              )}
              <span className="absolute top-0 left-1/2 font-bold opacity-20 -translate-x-1/2 te text-3xl">
                <BsChevronDown />
              </span>
            </header>
            <motion.div
              id="betScroll"
              className="flex-1 relative no-bars overflow-x-hidden items-center overflow-y-scroll w-full"
              layout
            >
              <AnimatePresence>
                {betList.map((mv, key) => (
                  <Game
                    v={mv}
                    deleteGame={removeGame}
                    setToggle={() => setToggle(false)}
                    index={key}
                    key={`${mv.id}${mv.mkt}`}
                  />
                ))}
              </AnimatePresence>
              {betList.length > 0 && (
                <>
                  <div className="flex px-2 mt-3 mb-1 justify-between items-center">
                    <span
                      className={`relative flex items-center z-10 h-full flex-1`}
                    >
                      <button
                        className={`text-sm min-w-[80px] fx py-1 dark:border-c4/80 border-black/30 border-4 px-3 rounded-md`}
                      >
                        {stake && parseInt(stake) ? (
                          format(stake)
                        ) : (
                          <span className="opacity-50">min. 100</span>
                        )}
                      </button>
                    </span>
                    <span className=" mr-2 text-lg text-c2">{totalOdds}</span>
                  </div>
                  <div className="gap-1 text-white pt-3 pb-6 bg-black/20 dark:bg-c4/40 flex-col flex px-2 w-full overflow-hidden justify-center">
                    {[
                      ["+1000", "+500", "+100", "00", 0, ".", "clear"],
                      [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    ].map((buttons, key) => (
                      <div
                        key={key}
                        className="flex justify-center w-full gap-0.5"
                      >
                        {buttons.map((button, key2) => (
                          <button
                            key={key2}
                            className={`py-2 active:scale-75 duration-150 fx bg-black/40 dark:bg-c4/40 rounded-md ${
                              button === "." ? "flex-1" : "flex-[2]"
                            }`}
                            onClick={() => buttonClicked(button)}
                          >
                            {button}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
            <div className="w-full z-40 relative">
              <Animated
                init={{ y: 40, opacity: 0 }}
                show={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                state={!betcodeLoad}
                className={` fx mx-auto ${
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
                <div className="fx aft pb-4 after:bottom-[95%] after:h-8 after:from-transparent dark:after:to-black after:to-c4 after:bg-gradient-to-b after:inset-x-0 relative gap-4 z-10 pt-2 w-full ">
                  <button
                    onClick={() => betList.length > 0 && submitBetSlip()}
                    disabled={
                      betList.length > 0 && parseInt(stake) > 99 && !placeBet
                        ? false
                        : true
                    }
                    className="text-white active:scale-75 duration-150 fx disabled:opacity-50 px-5 pt-2 pb-1.5 mb-0.5 bg-gradient-to-r rounded-t-[20px] rounded-b-lg from-c1 to-c2"
                  >
                    <span className={placeBet ? "opacity-0" : ""}>
                      Place bet
                    </span>
                    {placeBet && (
                      <CircularLoader
                        depth={2}
                        className={"border-white absolute"}
                      />
                    )}
                  </button>
                  <span className={`fx absolute left-2 px-3 z-10 pb-0.5`}>
                    <span className="text-xs text-white whitespace-nowrap absolute bottom-[95%] opacity-75">
                      To Win
                    </span>
                    <span className={`text-xl text-c2`}>{potWin}</span>
                  </span>
                  <button
                    onClick={() => setBetcodeLoad(!betcodeLoad)}
                    className={`fx rounded-xl bg-c4/50 fx px-3 active:scale-90 duration-150 py-2 absolute right-3 z-10`}
                  >
                    enter code
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
                    onClick={() => key === 2 && copy(v.value)}
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
      <ShareCode
        state={share}
        variants={variants}
        getTicket={getTicket}
        close={() => setShare(false)}
      />
    </>
  );
}
