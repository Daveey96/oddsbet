import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { BiTrashAlt, BiXCircle } from "react-icons/bi";
import { CircularLoader } from "@/components/services/Loaders";
import Retry from "@/components/services/Retry";
import { format, getDate } from "@/helpers";
import { alertService, promptService } from "@/services";
import { betController } from "@/controllers";
import { FaChevronRight, FaRegCopy } from "react-icons/fa";
import { Context } from "@/components/layout";
import { Naira } from "@/components/layout/Nav";
import Svg from "@/components/Svg";

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
            className={`rounded-full bg-black ${
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
        className={`w-[95%] overflow-hidden cursor-pointer active:opacity-75 relative gap-1 fx ${
          active === index ? "h-10 rounded-lg" : "h-20 rounded-2xl"
        }`}
        onClick={() => (active === index ? onClick(null) : onClick(index))}
      >
        <div className="w-1/5 fx flex-col items-center relative h-full z-10 overflow-hidden bg-c4/40">
          <span
            className={`z-10 text-c2 text-lg fx ${
              active === index
                ? "w-full h-full bg-c2/5"
                : "w-10 h-10 bg-c4/60 rounded-3xl"
            }`}
          >
            {v.games.length}
          </span>
          <TicketDots right active={active === index} />
        </div>
        <div className="flex-1 px-5 overflow-hidden duration-300 items-center relative flex justify-between h-full flex-col z-10 bg-c4/70">
          <span
            className={`flex flex-1 w-full text-sm gap-1 justify-end items-center ${
              active === index ? "h-full items-center" : "mt-1"
            } `}
          >
            {active !== index && (
              <span
                className={`rounded-lg flex-1 py-1 pl-3 flex justify-start text-xs items-center gap-1`}
              >
                Stake -{" "}
                <span className="fx gap-0.5">
                  <Naira className={"mb-0.5 scale-75"} />
                  {format(v.stake.toString())}
                </span>
              </span>
            )}
            <span
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(v.code);
                alertService.success("Copied");
              }}
              className=" bg-c2/5 active:scale-90 py-1 px-3 text-xs gap-1.5 active:bg-white/5 duration-150 rounded-md fx"
            >
              {v.code}
              <FaRegCopy className="text-c2" />
            </span>
            <button
              className="bg-red-600/10 text-red-600 py-[5.5px] px-2 rounded-md duration-200"
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
            <span className=" rounded-t-lg py-1 px-2 from-black/20 via-black/10 to-transparent bg-gradient-to-b gap-px flex flex-col w-full items-center justify-between ">
              <span className="flex justify-between items-center w-full px-2">
                <span className="pl-1 after:animate-ping after:rounded-full text-green-600 relative fx aft after:w-1.5 after:h-1.5 after:right-full after:bg-green-600">
                  Live
                </span>
                <span>0% complete</span>
              </span>
              <span className="w-full mb-1 h-1 flex justify-start overflow-hidden rounded-lg bg-white/5 ">
                <span className="h-full w-[20%] bg-c1 rounded-r-lg"></span>
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

const compareDates = (d1, d2) => {
  const date1 = d1.split("-");
  const date2 = d2.split("-");

  return date1[1] !== date2[1]
    ? parseInt(date1[1]) > parseInt(date2[1])
      ? -1
      : 1
    : parseInt(date1[2]) > parseInt(date2[2])
    ? -1
    : 1;
};

const DateList = ({ setDate }) => {
  const container = useRef(null);
  const cDate = useRef(null);
  const months = [
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
    <header className="w-full z-20 flex mt-6 flex-col items-center ">
      <span className="">{months[new Date().getMonth()]}</span>
      <div
        ref={container}
        className="w-full pb-3 pt-1 scroll-smooth px-3 no-bars overflow-x-scroll space-x-2.5 whitespace-nowrap "
      >
        {dateArray.map((dates, key) => (
          <button
            className={`from-black relative active:scale-110 duration-200 bg-gradient-to-b rounded-b-2xl text-xs gap-2 w-14 h-14 ${
              active === dates.split(" ")[1] ? "to-c1/75" : "to-c4"
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
    </header>
  );
};

function Index() {
  const { ping, setPing } = useContext(Context);
  const [activeTicket, setActiveTicket] = useState(null);
  const [activeBets, setActiveBets] = useState(null);
  const [active, setActive] = useState(0);
  const [date, setDate] = useState(getDate().isoString);

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
  }, [activeBets]);

  useEffect(() => {
    ping && setPing(false);
  }, []);

  return (
    <>
      <DateList setDate={(d) => setDate(d)} />
      <div className="flex overflow-x-scroll no-bars overflow-y-hidden justify-start mb-5 pb-1 w-[95%] px-4">
        <button
          className={`px-5 py-2 fx active:scale-90 duration-150 rounded-xl ${
            active === 0 ? "bg-c2/5 text-c2" : "text-white/30"
          }`}
          onClick={() => setActive(0)}
        >
          active
        </button>
        <button
          className={`px-5 py-2 fx gap-1 active:scale-90 duration-150 rounded-xl ${
            active === 1 ? "bg-c2/5 text-c2" : "text-white/30"
          }`}
          onClick={() => setActive(1)}
        >
          history <FaChevronRight className="text-[7px]" />
        </button>

        {["all", "won", "lost"].map((v, key) => (
          <button
            key={key}
            className={`px-5 py-2 fx gap-1 active:scale-90 duration-150 rounded-xl ${
              key + 1 === active ? "bg-c2/5 text-c2" : "text-white/30"
            }`}
            onClick={() => setActive(key + 1)}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="flex mb-7 items-center flex-col gap-4 w-full">
        <Retry
          state={activeBets}
          loading={
            <span className="mt-20 fx gap-3">
              <CircularLoader size={35} depth={4} color />
            </span>
          }
          error={
            <span className="fx flex-col text-sm mt-10 gap-2">
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
