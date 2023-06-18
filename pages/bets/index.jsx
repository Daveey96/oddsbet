import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BiShareAlt, BiWifiOff } from "react-icons/bi";
import { CircularLoader } from "@/components/services/Loaders";
import Image from "next/image";
import games from "@/helpers/games";
import Retry from "@/components/services/Retry";
import { appService } from "@/services";

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

const BetSlip = ({ v }) => {
  const [active, setActive] = useState(false);
  return (
    <div className="flex w-[90%] flex-col">
      <div
        className={`w-full mb-2 active:opacity-75 relative gap-1 fx ${
          active ? "h-12" : "h-36"
        }`}
        onClick={() => setActive(!active)}
      >
        <div className="w-1/4 flex flex-col items-center relative h-full z-10 overflow-hidden bg-c4">
          <span
            className={`bg-c2/10 z-10 text-c2 text-lg fx ${
              active ? "w-full h-full" : "w-12 h-12 mt-4 rounded-full"
            }`}
          >
            3
          </span>
          <TicketDots right active={active} />
          <div className="absolute -rotate-45 -right-12 opacity-10">
            {Array(6)
              .fill("")
              .map((i, key) => (
                <div key={key} className="flex h-10 even:ml-10 overflow-hidden">
                  {Array(6)
                    .fill("")
                    .map((i2, key2) => (
                      <Image
                        width={70}
                        height={20}
                        key={key2}
                        priority
                        src={"/logo3.svg"}
                        alt="Oddsbet"
                      />
                    ))}
                </div>
              ))}
          </div>
        </div>
        <div className="w-full duration-300 items-center relative flex h-full flex-1 z-10 bg-c4/70">
          <span className="flex w-full py-2 text-lg gap-5 opacity-75 justify-end mr-3">
            <BiShareAlt />
          </span>
          <TicketDots active={active} />
        </div>
      </div>
      {active && (
        <>
          {games.slice(0, 3).map((g, key) => (
            <div
              key={key}
              className="flex justify-between border-b-[2px] border-c4 last-of-type:border-b-0 px-1 items-start py-5 text-sm w-full relative"
            >
              <div className="flex flex-col">
                {[0, 1].map((key) => (
                  <div
                    key={key}
                    className="top-3 overflow-hidden whitespace-nowrap text-ellipsis z-10"
                  >
                    {key ? g.team1 : g.team2}
                  </div>
                ))}
              </div>
              <div className="flex">
                <span className="text-c2 text-base mr-4">3.89</span>
                <div className="flex items-end flex-col">
                  <span className="flex">
                    @Home
                    <span className="opacity-40">1X2</span>
                  </span>
                  <span className="text-c2">19:45</span>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between mt-4">
            {[0, 1].map((key) => (
              <span className="flex gap-3 px-1 items-end" key={key}>
                <span className="opacity-40 mb-1 text-sm">
                  {key ? "To Win" : "Stake"}
                </span>
                <span className={`${key ? "text-c2" : ""} text-lg`}>
                  {key ? 2000 : 388}
                </span>
              </span>
            ))}
          </div>
          <button className="bg-green-600 mt-2 disabled:bg-c4 disabled:text-white/40 bg-gradient-to-br h-14 w-full">
            Cashout
          </button>
        </>
      )}
    </div>
  );
};

const returnDate = () => {
  let [year, month, date] = new Date().toISOString().split("T")[0].split("-");
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let numDays = [
    31,
    year % 4 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  let dateArr = [];

  for (let i = 1; i < 11; i++) {
    let newDate = new Date(`${year}-${month}-${parseInt(date) - i}`);
    dateArr.unshift(`${days[newDate.getDay()]} ${newDate.getDate()}`);
  }
  for (let i = 0; i < 7; i++) {
    let newDate = new Date(`${year}-${month}-${parseInt(date) + i}`);
    dateArr.push(`${days[newDate.getDay()]} ${newDate.getDate()}`);
  }

  return [dateArr, date];
};

function Index() {
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

  const [dateArray, currentDate] = returnDate();
  const [active, setActive] = useState(currentDate);
  const [activeBets, setActiveBets] = useState("loading");

  const getBets = async () => {
    setActiveBets("loading");
    let data = await appService.getBets();
    // let data = false;

    if (data) {
      setActiveBets(data.stage);
      if (data.email && data.email !== email) setEmail(data.email);
    } else {
      setActiveBets("error");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      container.current.scrollTo(
        cDate.current.offsetLeft -
          container.current.clientWidth / 2 +
          cDate.current.clientWidth / 2,
        0
      );

      setTimeout(getBets, 500);
    }, 500);
  }, []);

  return (
    <div className="flex min-h-screen flex-col pt-5 items-center">
      <header className="w-full z-20 pb-2 flex flex-col items-center ">
        <span className="mt-4 mb-2">{months[new Date().getMonth()]}</span>
        <div
          ref={container}
          className="w-full scroll-smooth px-3 no-bars overflow-x-scroll space-x-3 whitespace-nowrap "
        >
          {dateArray.map((dates, key) => (
            <React.Fragment key={key}>
              {dates.split(" ")[1] === currentDate ? (
                <motion.button
                  className={`from-black bg-gradient-to-b relative rounded-2xl text-sm gap-2 w-16 h-16 ${
                    active === dates.split(" ")[1] ? "to-c1/75" : "to-c4"
                  }`}
                  ref={cDate}
                  whileTap={{ opacity: 0.2 }}
                  onClick={() => setActive(dates.split(" ")[1])}
                >
                  <span className="z-10">{dates.split(" ")[0]}</span> <br />
                  <span className="text-c2"> {dates.split(" ")[1]}</span>
                </motion.button>
              ) : (
                <motion.button
                  className={`from-black bg-gradient-to-b relative rounded-2xl text-sm gap-2 w-16 h-16 ${
                    active === dates.split(" ")[1] ? "to-c1/75" : "to-c4"
                  }`}
                  whileTap={{ opacity: 0.2 }}
                  onClick={() => setActive(dates.split(" ")[1])}
                >
                  <span className="z-10">{dates.split(" ")[0]}</span> <br />
                  <span className="text-c2"> {dates.split(" ")[1]}</span>
                </motion.button>
              )}
            </React.Fragment>
          ))}
        </div>
      </header>
      <div className="flex mt-6 items-center flex-col gap-4 w-full">
        <Retry
          state={activeBets}
          loading={
            <span className="mt-20 fx gap-3">
              <CircularLoader size={30} />
            </span>
          }
          error={
            <span className="fx flex-col text-sm mt-6 gap-2">
              <BiWifiOff className="text-5xl mb-1 opacity-25" />
              Network Error
              <button
                onClick={getBets}
                className="relative px-5 py-2 aft after:h-0.5 after:top-0 after:inset-x-0 after:bg-gradient-to-r after:from-c1 after:to-c2 bef before:h-0.5 before:bottom-0 before:inset-x-0 before:bg-gradient-to-r before:from-c1 before:to-c2  border-l-2 border-r-2 border-r-c2 fx border-l-c1 flex text-c2"
              >
                try again
              </button>
            </span>
          }
        >
          {/* {activeBets.length > 0
            ? activeBets.map((bet, key) => <BetSlip key={key} v={bet} />)
            : "You have no active bets"} */}
          fish is fishing
        </Retry>
      </div>
    </div>
  );
}

export default Index;
