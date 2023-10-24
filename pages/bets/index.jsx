import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { BiTrashAlt } from "react-icons/bi";
import { CircularLoader } from "@/components/services/Loaders";
import Retry from "@/components/services/Retry";
import { format, getDate } from "@/helpers";
import { alertService, promptService } from "@/services";
import { betController } from "@/controllers";
import { FaRegCopy } from "react-icons/fa";
import { Context } from "@/components/layout";
import { Naira } from "@/components/layout/Nav";
import Svg from "@/components/global/Svg";
import Error from "@/components/services/Error";
import Animated from "@/components/global/Animated";

const TicketDots = ({ active, right = false }) => {
  return (
    <div
      className={`flex flex-col z-10 top-0 h-full absolute justify-evenly ${
        right ? "translate-x-1/2 right-0" : "-translate-x-1/2 left-0"
      }`}
    >
      {Array(active ? 1 : 2)
        .fill("")
        .map((i, key) => (
          <span
            key={key}
            className={`rounded-full dark:bg-black bg-white ${
              active ? "h-[35%] w-[15px]" : "h-[30%] w-7"
            }`}
          ></span>
        ))}
    </div>
  );
};

const BetSlip = ({ v, active, index, onClick, getBets }) => {
  const deleteTicket = async () => {
    const deleted = await betController.deleteBet({ aid: v.id });

    promptService.clear();
    deleted ? getBets() : alertService.error("Something went wrong");
  };

  return (
    <div className="flex w-full items-center flex-col">
      <div
        className={`w-full cursor-pointer active:opacity-75 relative gap-1 fx ${
          active === index ? "h-10" : ""
        }`}
        onClick={() => (active === index ? onClick(null) : onClick(index))}
      >
        <div className="w-1/5 shadow-md dark:shadow-none fx flex-col items-center relative h-full z-10 overflow-hidden dark:bg-c4/40 bg-c5">
          <span
            className={`z-10 text-c2 text-lg fx ${
              active === index
                ? "w-full h-full bg-c2/5"
                : "w-10 h-10 dark:bg-c4/60 bg-c3 rounded-3xl"
            }`}
          >
            {v.games.length}
          </span>
          <TicketDots right active={active === index} />
        </div>
        <div className="flex-1 min-h-[4.5rem] shadow-md dark:shadow-none px-5 duration-300 items-center relative flex gap-2 py-1 flex-col z-10 dark:bg-c4/70 bg-c3 ">
          <span
            className={`flex flex-1 w-full gap-1 justify-end items-center ${
              active === index ? "h-full items-center" : "mt-1"
            } `}
          >
            {active !== index && (
              <span className="flex justify-start items-center flex-1 gap-0.5">
                <Naira className={"mb-px ml-1 scale-75"} />
                {format(v.stake.toString())}
              </span>
            )}
            <span
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(v.code);
                alertService.success("Copied");
              }}
              className=" dark:bg-c2/5 bg-c2/20 active:scale-90 py-1 px-3 text-xs gap-1.5 active:bg-white/5 duration-150 rounded-md fx"
            >
              {v.code}
              <FaRegCopy className="text-c2" />
            </span>
            <button
              className="dark:bg-red-600/10 bg-red-600/20 text-red-600 py-[5.5px] px-2 rounded-md duration-200"
              onClick={(e) => {
                e.stopPropagation();
                promptService.prompt(
                  <span className="flex items-center px-4 flex-col">
                    Deleting this ticket will count as a loss.{" "}
                    <span>Continue?</span>
                  </span>,
                  ["Yes", "No"],
                  deleteTicket
                );
              }}
            >
              <BiTrashAlt />
            </button>
          </span>
          {active !== index && (
            <span className=" rounded-lg mb-1 py-1 px-2 dark:from-black/40  from-c5/90 dark:to-transparent bg-gradient-to-r gap-px flex w-full pl-4 items-center justify-between ">
              <span className="pl-2 flex-1 after:animate-ping after:rounded-full text-green-600 font-bold relative flex items-center justify-start aft after:w-1.5 after:h-1.5 after:right-full after:bg-green-600">
                Live
              </span>
            </span>
          )}
          <TicketDots active={active === index} />
          <TicketDots right active={active === index} />
        </div>
      </div>
      {active === index && (
        <>
          {v.games.map((g, key) => (
            <div
              key={key}
              className="flex px-[4%] gap-2 mt-2 flex-col duration-200 items-start justify-center py-3 text-sm w-full relative"
            >
              <span className="flex gap-2 w-full justify-between items-center">
                <span className="flex gap-1 text-c1 items-center">
                  <Svg id={g.game.sport_id} className={"text-c2 "} />
                  <span className="text-c2 capitalize">{g.outcome}</span>
                </span>
                <span>{g.odd}</span>
              </span>
              <div className="flex gap-6">
                <span className="flex flex-col pl-0.5 relative justify-center gap-0.5">
                  {[0, 1].map((key) => (
                    <div
                      key={key}
                      className="text-xs overflow-hidden whitespace-nowrap text-ellipsis z-10"
                    >
                      {key ? g.game.home : g.game.away}
                    </div>
                  ))}
                  <span className="text-c2 opacity-10 text-3xl absolute -right-1">
                    vs
                  </span>
                </span>
                <span className="text-lg text-white/60">
                  {g.game.starts.split("T")[1].slice(0, -3)}
                </span>
              </div>

              <span className="text-gray-700 from-transparent to-gray-700/10 pb-1 bg-gradient-to-r right-[3%] font-bold fvsc text-base border-r-2  border-gray-700 bottom-0 px-2 absolute">
                {g.status}
              </span>
            </div>
          ))}
          <div className="flex w-[95%]  py-1 rounded-lg  px-1 justify-between mt-4">
            {[0, 1].map((key) => (
              <span className="flex flex-col gap-1 px-1 items-center" key={key}>
                <span className="text-white/50 text-xs">
                  {key ? "To Win" : "Stake"}
                </span>
                <span
                  className={`${
                    key ? "text-c2 border-c2/20" : "border-white/20"
                  } px-4 fx gap-0.5 text-sm border-x-2`}
                >
                  <Naira />
                  {key ? format(v.toWin) : format(v.stake)}
                </span>
              </span>
            ))}
          </div>
          <button
            // disabled
            className=" bg-c4 fx gap-2 w-[95%] mb-2 rounded-lg bg-gradient-to-br mt-2 disabled:bg-c4/60 disabled:text-white/40 h-12"
          >
            Cashout{" "}
            <span className="fx text-c2">
              (<Naira className={"mt-0.5"} />
              460)
            </span>
          </button>
        </>
      )}
    </div>
  );
};

const DateList = ({ setDate }) => {
  const container = useRef(null);
  const cDate = useRef(null);

  const returnDate = () => {
    let dateArr = [];
    let isoArr = [];
    for (let i = -10; i < 6; i++) {
      let { day, weekDay, isoString } = getDate(i);
      dateArr.push(`${weekDay.slice(0, 3)} ${day}`);
      isoArr.push(isoString);
    }

    return [dateArr, getDate().day, isoArr];
  };

  const [dateArray, currentDate, isoDates] = returnDate();
  const [active, setActive] = useState(currentDate);

  const activate = (v, isodate) => {
    setDate(isodate);
    setActive(v);
  };

  useEffect(() => {
    setTimeout(() => {
      container.current.scrollTo(
        cDate.current.offsetLeft -
          container.current.clientWidth / 2 +
          cDate.current.clientWidth / 2,
        0
      );
    }, 500);
  }, []);

  return (
    <>
      <span className="mt-5 dark:text-c2 w-full text-center">
        {new Date().toUTCString().split(" ")[2]}
      </span>
      <div
        ref={container}
        className="w-full pb-2 pt-1 scroll-smooth px-3 no-bars overflow-x-scroll space-x-2.5 whitespace-nowrap "
      >
        {dateArray.map((dates, key) => (
          <button
            className={`from-transparent relative active:scale-110 duration-200 bg-gradient-to-b rounded-2xl gap-2 w-14 h-14 ${
              active === dates.split(" ")[1]
                ? "dark:to-c1/75 to-c2/40"
                : "dark:to-black/25 to-c4/20"
            }`}
            key={key}
            ref={dates.split(" ")[1] === currentDate.toString() ? cDate : null}
            onClick={() => activate(dates.split(" ")[1], isoDates[key])}
          >
            <span className={`z-10`}>{dates.split(" ")[0]}</span>
            <br /> <span className="text-c2"> {dates.split(" ")[1]}</span>
          </button>
        ))}
      </div>
    </>
  );
};

function Index() {
  const { ping, setPing } = useContext(Context);
  const [activeTicket, setActiveTicket] = useState(null);
  const [activeBets, setActiveBets] = useState(null);
  const [active, setActive] = useState(0);
  const [date, setDate] = useState(getDate().isoString);
  const [head, setHead] = useState(null);

  const getBets = async () => {
    setActiveBets("loading");
    const data = await betController.getBets({
      active: active ? false : true,
      date,
    });
    data ? setActiveBets(data.betlist) : setActiveBets("error");
  };

  useMemo(getBets, [date, active]);

  useEffect(() => {
    setTimeout(() => activeBets === null && getBets(), 2000);

    const optimize = (v) => {
      v ? !head && setHead(true) : head && setHead(false);
    };

    const main = document.getElementById("scroll-container");
    if (main) {
      main.scrollTop > 100 ? optimize(true) : optimize();

      main.addEventListener("scroll", (e) => {
        e.target.scrollTop > 100 ? optimize(true) : optimize();
      });
    }
  }, [activeBets]);

  useEffect(() => {
    ping && setPing(false);
  }, []);

  return (
    <>
      <div
        className={`dark:bg-c4 bg-c3 pb-3 flex flex-col pt-5 ${
          !head && "z-20"
        }`}
      >
        <DateList setDate={(d) => setDate(d)} />
      </div>
      <div
        className={`top-12 aft z-10 after:-z-[1] after:duration-150 sticky after:h-32 after:bottom-0 after:inset-x-0 w-full ${
          head && "after:bg-c4 z-30"
        }`}
      >
        <div
          className={`flex whitespace-nowrap no-bars pl-9 overflow-x-scroll pb-3 mt-2 w-full`}
        >
          {["All", "Cashout Available", "live", "history"].map((item, key) => (
            <button
              key={key}
              className={`px-5 py-2 mr-4 whitespace-nowrap gap-1 fx active:scale-90 relative duration-150 rounded-3xl ${
                active === key
                  ? "dark:text-c2 text-white bg-c2 dark:bg-c2/5"
                  : head
                  ? "dark:text-white/30 text-black/30 bg-black/20"
                  : "dark:bg-c4/70 bg-c5"
              }`}
              onClick={() => setActive(key)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="flex mb-7 mt-5 items-center flex-col gap-2 w-full">
        <Retry
          state={activeBets}
          loading={
            <span className="mt-20 fx gap-3">
              <CircularLoader size={35} depth={4} color />
            </span>
          }
          error={<Error className={"mt-20"} type refresh={() => getBets(1)} />}
        >
          {typeof activeBets === "object" && activeBets?.length > 0 ? (
            activeBets.map((bet, key) => (
              <BetSlip
                key={key}
                v={bet}
                active={activeTicket}
                index={key}
                onClick={(key) => setActiveTicket(key)}
                getBets={getBets}
              />
            ))
          ) : (
            <span className="mt-10">You have no active bets</span>
          )}
        </Retry>
      </div>
    </>
  );
}

export default Index;
