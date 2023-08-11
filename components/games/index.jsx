import React, { useEffect, useRef, useState } from "react";
import { BiXCircle } from "react-icons/bi";
import { getDate } from "@/helpers";
import Image from "next/image";
import List from "./List";
import Retry from "../services/Retry";
import Game from "./Game";
import { apiController } from "@/controllers";
import football from "@/helpers/json/football";

export const sports = [
  {
    id: 1,
    item: "soccer",
    markets: [
      { item: "WDL", v: "WDL" },
      { item: "over | under", v: "OU" },
      { item: "home over | under", v: "HOU" },
      { item: "away over | under", v: "AOU" },
    ],
  },
  {
    id: 3,
    item: "basketball",
    markets: [
      { item: "Winner", v: "WL" },
      { item: "over | under", v: "OU" },
      { item: "home over | under", v: "HOU" },
      { item: "away over | under", v: "AOU" },
    ],
  },
  { id: 2, item: "tennis" },
  { id: 4, item: "hockey" },
  { id: 5, item: "volleyball" },
  { id: 6, item: "handball" },
  { id: 7, item: "mixed martial Arts" },
  { id: 8, item: "baseball" },
];

// const filterGames = (data, isoString, len) => {
//   let dataArr = [];
//   let dataSpecialArr = [];
//   let filter = data.events.filter((v) => v.starts.split("T")[0] === isoString);
//   let l = filter.filter((v) => v.parent_id !== null);

//   filter.forEach((element) => {
//     if (element.parent_id) {
//       let r = filter.filter((v) => v.event_id === element.parent_id);
//       r[0].periods.num_0[element.resulting_unit.toLowerCase()] =
//         element.periods.num_0.totals;
//       dataSpecialArr.push(r[0]);
//     } else {
//       const g = l.filter((v) => v.parent_id === element.event_id);
//       if (!g) dataArr.push(element);
//     }
//   });

//   let Arr = [
//     ...dataSpecialArr,
//     ...dataArr.sort((a, b) => a.league_id - b.league_id),
//   ];

//   let initialLen = Arr.length;

//   if (len) Arr = Arr.slice(0, len);

//   return {
//     len: initialLen,
//     v: Arr.sort(
//       (a, b) =>
//         parseInt(a.starts.split("T")[1].slice(0, 2)) -
//         parseInt(b.starts.split("T")[1].slice(0, 2))
//     ),
//   };
// };
const filterGames = (data, isoString, len) => {
  let filter = data.events.filter((v) => v.starts.split("T")[0] === isoString);
  // .filter((v) => v?.parent_id !== null);

  let initialLen = filter.length;
  if (len) filter = filter.slice(0, len);

  return {
    len: initialLen,
    v: filter,
  };
};

const GameList = ({ title, globalGames, index, last }) => {
  const isLive = title === "Live";
  const [mkt, setMkt] = useState("WDL");
  const [games, setGames] = useState(null);
  const [sportId, setSportId] = useState(1);
  const header = useRef(null);
  const len = useRef(0);

  const getGames = async (id) => {
    setGames("loading");

    const data = isLive ? await apiController.getMatches(id, true) : football;
    // : await apiController.getMatches(id);

    if (data.events) {
      let g = [];
      if (isLive) g = filterGames(data, "live", 5);
      else {
        const { isoString } = getDate(index - 1);
        g = filterGames(data, isoString, index === 1 ? 15 : 7);
      }

      len.current = g.len;
      setGames(g.v);
    } else setGames("error");
  };

  useEffect(() => {
    const scrollElement = document.getElementById("scroll-container");
    let pos = document.getElementById(`container${index}`)?.offsetTop;

    scrollElement.scrollTop > pos
      ? header.current.classList.add(isLive ? "isSticky2" : "isSticky")
      : header.current.classList.add(isLive ? "isNotSticky2" : "isNotSticky");

    scrollElement.addEventListener("scroll", (e) => {
      if (header.current !== null) {
        if (pos !== document.getElementById(`container${index}`).offsetTop)
          pos = document.getElementById(`container${index}`).offsetTop;

        e.target.scrollTop > pos
          ? !header.current.classList.contains(
              isLive ? "isSticky2" : "isSticky"
            ) &&
            header.current.classList.replace(
              isLive ? "isNotSticky2" : "isNotSticky",
              isLive ? "isSticky2" : "isSticky"
            )
          : header.current.classList.contains(
              isLive ? "isSticky2" : "isSticky"
            ) &&
            header.current.classList.replace(
              isLive ? "isSticky2" : "isSticky",
              isLive ? "isNotSticky2" : "isNotSticky"
            );
      }
    });
  }, []);

  useEffect(() => setGames(globalGames), [globalGames]);
  // useEffect(() => getGames(), []);

  const changeSport = (id) => {
    getGames(id);
    setSportId(id);
  };

  let classNames = [
    isLive ? "dark:bg-c4/40" : "dark:bg-transparent",
    isLive ? "dark:bg-c4/40" : "bg-c4",
    isLive ? "dark:bg-black/40" : "dark:bg-c4",
    isLive ? "dark:bg-c4/40" : "dark:bg-c4",
  ];

  return (
    <div
      id={`container${index}`}
      className={`relative mb-2 ${
        isLive && "dark:bg-transparent dark:mt-0 text-white mt-4 bg-black"
      }`}
    >
      <header
        ref={header}
        className={`flex mb-px z-20 md:rounded-t-2xl sticky w-full -top-[1px] flex-col pb-1 `}
      >
        <span className=" text-base gap-1.5 flex items-center pl-4">
          {!isLive ? (
            <span className="flex items-center pr-1 gap-1">
              {title.split(" ")[0]}
              <span className="text-white/30 mt-0.5 text-sm">
                {title.split(" ")[1]}
              </span>
            </span>
          ) : (
            <span className="flex gap-1 items-center mr-3">
              <svg
                width="1rem"
                height="1rem"
                className="mb-0.5"
                version="1.1"
                viewBox="0 0 32 32"
              >
                <g
                  transform="matrix(.96845 0 0 .97075 .53375 .41541)"
                  stroke="#06b6d4"
                >
                  <path
                    d="m18.798 7.9641h-5.5966l0.052265 0.035938h-9.254c-2.209 0-4 1.791-4 4v16c0 2.209 1.791 4 4 4h24c2.209 0 4-1.791 4-4v-16c0-2.209-1.791-4-4-4h-9.254zm-14.798 2.0359h24c1.104 0 2 0.89601 2 2v16c0 1.104-0.89601 2-2 2h-24c-1.104 0-2-0.89601-2-2v-16c0-1.104 0.89601-2 2-2zm19.181 5.6163c-0.05326 0.02331-0.10235 0.05122-0.115 0.07594 0.01101-0.0023 0.02204-0.0047 0.03305-7e-3 0.0023 2e-3 4e-3 0.0065 7e-3 6e-3 0.03301-0.0053 0.05747-0.04207 0.075-0.07492zm-12.854 11.908c-0.03172 0.01349-0.06288 0.02816-0.09297 0.04477-0.0064 0.0036 0.01522-5.12e-4 0.02172-0.0038 0.02426-0.01271 0.04783-0.02671 0.07125-0.04094zm1.9587 0.46547c-0.0024 0.0036-0.0049 0.0071-0.0073 0.01063h0.03c-0.0075-0.0035-0.01511-0.0071-0.02266-0.01063z"
                    fill="#06b6d4"
                    fill-rule="evenodd"
                  />
                  <path
                    d="m26.969 0.09125c-0.18473 8.8365e-4 -0.37153 0.056141-0.53828 0.17078 0 0-9.61 6.635-10.422 7.125l-10.44-7.125c-0.16277-0.11215-0.34489-0.16752-0.5257-0.1707-0.012054-2.1222e-4 -0.024136-1.7199e-4 -0.036172 7.813e-5 -0.32095 0.0066699-0.6332 0.17711-0.82008 0.48461-0.3 0.492-0.168 1.15 0.295 1.469l8.7197 5.9991h5.5966l8.7197-5.9991c0.46299-0.319 0.59499-0.97699 0.295-1.469-0.19155-0.31519-0.51437-0.48634-0.84367-0.48477z"
                    fill="#06b6d4"
                    fill-rule="evenodd"
                  />
                  <path
                    d="m11.283 14.811c0.01618 3.8498 0.06881 7.7 0.13282 11.55 3.6896-1.9413 7.3717-3.8875 11.034-5.8723-3.7045-2.0401-7.4288-4.0463-11.166-6.0323l-0.0014 0.24449z"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="5.4"
                    stroke-width="2.8593"
                  />
                </g>
              </svg>
              <span className="z-10 font-bold text-base">{title}</span>
            </span>
          )}
          <span className="opacity-50">|</span>
          <List
            iClass="pt-0.5 pb-0.5 mt-0.5 text-[13px] gap-1 pr-3 pl-2"
            activeClass={`text-c2`}
            inActiveClass={"border-white/20"}
            onClick={changeSport}
            list={sports}
            v="id"
            icon
          />
        </span>
        <List
          className={"mt-1 mb-1 py-1 px-2"}
          iClass="px-3.5 py-1 bg-gray-700/5 active:opacity-10 opacity-100 rounded-lg shadow-[0px_2px_2px_1px] shadow-black/20 duration-200"
          activeClass={"text-c2"}
          inActiveClass={"text-white/40"}
          onClick={(v) => setMkt(v)}
          list={sports.filter((g) => g.id === sportId)[0].markets}
        />
      </header>
      <Retry
        state={games}
        loading={
          <div
            className={`flex aft after:bg-c2 after:blur-2xl after:z-0 after:rounded-full after:h-24 after:w-24 bef before:blur-2xl before:left-5 before:bg-c1 before:bottom-10 before:z-0 before:rounded-full before:h-28 before:w-28 flex-col mb-2 relative items-center w-full gap-px `}
          >
            {Array(5)
              .fill("")
              .map((i, key) => (
                <div
                  key={key}
                  className={`flex z-[1] w-full flex-col px-3 pt-2.5 last-of-type:pb-12 md:last-of-type:rounded-b-2xl pb-2 ${classNames[1]}`}
                >
                  <div className="w-[46%] rounded-md bg-slate-600/25 leading-[14px] mb-1 fade text-[12px]"></div>
                  <div className="w-full flex justify-between items-center">
                    <div className="flex h-10 flex-col justify-between w-[42%]">
                      {[0, 1].map((key) => (
                        <span
                          className="flex bg-white/0 pr-1 w-full gap-1 items-center"
                          key={key}
                        >
                          <Image
                            width={11}
                            height={10}
                            src={"/badge.svg"}
                            alt=""
                          />
                          <span className="fade rounded-md flex-1 bg-slate-600/25 text-[12px] leading-[15px] mr-1"></span>
                        </span>
                      ))}
                    </div>
                    <div className="w-[58%] flex gap-2">
                      {Array(3)
                        .fill("")
                        .map((i, key2) => (
                          <span
                            key={key2}
                            className="bg-slate-600/25 rounded-md fade flex-1 h-10"
                          ></span>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        }
        error={
          <div className="relative w-full mb-2 aft after:bg-c2 after:left-[40%] after:-top-4 after:blur-2xl after:z-0 after:rounded-full after:h-24 after:w-24 bef before:blur-2xl before:left-5 before:bg-c1 before:bottom-10 before:z-0 before:rounded-full before:h-28 before:w-28">
            <div className="flex opacity-0 flex-col relative items-center w-full gap-px">
              {Array(5)
                .fill("")
                .map((i, key) => (
                  <span
                    key={key}
                    className="flex w-full flex-col px-3 pt-2.5 last-of-type:pb-12 pb-2"
                  >
                    <span className="w-full leading-[14px] mb-1 text-[12px]">
                      |
                    </span>
                    <span className="w-full h-10"></span>
                  </span>
                ))}
            </div>
            <div
              className={`w-full h-full gap-2  fx md:rounded-b-2xl absolute  inset-0 z-20 fx flex-col ${classNames[3]}`}
            >
              <BiXCircle className="text-3xl" />
              Something went wrong
              <button className="text-c2" onClick={() => getGames(sportId)}>
                refresh
              </button>
            </div>
          </div>
        }
      >
        {typeof games === "object" && games && (
          <div
            className={`flex flex-col relative aft after:bg-c2 after:blur-2xl after:z-0 after:rounded-full after:h-24 after:w-24 bef before:blur-2xl before:left-5 before:bg-c1 before:bottom-10 before:z-0 before:rounded-full before:h-28 before:w-28 items-center w-full gap-px ${classNames[0]}`}
          >
            {games.v.map((game, key) => (
              <Game
                key={key}
                isLive={title === "Live"}
                game={game}
                mkt={mkt}
                last={last}
              />
            ))}
          </div>
        )}
      </Retry>
      {games && (
        <button className="absolute z-20 left-1/2 -translate-x-1/2 active:scale-90 duration-200 bottom-0 bg-black/25 text-[12px] pt-1.5 pb-1 rounded-t-2xl px-5 ">
          view more <span className="text-c2">({games.len - 5})</span>
        </button>
      )}
    </div>
  );
};

export default function GameDays() {
  const [games, setGames] = useState(null);
  const array = useRef(["Live", "Today"]);

  const getGames = async (id) => {
    setGames("loading");

    const data = football;
    // const liveData = await apiController.getMatches(id, true);

    if (data.events) {
      let daysArr = ["Live"];
      let genArray = [null];

      for (let i = 0; i < 3; i++) {
        const { isoString, weekDay } = getDate(i);
        const games = filterGames(data, isoString, 5);
        const md = `${isoString.split("-")[1]}/${isoString.split("-")[2]}`;

        daysArr.push(i ? `${weekDay} ${md}` : `Today ${md}`);
        genArray.push(games);
      }

      array.current = daysArr;
      setGames(genArray);
    } else setGames("error");
  };

  useEffect(() => {
    games === null && getGames(1);
  }, [games]);

  return (
    <>
      {array.current.map((title, key) => (
        <GameList
          getGames={getGames}
          title={title}
          index={key}
          key={key}
          last={key === array.current.length - 1}
          globalGames={
            typeof games === "object" && games !== null ? games[key] : games
          }
        />
      ))}
    </>
  );
}
