import React, { useEffect, useRef, useState } from "react";
import {
  BiCopy,
  BiFootball,
  BiShareAlt,
  BiTrashAlt,
  BiXCircle,
} from "react-icons/bi";
import { CircularLoader } from "@/components/services/Loaders";
import Image from "next/image";
import Retry from "@/components/services/Retry";
import { getDate } from "@/helpers";
import { alertService, promptService } from "@/services";
import { calcWinPotential } from "@/components/games/BetList";
import { betController } from "@/controllers";

const TicketDots = ({ active, right = false }) => {
  return (
    <div
      className={`flex flex-col z-10 top-0 h-full absolute justify-evenly ${
        right ? "translate-x-1/2 right-0" : "-translate-x-1/2 left-0"
      }`}
    >
      {Array(active ? 1 : 3)
        .fill("")
        .map((i, key) => (
          <span
            key={key}
            className={`w-7 rounded-full bg-black ${
              active ? "h-[35%] w-[15px]" : "h-1/5 w-7"
            }`}
          ></span>
        ))}
    </div>
  );
};

const BetSlip = ({ v, active, index, onClick, getBets }) => {
  let arr = v.slip.split("|");
  let totalOdds = calcWinPotential(
    v.odds.reduce((a, v) => parseFloat(v) + parseFloat(a)),
    v.stake
  );
  const deleteTicket = async () => {
    const deleted = await betController.deleteBet({ code: v.code });

    promptService.clear();
    deleted ? getBets() : alertService.error("Something went wrong");
  };

  return (
    <div className="flex w-[95%] flex-col">
      <div
        className={`w-full cursor-pointer active:opacity-75 relative gap-1 fx ${
          active === index ? "h-12" : "h-32"
        }`}
        onClick={() => (active === index ? onClick(null) : onClick(index))}
      >
        <div className="w-1/5 flex flex-col items-center relative h-full z-10 overflow-hidden bg-c4/40">
          <span
            className={`bg-c2/10 z-10 text-c2 text-lg fx ${
              active === index ? "w-full h-full" : "w-10 h-10 mt-4 rounded-full"
            }`}
          >
            {v.games.length}
          </span>
          <TicketDots right active={active === index} />
        </div>
        <div className="flex-1 overflow-hidden duration-300 items-center relative flex h-full flex-col z-10 bg-c4/70">
          <span
            className={`flex w-full py-1.5 text-lg gap-1 pr-6 justify-end ${
              active === index ? "h-full items-center" : "mt-1"
            } `}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                promptService.prompt(
                  <span className="flex flex-col items-center">
                    <span className="text-[11px]">betting code is</span>
                    <span
                      onClick={() => navigator.clipboard.writeText(`${v.code}`)}
                      className="text-c2 gap-1 px-4 active:bg-white/5 duration-150 rounded-lg py-1 fx text-xl"
                    >
                      {v.code}
                      <BiCopy className=" text-sm text-white opacity-50" />
                    </span>
                  </span>,
                  ["ok"],
                  null,
                  "info"
                );
              }}
              className="active:bg-c2/10 text-c2 bg-c2/0 p-1.5 rounded-full duration-200"
            >
              <BiShareAlt />
            </button>
            <button
              className="active:bg-red-600/10 text-red-600 bg-red-600/0 p-1.5 rounded-full duration-200"
              onClick={(e) => {
                e.stopPropagation();
                promptService.prompt(
                  "Delete this ticket?",
                  ["Yes", "No"],
                  deleteTicket
                );
              }}
            >
              <BiTrashAlt />
            </button>
          </span>
          {active !== index && (
            <>
              <ul className="flex-1 w-full mt-0.5 flex flex-col justify-start items-start px-7">
                {v.games.slice(0, 3).map((g, key) => (
                  <li
                    key={key}
                    className="whitespace-nowrap text-[12px] w-4/5 overflow-hidden text-ellipsis"
                  >
                    {g[0].home} <span className="text-c2">vs</span> {g[0].away}
                  </li>
                ))}
              </ul>
              <span className="fvsc text-base absolute top-2 px-6 py-2 left-0 text-white/20">
                Not Start
              </span>
            </>
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
              className="flex px-3 gap-3 mt-2 flex-col justify-between bg-c4/0 active:bg-c4/40 duration-200 border-l-[4px] border-amber-600 items-start py-5 text-sm w-full relative"
            >
              <span className="flex gap-4 w-full justify-between items-center">
                <span className="flex gap-1 relative text-c1 items-center">
                  <BiFootball className="mb-0.5 text-lg" />
                  <span className="text-c2 font-bold text-base capitalize">
                    {arr[key].split(",")[2]}
                  </span>
                  <span className="text-white/20 absolute left-[120%] bottom-0 mb-0.5 text-xs">
                    {arr[key].split(",")[1]}
                  </span>
                  <span className="absolute text-c2 left-[180%]">
                    @{v.odds[key]}
                  </span>
                </span>
                <span>{g[0].starts.split("T")[1].slice(0, -3)}</span>
              </span>
              <span className="flex flex-col relative justify-center gap-1">
                {[0, 1].map((key) => (
                  <div
                    key={key}
                    className="top-3 overflow-hidden whitespace-nowrap text-ellipsis z-10"
                  >
                    {key ? g[0].home : g[0].away}
                  </div>
                ))}
                <span className="text-c2 opacity-10 text-3xl absolute -right-1">
                  vs
                </span>
              </span>
              <span className="text-amber-600 font-bold fvsc text-xl border-r-2  border-amber-600 bottom-0 right-0 px-2 py-1 absolute">
                Ongoing
              </span>
            </div>
          ))}
          <div className="flex justify-between mt-8">
            {[0, 1].map((key) => (
              <span className="flex gap-3 px-1 text-[19px] items-end" key={key}>
                <span className="text-slate-700/50 text-sm">
                  {key ? "To win" : "Stake"}
                </span>
                <span className={`${key ? "text-c2" : ""} mb-[1.5px] `}>
                  {key ? totalOdds : v.stake}
                </span>
              </span>
            ))}
          </div>
          <button
            disabled
            className=" bg-c4 mb-5 bg-gradient-to-br mt-2 disabled:bg-c4/40 disabled:text-white/40 h-16 w-full"
          >
            Cashout Unavailable
          </button>
        </>
      )}
    </div>
  );
};

const DateList = () => {
  const container = useRef(null);
  const cDate = useRef(null);
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const returnDate = () => {
    let dateArr = [];
    for (let i = -10; i < 6; i++) {
      let { day, weekDay } = getDate(i);
      dateArr.push(`${weekDay.slice(0, 3)} ${day}`);
    }

    return [dateArr, getDate().day];
  };

  const [dateArray, currentDate] = returnDate();
  const [active, setActive] = useState(currentDate);

  const activate = (v) => {
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
    <header className="w-full z-20 flex mt-3 flex-col items-center ">
      <span className="mt-4">{months[new Date().getMonth()]}</span>
      <div
        ref={container}
        className="w-full pb-3 pt-2 scroll-smooth px-3 no-bars overflow-x-scroll space-x-3 whitespace-nowrap "
      >
        {dateArray.map((dates, key) => (
          <button
            className={`from-black active:scale-110 duration-200 bg-gradient-to-b relative rounded-2xl text-sm gap-2 w-16 h-16 ${
              active === dates.split(" ")[1] ? "to-c1/75" : "to-c4"
            }`}
            key={key}
            ref={dates.split(" ")[1] === currentDate.toString() ? cDate : null}
            onClick={() => activate(dates.split(" ")[1])}
          >
            <span className="z-10">{dates.split(" ")[0]}</span> <br />
            <span className="text-c2"> {dates.split(" ")[1]}</span>
          </button>
        ))}
      </div>
    </header>
  );
};

function Index() {
  const [activeTicket, setActiveTicket] = useState(null);
  const [activeBets, setActiveBets] = useState(null);
  const [active, setActive] = useState(0);

  const getBets = async () => {
    setActiveBets("loading");
    const data = await betController.getBets();
    data ? setActiveBets(data.betlist) : setActiveBets("error");
  };

  useEffect(() => {
    setTimeout(() => activeBets === null && getBets(), 2000);
  }, [activeBets]);

  return (
    <>
      <DateList />
      <ul
        style={{ width: "95%" }}
        className="flex justify-start mb-5 pb-1 w-full px-4"
      >
        {["active", "settled"].map((v, key) => (
          <li
            key={key}
            className={`px-5 py-2 fx active:scale-90 duration-150 rounded-xl ${
              key === active ? "bg-c2/5 text-c2" : "text-white/30"
            }`}
            onClick={() => setActive(key)}
          >
            {v}
          </li>
        ))}
      </ul>
      <div className="flex mb-28 items-center flex-col gap-4 w-full">
        <Retry
          state={activeBets}
          loading={
            <span className="mt-20 fx gap-3">
              <CircularLoader size={35} depth={6} color />
            </span>
          }
          error={
            <span className="fx flex-col text-sm mt-9 gap-2">
              <BiXCircle className="text-3xl opacity-25" />
              Something went wrong
              <button onClick={getBets} className=" text-c2">
                refresh
              </button>
            </span>
          }
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
