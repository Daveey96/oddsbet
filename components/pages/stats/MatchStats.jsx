import React, { useEffect, useState } from "react";
import { Animate } from ".";
import Retry from "@/components/services/Retry";
import { CircularLoader } from "@/components/services/Loaders";
import { apiController } from "@/controllers";
import Error from "@/components/services/Error";
import { motion } from "framer-motion";
import { BsCaretRightFill } from "react-icons/bs";
import { Page } from "@/components/global/Animated";
import { condition } from "@/helpers";

const Matches = ({ data }) => (
  <div className="flex flex-col gap-3 w-full mt-1">
    {data.map((d, key) => (
      <div key={key} className="fx py-2 rounded-lg flex-col bg-c4/40 px-3">
        <span className="opacity-25 text-10">{d.date}</span>
        <div className="w-full gap-3 fx">
          {[0, 1].map((key2) => (
            <span
              key={key2}
              className={`flex-1 ${
                parseInt(!key2 ? d.home_score : d.away_score) >
                parseInt(!key2 ? d.away_score : d.home_score)
                  ? "opacity-100"
                  : "opacity-50"
              } justify-between flex ${key2 ? "order-3" : "order-1"}`}
            >
              <span className={`${key2 ? "" : "order-2"}`}>
                {!key2 ? d.home_score : d.away_score}
              </span>
              <span className="max-w-[80%] overflow-hidden whitespace-nowrap text-ellipsis">
                {!key2 ? d.home : d.away}
              </span>
            </span>
          ))}
          <span className="order-2 text-c2">vs</span>
        </div>
      </div>
    ))}
  </div>
);

const Form = ({ data, home, away }) => {
  const [active, setActive] = useState(0);

  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 0.8,
      opacity: 1,
      transition: {
        pathLength: { delay: 0.5, type: "spring", duration: 4.5, bounce: 0 },
        opacity: { delay: 0.5, duration: 0.01 },
      },
    },
  };
  return (
    <>
      <span className="mt-7 px-1 py-1 from-transparent via-c4/60 to-transparent bg-gradient-to-r">
        Form
      </span>
      <div className=" mb-20 overflow-hidden gap-3 rounded-2xl w-full mt-1 bg-c4/40">
        <div className="flex w-full justify-around gap-3 pt-3">
          {["stroke-blue-600", "stroke-red-600"].map((className, key) => (
            <span
              key={key}
              className="px-4 relative fx rounded-full bg-slate-800/5 py-3 fx"
            >
              <motion.svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                initial="hidden"
                animate="visible"
                className={"-rotate-90"}
              >
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  className={className}
                  strokeWidth={"10px"}
                  fill={"transparent"}
                  variants={draw}
                />
              </motion.svg>
              <motion.svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                initial="hidden"
                animate="visible"
                className={"-rotate-90 absolute blur-md"}
              >
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  className={className}
                  strokeWidth={"5px"}
                  fill={"transparent"}
                  variants={draw}
                />
              </motion.svg>
              <span className="absolute text-lg">80%</span>
            </span>
          ))}
        </div>
        <div className=" bg-c4/40 mt-4 fx flex-col pb-1">
          <header
            className={`flex aft after:-z-10 after:left-0 after:to-transparent after:bg-gradient-to-r after:w-20 after:h-8 relative items-center w-full justify-between px-2 mb-4 pt-5 ${
              active ? "after:from-red-600/40" : "after:from-blue-600/40"
            }`}
          >
            {active ? away : home}
            <button
              className={`aft px-3 py-2 fx duration-150 after:rounded-full after:w-7 after:h-7 ${
                active
                  ? "after:bg-red-600/5 rotate-180 text-red-600"
                  : "after:bg-blue-600/5 text-blue-600"
              }`}
              onClick={() => setActive(active ? 0 : 1)}
            >
              <BsCaretRightFill />
            </button>
          </header>
          <Page className={["px-1", "px-1"]} variants={[0, 1]} state={active}>
            <>
              <span className="flex gap-3">
                {["text-green-500", "text-gray-500", "text-red-500"].map(
                  (className, key) => (
                    <span
                      key={key}
                      className={"last-letter:text-white " + className}
                    >
                      {condition(key, [0, 1, 2], ["W ", "D ", "L "])}
                      <span className="text-white">
                        {condition(key, [0, 1, 2], ["4", "0", "1"])}
                      </span>
                    </span>
                  )
                )}
              </span>
              <Matches data={data} />
            </>
            <>
              <span className="flex gap-3">
                {["text-green-500", "text-gray-500", "text-red-500"].map(
                  (className, key) => (
                    <span
                      key={key}
                      className={"last-letter:text-white " + className}
                    >
                      {condition(key, [0, 1, 2], ["W ", "D ", "L "])}
                      <span className="text-white">
                        {condition(key, [0, 1, 2], ["4", "0", "1"])}
                      </span>
                    </span>
                  )
                )}
              </span>
              <Matches data={data} />
            </>
          </Page>
        </div>
      </div>
    </>
  );
};

const MatchStats = ({ home, away, date = "2020:30:30", live }) => {
  const [data, setData] = useState(["fish"]);

  const getData = async () => {
    setData("loading");

    if (live) {
      setData();
    }
    await apiController.getStats(home, away, date);
  };

  let daa = [
    { home, home_score: "4", away, away_score: "2", date: "July 19, 2023" },
    { home, home_score: "3", away, away_score: "2", date: "July 19, 2023" },
    { home, home_score: "0", away, away_score: "2", date: "July 19, 2023" },
    { home, home_score: "0", away, away_score: "1", date: "July 19, 2023" },
    { home, home_score: "2", away, away_score: "3", date: "July 19, 2023" },
  ];

  useEffect(() => {
    data === null && getData();
  }, []);

  return (
    <Animate>
      <Retry
        state={data}
        loading={<CircularLoader className={"mt-24"} size={35} color />}
        error={<Error className={"mt-24"} refresh={getData} type />}
      >
        <div className="fx flex-col w-full mt-1 px-2">
          <div className="flex overflow-hidden w-full gap-2">
            {[
              "basis-[30%] justify-start from-blue-600/0 via-blue-600/0 to-blue-600/25 text-blue-600 border-blue-600",
              "basis-[31%] from-gray-600/0 via-gray-600/0 to-gray-700/25 border-gray-700",
              "basis-[39%] justify-end from-red-600/0 via-red-600/0 to-red-600/25 border-red-600 text-red-600",
            ].map((className, key) => (
              <span
                key={key}
                className={`border-b-[8px] pb-2.5 pt-3 flex items-center bg-gradient-to-b ${className}`}
              >
                {(key === 2 || !key) && (
                  <span className={`text-xl px-2 ${key ? "" : ""}`}>
                    {key ? "39%" : "30%"}
                  </span>
                )}
              </span>
            ))}
          </div>
          <span className="mt-7 px-1 py-1 from-transparent via-c4/60 to-transparent bg-gradient-to-r">
            H2H
          </span>
          <Matches data={daa} />
          <Form home={home} away={away} data={daa} />
        </div>
      </Retry>
    </Animate>
  );
};

export default MatchStats;
