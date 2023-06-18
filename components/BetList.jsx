import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
} from "framer-motion";
import React, { useContext, useMemo, useState, useEffect } from "react";
import { Context } from "./layout";
import Animated from "./Animated";
import {
  BiCheck,
  BiCog,
  BiEditAlt,
  BiFootball,
  BiTrashAlt,
  BiX,
} from "react-icons/bi";
import { alertService, appService } from "@/services";

const variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { ease: "easeInOut" },
  init2: { opacity: 0 },
  show2: { opacity: 1 },
  exit2: { opacity: 0 },
};

let childVariants = {
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
              onClick={() => setToggle(true)}
              whileTap={{ scale: 1.1 }}
              className={`absolute fx rounded-xl z-20 ${
                key
                  ? "h-[5px] w-12 bottom-[105%]"
                  : "bottom-[110%] py-2 bg-black px-4 shadow shadow-black"
              }`}
            >
              {key ? (
                <motion.span
                  animate={{
                    backgroundColor: ["#2406e6", "#06b6d4"],
                    transition: {
                      duration: 5,
                      repeatType: "mirror",
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                  className={"w-full rounded-xl h-full"}
                ></motion.span>
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
    if (Math.abs(v.velocity.x) > 800) {
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
      className={`relative flex items-center overflow-hidden ${
        dragStart && "bg-red-600 "
      }`}
      initial={{ height: "96px" }}
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
        className={`px-5 z-[1] absolute items-center h-full flex justify-between w-full `}
      >
        <span className="flex flex-col gap-2 flex-1">
          <span className="flex  justify-between w-full items-center text-c2">
            <span className="fx">
              <BiFootball /> {v.name}
              <span className="text-white ml-3 opacity-50">@{v.odd}</span>
            </span>
            {/* <span className="">{v.date_start}</span> */}
          </span>
          <span>
            {v.team1} <span className="text-c2">vs</span> {v.team2}
          </span>
        </span>
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

export default function BetList({ toggle, setToggle }) {
  const { betList, setBetList } = useContext(Context);
  const [placeBet, setPlaceBet] = useState(false);
  const [buttonText, setbuttonText] = useState("Place bet?");

  const [stake, setStake] = useState("");
  const totalOdds = useMemo(() => findTotalOdds(betList), [betList]);
  const potWin = useMemo(calcWinPotential, [stake]);

  function calcWinPotential() {
    return (totalOdds * parseFloat(stake === "" ? 0 : stake)).toFixed(2);
  }

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

  const buttonArray = [
    ["+1000", "+500", "+100", ".", 0, "00"],
    Array(9).fill(""),
  ];

  const removeGame = (index) => {
    let newBetList = betList.filter((v, key) => key !== index);
    setBetList(newBetList);
  };

  const submitBetSlip = async (e) => {
    e.stopPropagation();
    setbuttonText("Adding ticket");

    let newBetList = [];
    for (let i = 0; i < betList.length; i++)
      newBetList.push(`${betList[i].id},${betList[i].mkt},${betList[i].name}`);

    const data = await appService.placeBet({
      slip: newBetList.join("|"),
      odds: totalOdds,
      stake,
    });

    if (data) {
      alertService.success(data.message);
      setBetList([]);
      setToggle(false);

      setTimeout(() => {
        setPlaceBet(false);
      }, 500);
    }
  };

  return (
    <Animated
      variantKey="2"
      state={toggle}
      variants={variants}
      className="fixed inset-0 backdrop-blur-md z-30"
      onClick={() => setToggle(false)}
    >
      <motion.div
        layout
        variants={childVariants}
        className="absolute overflow-hidden bottom-0 max-h-[85%] inset-x-0 fx flex-col"
      >
        {/* <div className="absolute px-16 flex justify-between py-5 z-10 rounded-3xl top-0 w-full h-52 bg-black/90">
        <span>Cut</span>
        <span>1</span>
      </div> */}
        <motion.button
          onClick={setToggle}
          whileTap={{ scale: 0.75 }}
          className="h-2 w-12 z-20 absolute top-1 rounded-b-xl from-c1 to-c2 bg-gradient-to-r "
        ></motion.button>
        <header className="px-8 pt-8 bg-black pb-3 border-b-2 border-c4 text-lg justify-center w-full flex">
          <span
            onClick={(e) => e.stopPropagation()}
            className="fx absolute gap-4 opacity-60"
          >
            <BiEditAlt />
            <BiCog />
            <BiTrashAlt />
          </span>
          <span className="justify-between flex items-center w-full">
            <span>{betList.length} bets</span>
            <span className="fx gap-3">
              <span>{totalOdds}</span>
            </span>
          </span>
        </header>
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex-1 space-y-1 pb-4 overflow-x-hidden bg-black/80 overflow-y-scroll w-full"
        >
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
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex aft bg-black pt-2  flex-col relative w-full w-full-c after:bottom-[99%] after:h-12 after:from-transparent after:to-black after:w-full after:bg-gradient-to-b"
        >
          <div className="flex justify-between mb-3 px-4 items-center">
            <span className=" px-5 py-1.5 min-w-[100px] relative aft after:h-px after:top-0 after:inset-x-0 after:bg-gradient-to-r after:from-c1 after:to-c2 bef before:h-px before:bottom-0 before:inset-x-0 before:bg-gradient-to-r before:from-c1 before:to-c2  border-l-[1px] border-r-[1px] border-r-c2 fx border-l-c1">
              <span className="">{stake}</span>
              {stake.length < 1 && (
                <span className="opacity-20 absolute">min 10.00</span>
              )}
              <motion.span
                animate={{ opacity: [0, 0.2] }}
                transition={{ repeatType: "mirror", repeat: Infinity }}
                className=""
              >
                _
              </motion.span>
              {stake && (
                <button
                  onClick={() => buttonClicked("del")}
                  className="absolute left-[105%] bg-red-950 rounded-r-3xl after:rounded-r-3xl rounded-l-lg px-3 h-full aft after:w-1/2 after:right-0 after:bg-black/30 after:h-full after:top-0 text-xl"
                >
                  <BiX />
                </button>
              )}
            </span>
            <span className="">
              <span className="mr-3 opacity-30 text-sm">to Win</span>
              <span className="text-green-500 mr-2 text-xl ">{potWin}</span>
            </span>
          </div>
          <div className="gap-1 flex flex-col px-3 w-full overflow-hidden justify-center mb-4">
            {buttonArray.map((buttons, key) => (
              <div key={key} className="flex justify-center gap-1">
                {buttons.map((button, key2) => (
                  <button
                    key={key2}
                    className={`py-2 fx flex-[2] bg-slate-600/10 rounded-lg`}
                    onClick={() => buttonClicked(key ? key2 + 1 : button)}
                  >
                    {key ? key2 + 1 : button}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="h-12 h-full-c">
            <button className="w-1/3">Book bet</button>
            <button
              onClick={() => betList.length > 0 && setPlaceBet(true)}
              disabled={betList.length < 1}
              className="w-2/3 disabled:opacity-50 bg-gradient-to-r rounded-tl-[20px] from-c1/70 to-c2/50"
            >
              Place bet
            </button>
          </div>
        </div>
      </motion.div>
      <Animated
        onClick={(e) => {
          e.stopPropagation();
          setPlaceBet(false);
        }}
        variants={variants}
        state={placeBet}
        variantKey="2"
        className="inset-0 absolute z-10 flex items-end justify-center"
      >
        <motion.div
          variants={childVariants}
          className="fx flex-col w-full bg-black"
        >
          <span className="py-9 fx w-full" onClick={(e) => e.stopPropagation()}>
            {buttonText}
          </span>
          <div className="w-4/5 flex gap-2">
            <button
              onClick={submitBetSlip}
              className="bg-green-700 text-green-200 flex-1 fx gap-0.5 py-2 rounded-t-2xl"
            >
              <BiCheck /> Yes
            </button>
            <button
              onClick={() => setPlaceBet(false)}
              className="bg-red-700 text-red-200 flex-1 fx gap-0.5 py-2 rounded-t-2xl"
            >
              <BiX /> No
            </button>
          </div>
        </motion.div>
      </Animated>
    </Animated>
  );
}
