import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
} from "framer-motion";
import React, { useContext, useMemo, useState, useEffect, useRef } from "react";
import { Context } from "../layout";
import Animated, { BlurredModal } from "../Animated";
import {
  BiBookAdd,
  BiCheck,
  BiCheckCircle,
  BiEditAlt,
  BiFootball,
  BiShareAlt,
  BiTrashAlt,
  BiX,
  BiXCircle,
} from "react-icons/bi";
import { CircularLoader } from "../services/Loaders";
import Link from "next/link";
import { betController } from "@/controllers";
import {
  BsFillKeyboardFill,
  BsKeyboard,
  BsTicketDetailed,
  BsTicketFill,
} from "react-icons/bs";
import { FaTicketAlt } from "react-icons/fa";

const variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { ease: "easeInOut" },
  init2: { opacity: 0 },
  show2: { opacity: 1 },
  exit2: { opacity: 0 },
};

const childVariants = {
  init2: { y: "200%", opacity: 0 },
  show2: { y: "0%", opacity: 1, transition: { ease: "anticipate" } },
  exit2: { y: "200%", opacity: 0, transition: { ease: "easeInOut" } },
};

function findTotalOdds(betList) {
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

export const BetListButton = ({ toggle, setToggle }) => {
  const { betList, setBetList } = useContext(Context);
  const totalOdds = useMemo(() => findTotalOdds(betList), [betList]);

  return (
    <>
      {[0, 1].map((key) => {
        let pick = key ? betList.length > 0 : betList.length === 0;
        return (
          !pick &&
          !toggle && (
            <motion.button
              key={key}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e) => {
                e.stopPropagation();
                setToggle(true);
              }}
              whileTap={{ scale: 1.1 }}
              style={{ x: "-50%", left: "50%" }}
              className={`absolute fx rounded-xl z-20 ${
                key
                  ? "h-[6px] w-12 bottom-[106%]"
                  : "bottom-[110%] py-2 bg-black px-4 shadow shadow-black"
              }`}
            >
              {key ? (
                <span className="w-full from-c1 to-c2 bg-gradient-to-r rounded-t-xl rounded-b-sm h-full"></span>
              ) : (
                <>
                  <span className="flex border-r-2 border-c2 pr-3 mr-3">
                    {betList.length}
                  </span>
                  <span className="text-c2">{totalOdds}</span>
                </>
              )}
            </motion.button>
          )
        );
      })}
    </>
  );
};

const BetGame = ({ v, index, deleteGame }) => {
  const x = useMotionValue(0);
  const [dragStart, setDragStart] = useState(false);

  const dragEnded = (e, v) => {
    if (Math.abs(v.velocity.x) > 200) {
      animate(x, Math.sign(v.velocity.x) * e.view.outerWidth * 2, {
        duration: 0.5,
      });
      deleteGame(index);
    } else {
      setDragStart(false);
      animate(x, 0, { duration: 0.5 });
    }
  };

  return (
    <motion.div
      className={`relative w-full flex items-center overflow-hidden ${
        dragStart && "bg-red-600 "
      }`}
      initial={{ height: "84px" }}
      exit={{ height: "0px", transition: { duration: 0.1 } }}
    >
      <motion.div
        drag="x"
        onDragEnd={dragEnded}
        whileDrag={{
          backgroundColor: "rgba(0,0,0,1)",
          transition: { duration: 0 },
        }}
        style={{ x }}
        onDragStart={() => setDragStart(true)}
        className={`px-5 z-[1] w-full justify-between absolute items-center h-full flex `}
      >
        <span className="flex w-3/4 flex-col gap-1">
          <span className="flex w-full items-center text-c2">
            {/* {v.isLive && (
              <span className="px-3 mr-1 bg-green-500/10 text-green-500 pt-px text-sm pb-0.5 rounded-r-3xl">
                Live
              </span>
            )} */}
            <BiFootball className="mr-0.5 text-c1/60" />
            <span className="flex items-center gap-3">{v.outcome}</span>
          </span>
          <span className="w-full whitespace-nowrap text-ellipsis overflow-hidden">
            {v.home} <span className="text-c2">vs</span> {v.away}
          </span>
        </span>
        <span className="mr-2 fx text-white/60">{v.odd}</span>
      </motion.div>
      <div className="absolute flex w-full justify-between">
        {dragStart &&
          [0, 1].map((key) => (
            <span key={key} className="fx w-1/4 text-2xl">
              <BiTrashAlt />
            </span>
          ))}
      </div>
    </motion.div>
  );
};

export function calcWinPotential(totalOdds, stake) {
  let pWin = (totalOdds * parseFloat(stake === "" ? 0 : stake))
    .toFixed(2)
    .toString()
    .split(".");
  if (pWin[0].length < 4) return pWin.join(".");

  if (parseInt(pWin[0]) > 50000000) pWin[0] = "50000000";
  let arr = pWin[0].split("").reverse();
  let len = arr.length;
  let count = 0;

  while (len > 3) {
    count === 1 ? arr.splice(7, 0, ",") : arr.splice(3, 0, ",");
    count = 1;
    len -= 3;
  }

  return `${arr.reverse().join("")}.${pWin[1]}`;
}

const BetCode = ({ setBetList }) => {
  const input = useRef(null);
  const [value, setValue] = useState("");
  const [load, setLoad] = useState(false);

  const loadBet = async () => {
    setLoad(true);

    const data = await betController.loadBet({ code: value });

    if (data) {
      setBetList(data.games);
    } else {
      setValue("");
      setLoad(false);
    }
  };

  useEffect(() => {
    if (value.length === 5) loadBet();
  }, [value]);

  return (
    <div className="mt-3 mx-[20%] relative fx gap-4 mb-4">
      <input
        type="text"
        ref={input}
        placeholder="Enter code"
        className="py-3 disabled:opacity-30 duration-150 text-center w-full text-base border-gray-800 px-3 focus:border-c2 border-2 rounded-2xl h-full"
        maxLength={5}
        value={value}
        disabled={load}
        onChange={({ target }) => setValue(target.value)}
      />
      {value.length > 0 && !load && (
        <BiXCircle
          onClick={() => setValue("")}
          className={"absolute text-2xl right-2 text-red-600"}
        />
      )}
      {load && <CircularLoader className={"absolute right-2 border-c2"} />}
    </div>
  );
};

export default function BetList({ toggle, setToggle }) {
  const { user, setUser, betList, setBetList } = useContext(Context);
  const [placeBet, setPlaceBet] = useState(false);
  const [successful, setSuccessful] = useState("");
  const [buttonText, setbuttonText] = useState("Place bet?");
  const [keyboard, setkeyboard] = useState(false);

  const [stake, setStake] = useState("100");
  const totalOdds = useMemo(() => findTotalOdds(betList), [betList]);
  const potWin = useMemo(
    () => calcWinPotential(stake, totalOdds),
    [stake, betList]
  );
  const [betcodeLoad, setBetcodeLoad] = useState(betList.length > 0);

  const reset = () => {
    setSuccessful("");
    setbuttonText("Place bet?");
    setToggle(false);
  };

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
    e.stopPropagation();
    setbuttonText("Submitting ticket");

    let newBetList = [];
    let odds = [];

    betList.forEach((elem) => {
      newBetList.push(`${elem.id},${elem.mkt},${elem.outcome}`);
      odds.push(elem.odd);
    });
    const data = await betController.placeBet({
      slip: newBetList.join("|"),
      odds,
      totalOdds: parseFloat(totalOdds),
      stake: parseFloat(stake),
    });

    if (data) {
      setBetList([]);
      setUser({ ...user, balance: data.balance });
      setSuccessful({
        odds: data.odds,
        code: data.code,
        stake: data.stake,
        potWin: data.toWin,
      });
    } else {
      setPlaceBet(false);
      setbuttonText("Place bet?");
    }
  };

  const buttons = (key) => {
    if (key === 1) setBetList([]);

    if (key === 0 && betList.length > 0) {
    }
  };

  useEffect(() => {
    setBetcodeLoad(betList.length > 0);
  }, [betList]);

  useEffect(() => {
    window.addEventListener("click", () => {
      toggle && setToggle(false);
      console.log("yess");
    });
  }, []);

  useEffect(() => setStake(user?.balance ? user?.balance.toString() : ""), []);

  return (
    <AnimatePresence>
      {toggle && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ ease: "anticipate" }}
          className="z-[26] bg-black pb-12 rounded-t-[2rem] absolute inset-x-0 w-full bottom-0 fx flex-col "
          onClick={(e) => e.stopPropagation()}
        >
          <>
            <button
              onClick={() => setToggle(false)}
              className="h-2 absolute active:scale-75 duration-150 w-12 z-20 top-1 rounded-b-xl from-c1 to-c2 bg-gradient-to-r"
            ></button>
            <header className=" pt-4 text-sm justify-center w-full flex">
              <span
                onClick={(e) => e.stopPropagation()}
                className="fx text-base text-c2 absolute gap-0.5 opacity-60"
              >
                {[<BiEditAlt key={10} />, <BiTrashAlt key={12} />].map(
                  (i, key) => (
                    <button
                      className={`w-8 h-8 active:scale-95 active:bg-white/20 duration-150 rounded-full fx ${
                        key === 0 && !betcodeLoad
                          ? "bg-c2/10 active:bg-white/20"
                          : "bg-white/0"
                      }`}
                      key={key}
                      onClick={() => buttons(key)}
                    >
                      {i}
                    </button>
                  )
                )}
              </span>
              <span className="justify-between pb-3 ml-5 flex items-center w-full">
                <span>
                  {betList.length}{" "}
                  <span className="opacity-60">
                    bet{betList.length !== 1 && "s"}
                  </span>
                </span>
                <label
                  className="pr-5 mt-2 relative text-sm"
                  onBlur={() => setkeyboard(false)}
                >
                  <span
                    onClick={() => setkeyboard(!keyboard)}
                    className={`px-3 py-0.5 border-c2 text-white rounded-md border-2 ${
                      !stake && "text-opacity-50"
                    }`}
                  >
                    {stake ? stake : "min 100"}
                  </span>
                  <Animated
                    id="keyboard"
                    state={keyboard}
                    className={"absolute fx right-0 w-screen top-[130%] z-10"}
                    variants={{
                      init: { y: -10, x: 5, opacity: 0 },
                      show: { y: 0, x: 0, opacity: 1 },
                      exit: { y: -10, x: 5, opacity: 0 },
                    }}
                  >
                    <div className="gap-1 rounded-3xl py-3 bg-c4 flex flex-col px-3 w-[95%] overflow-hidden justify-center">
                      {/* <div className="flex justify-center gap-1">
                        <button
                          className={`py-1 active:scale-75 duration-150 fx flex-[2] bg-black/20 rounded-lg`}
                        >
                          <BiEditAlt />
                        </button>
                        <button
                          className={`py-1 active:scale-75 duration-150 fx flex-[2] bg-black/20 rounded-lg`}
                          onClick={() => buttonClicked("del")}
                        >
                          X
                        </button>
                        <button
                          className={`py-1 active:scale-75 duration-150 fx flex-[2] bg-green-500 rounded-lg`}
                          onClick={() => setkeyboard(false)}
                        >
                          Done
                        </button>
                      </div> */}
                      {[
                        ["+1000", "+500", "+100", ".", 0, "00"],
                        Array(9).fill(""),
                      ].map((buttons, key) => (
                        <div key={key} className="flex justify-center gap-1">
                          {buttons.map((button, key2) => (
                            <button
                              key={key2}
                              className={`py-1 active:scale-75 duration-150 fx flex-[2] bg-black/20 rounded-lg`}
                              onClick={() =>
                                buttonClicked(key ? key2 + 1 : button)
                              }
                            >
                              {key ? key2 + 1 : button}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </Animated>
                </label>
              </span>
            </header>
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-h-[60vh] items-center overflow-y-scroll w-full"
            >
              {betcodeLoad ? (
                <AnimatePresence>
                  {betList.map((mv, key) => (
                    <BetGame
                      v={mv}
                      deleteGame={removeGame}
                      index={key}
                      key={`${mv.id}${mv.mkt}`}
                    />
                  ))}
                </AnimatePresence>
              ) : (
                <BetCode setBetList={(v) => setBetList(v)} />
              )}
            </div>
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex relative items-center px-4 justify-between w-full "
            >
              {[0, 1].map((key) => (
                <button
                  className={`flex border-t-2 border-c4 ${
                    key ? "pr-1 pl-4 items-end" : "pr-4 pl-1 items-start"
                  } pt-1.5 text-10 text-white/50 flex-col ${
                    key === 0 ? "" : "order-3"
                  }`}
                  key={key}
                >
                  {key && "to Win"}
                  <span
                    className={`${key ? "text-c2" : "text-white"} text-base`}
                  >
                    {key ? potWin : betList.length > 1 && totalOdds}
                  </span>
                </button>
              ))}
              <button
                onClick={() => betList.length > 0 && setPlaceBet(true)}
                disabled={
                  betList.length > 0 && parseInt(stake) > 99 ? false : true
                }
                className="order-2 disabled:opacity-50 px-5 py-2 bg-gradient-to-r rounded-t-[20px] rounded-b-lg from-c1 to-c2"
              >
                Place bet
              </button>
            </div>
          </>
          {/* <Animated
            onClick={(e) => {
              e.stopPropagation();
              setPlaceBet(false);
            }}
            variants={variants}
            state={placeBet}
            variantKey="2"
            layout
            className="inset-0 absolute bg-black/80 z-10 flex items-end justify-center"
          >
            <motion.div
              variants={childVariants}
              className="fx flex-col w-full bg-black"
            >
              {successful ? (
                <>
                  <h3 className="relative fx mt-7 mb-4">
                    <BiCheckCircle className="text-white -left-4 opacity-10 absolute scale-[2] text-xl" />
                    <span className="z-10">Bet Successful</span>
                  </h3>
                  <div className="flex flex-col mt-4 px-10 w-full">
                    {[
                      { title: "Odds", value: successful.odds },
                      { title: "Stake", value: successful.stake },
                      { title: "Potential Win", value: successful.potWin },
                      { title: "Code", value: successful.code },
                    ].map((v, key) => {
                      return (
                        <div
                          key={key}
                          className="py-3 justify-between items-center flex flex-1 w-full"
                        >
                          <span className="text-white/50">{v.title}</span>
                          {key === 3 ? (
                            <span className="fx text-c2 gap-2">
                              <BiShareAlt />
                              <span>{v.value}</span>
                            </span>
                          ) : (
                            <span className="text-c2">{v.value}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div
                    onClick={(e) => e.preventDefault()}
                    className="flex gap-2 h-12 mb-2 mt-7 w-full px-8"
                  >
                    <Link
                      href={"/bets"}
                      onClick={reset}
                      className="fx h-full w-3/4 px-14 rounded-lg bg-c2/10 text-c2"
                    >
                      view bets
                    </Link>
                    <button
                      onClick={reset}
                      className="h-full bg-red-600/10 text-xl text-red-600 px-8 flex-1 rounded-lg"
                    >
                      <BiXCircle />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span
                    className="py-9 fx w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {buttonText}
                  </span>
                  <div className="w-4/5 flex gap-2">
                    <button
                      onClick={submitBetSlip}
                      className="bg-green-500/10 text-green-500 flex-1 fx gap-0.5 py-2 rounded-t-2xl"
                    >
                      {buttonText === "Place bet?" ? (
                        <>
                          <BiCheck /> Yes
                        </>
                      ) : (
                        <CircularLoader
                          depth={2}
                          className={"border-green-400"}
                        />
                      )}
                    </button>
                    <button
                      onClick={() => setPlaceBet(false)}
                      className="bg-red-500/10 text-red-500 flex-1 fx gap-0.5 py-2 rounded-t-2xl"
                    >
                      <BiX /> No
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </Animated> */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
