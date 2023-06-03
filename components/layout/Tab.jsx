import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { Context } from ".";
import Animated from "../Animated";
import {
  BiChevronDownCircle,
  BiCog,
  BiDownArrow,
  BiDownArrowAlt,
  BiEditAlt,
  BiFootball,
  BiTrashAlt,
  BiX,
  BiXCircle,
} from "react-icons/bi";

const variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { ease: "easeInOut" },
  init2: { opacity: 0 },
  show2: { opacity: 1 },
  exit2: { opacity: 0 },
};

export default function Tab() {
  const { pathname, events } = useRouter();
  const [pathName, setPathName] = useState(pathname);
  const [toggle, setToggle] = useState(false);
  const { betList, setBetList } = useContext(Context);
  const totalOdds = useMemo(findTotalOdds, [betList]);

  function findTotalOdds() {
    let total = 0;
    for (let i = 0; i < betList.length; i++)
      total += parseFloat(betList[i].currentmkt);

    return total.toFixed(2);
  }

  const links = [
    {
      src: "/logo.svg",
      path: "/",
      size: 25,
      text: "home",
      iconProps: [
        "1.9em",
        "0 0 210 297",
        <path d="m32.988 148.47a72.811 72.412 78.366 0 1 42.845-81.766 72.811 72.412 78.366 0 1 88.178 26.669 72.811 72.412 78.366 0 1-8.8519 92.047 72.811 72.412 78.366 0 1-91.591 8.8161" />,
      ],
    },
    {
      src: "/search.svg",
      path: "/search",
      size: 30,
      text: "search",
      iconProps: [
        "1.5em",
        "0 0 24 24",
        <>
          <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
          <path d="M11.412 8.586c.379.38.588.882.588 1.414h2a3.977 3.977 0 0 0-1.174-2.828c-1.514-1.512-4.139-1.512-5.652 0l1.412 1.416c.76-.758 2.07-.756 2.826-.002z"></path>
        </>,
      ],
    },
    {
      src: "/openbets.svg",
      path: "/bets",
      size: 38,
      text: "open bets",
      iconProps: [
        "2em",
        "0 0 34.804 34.804",
        <path d="M29.235 18.167h-1l-4e-3 -8.381-12.673 5e-3 -0.08701 1e-3h-1.285l-2.253 1e-3 -0.08701-1e-3h-1.75l5.375-4.125v3.125l13.758-6e-3zm-26.732 6.5729 29.801-9e-3 -29.801 9e-3 -2e-3 -14.665zm19.92-7.339c0-2.771-2.248-5.021-5.022-5.021-2.774 2e-3 -5.024 2.25-5.022 5.023 2e-3 2.774 2.25 5.021 5.024 5.021 2.772 1e-3 5.022-2.249 5.02-5.023zm-2.623 8e-3c0.304 0.257 0.457 0.722 0.455 1.396 0 0.73-0.164 1.242-0.494 1.533-0.332 0.297-0.907 0.44-1.729 0.441l-0.24 5e-3v0.771l-0.786 3e-3v-0.772l-0.222-3e-3c-0.822 0-1.396-0.141-1.73-0.421-0.334-0.283-0.501-0.771-0.501-1.465l4e-3 -0.237 1.163 1e-3v0.12c0 0.424 0.068 0.696 0.205 0.82 0.134 0.122 0.437 0.187 0.906 0.186l0.171 7e-3 2e-3 -1.869c-0.917 2e-3 -1.543-0.133-1.879-0.396-0.334-0.268-0.502-0.762-0.502-1.491 2e-3 -0.704 0.168-1.188 0.504-1.448s0.962-0.392 1.875-0.391l2e-3 -0.671 0.785-1e-3 -1e-3 0.67c0.874-1e-3 1.467 0.124 1.792 0.375 0.32 0.248 0.479 0.712 0.479 1.391l-2e-3 0.157-1.125-1e-3 -4e-3 -0.125c2e-3 -0.511-0.317-0.767-0.959-0.767l-0.179-3e-3 -3e-3 1.728 0.259 9e-3c0.867 0.044 1.454 0.193 1.754 0.448zm-2.797-2.191-0.167 6e-3c-0.691 2e-3 -1.034 0.272-1.035 0.82 0 0.568 0.344 0.856 1.029 0.855 8e-3 -2e-3 0.066 4e-3 0.173 9e-3zm2.073 3.606c2e-3 -0.35-0.08-0.581-0.248-0.691-0.165-0.112-0.512-0.17-1.04-0.168l-1e-3 1.822 0.17 2e-3c0.748 0 1.121-0.323 1.119-0.965zm1.6666 5.7528-14.693 0.011-3e-3 -8.667h-1l3e-3 9.667 15.693-0.01v3.124l5.375-4.125z"></path>,
      ],
    },
    {
      src: "/user.svg",
      path: "/account",
      size: 29,
      text: "me",
      iconProps: [
        "1.4em",
        "0 0 24 24",
        <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"></path>,
      ],
    },
  ];

  useEffect(() => {
    events.on("routeChangeStart", (url) => setPathName(url));
  }, []);

  return (
    <>
      <div className="fixed bottom-0 z-20 flex justify-center px-4 right-5 rounded-t-[4rem] left-5 pt-2.5 bg-black">
        {links.map((link, key) => (
          <motion.button
            key={key}
            whileTap={{ scale: 0.75 }}
            className="z-10 flex-1 relative fx"
          >
            <Link href={link.path} className="fx h-full pb-5">
              <Svg type={key === 0 && "stroke"} icon={link.iconProps}>
                {link.iconProps[2]}
              </Svg>
              <span className="text-[10px] absolute bottom-2">{link.text}</span>
            </Link>
            {pathName.split("/")[1] === link.path.slice(1) && (
              <motion.div
                layoutId="underline"
                className="from-c1 to-c2 bg-gradient-to-r h-2 absolute bottom-0 w-[70%] blur-md"
              />
            )}
          </motion.button>
        ))}
        <AnimatePresence>
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
                        backgroundColor: ["#2406e6", "#f206e5"],
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
        </AnimatePresence>
      </div>
      <Animated
        variantKey="2"
        state={toggle}
        variants={variants}
        className="fixed inset-0 z-30 bg-black/70"
      >
        <BetList
          v={betList}
          totalOdds={totalOdds}
          setToggle={() => setToggle(false)}
        />
      </Animated>
    </>
  );
}

function BetList({ setToggle, v, totalOdds }) {
  const [stake, setStake] = useState("");
  const potWin = useMemo(calcWinPotential, [stake]);

  function calcWinPotential() {
    return (totalOdds * parseFloat(stake === "" ? 0 : stake)).toFixed(2);
  }

  const buttonClicked = (num, key) => {
    if (key === 3) {
      const s = stake.slice(0, -1);
      setStake(s);
    } else {
      let s = parseInt(num.slice(1)) + parseFloat(stake === "" ? "0" : stake);
      setStake(s.toString());
    }
  };

  return (
    <motion.div
      initial={{ y: "200%", opacity: 0 }}
      animate={{ y: "0%", opacity: 1, transition: { ease: "anticipate" } }}
      exit={{ y: "200%", opacity: 0, transition: { ease: "easeInOut" } }}
      className="absolute pt-4 overflow-hidden bottom-0 rounded-t-[50px] max-h-[80%] bg-gray-900 inset-x-0 fx flex-col"
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
      <header className="px-8 pt-5 pb-3 text-lg justify-between w-full flex">
        <span>{v.length} bets</span>
        <span className="flex gap-2 opacity-50">
          <BiEditAlt />
          <BiCog />
          <BiTrashAlt />
        </span>
        <span className="fx gap-3">
          <span>{totalOdds}</span>
        </span>
      </header>
      <div className="flex-1 overflow-x-hidden overflow-y-scroll w-full">
        {v.map((mv, key) => (
          <motion.div
            key={key}
            drag="x"
            dragSnapToOrigin
            className="px-5 py-5 flex justify-between mb-1 w-full bg-gray-700/10"
          >
            <span className="flex flex-col gap-2 flex-1">
              <span className="flex  justify-between w-full items-center text-c2">
                <span className="fx">
                  <BiFootball /> {mv.mkt}
                  <span className="text-white ml-3 opacity-50">
                    @{mv.currentmkt}
                  </span>
                </span>
                <span className="">{mv.date_start}</span>
              </span>
              <span>
                {mv.team1} <span className="text-c2">vs</span> {mv.team2}
              </span>
            </span>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-col w-full-c bg-gray-900 pt-2">
        <div className="flex justify-between px-5 mb-3 items-center">
          <span className=" px-5 py-2 min-w-[100px] relative aft after:h-px after:top-0 after:inset-x-0 after:bg-gradient-to-r after:from-c1 after:to-c2 bef before:h-px before:bottom-0 before:inset-x-0 before:bg-gradient-to-r before:from-c1 before:to-c2  border-l-[1px] border-r-[1px] border-r-c2 fx border-l-c1">
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
          </span>
          <span className="">
            <span className="mr-3 opacity-30 text-sm">to Win</span>
            <span className="text-c2 mr-2 text-xl ">{potWin}</span>
          </span>
        </div>
        <div className="gap-1 flex flex-col justify-center mb-4">
          <div className="flex justify-center gap-1">
            {["+100", "+500", "+1000", <BiXCircle />].map((num, key) => (
              <button
                key={key}
                className={`px-5 py-1.5 ${
                  key === 3
                    ? "bg-red-500/60 rounded-l-3xl rounded-r-lg relative aft after:w-1/2 after:left-0 after:bg-black/30 after:h-full after:top-0 after:rounded-l-3xl text-xl"
                    : "bg-slate-600/10 rounded-lg"
                }`}
                onClick={() => buttonClicked(num, key)}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 justify-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, ".", "00"].map((num, key) => (
              <button
                key={key}
                className={`px-5 py-1.5 rounded-lg bg-slate-600/10`}
                onClick={() => setStake(stake + num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
        <div className="h-12 h-full-c px-3">
          <button className="w-1/3">Book bet</button>
          <button className="w-2/3 bg-gradient-to-r rounded-t-[25px] from-c1/70 to-c2/50">
            Place bet
          </button>
        </div>
      </div>
    </motion.div>
  );
}

const Svg = ({ children, type, icon }) => {
  return (
    <svg width={icon[0]} height={icon[0]} viewBox={icon[1]} version="1.1">
      <g
        fill={!type ? "#f206e5" : "none"}
        stroke={type ? "#f206e5" : "none"}
        strokeLinecap={type ? "round" : undefined}
        strokeWidth={type ? "32" : undefined}
      >
        {children}
      </g>
    </svg>
  );
};
