import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import Retry from "../services/Retry";
import Odds from "../games/Odds";
import { useKeenSlider } from "keen-slider/react";
import { Skeleton } from "../services/Loaders";
import { BiFootball } from "react-icons/bi";
import {
  arrange,
  condition,
  dateDifference,
  mainLeagues,
  weekDays,
} from "@/helpers";
import { Context } from "../layout";
import Error from "../services/Error";
import { apiController } from "@/controllers";
import { motion } from "framer-motion";
import { alertService } from "@/services";

export const categories = {
  icons: [
    <svg key={1} width="1em" height="1em" viewBox="0 0 512 512">
      <defs>
        <linearGradient
          id="linearGradient875"
          x1="504"
          x2="504"
          y1="0"
          y2="508"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00daae" offset="0" />
          <stop stopColor="#0000ab" offset="1" />
        </linearGradient>
      </defs>
      <path
        d="M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm92.49,313h0l-20,25a16,16,0,0,1-22.49,2.5h0l-67-49.72a40,40,0,0,1-15-31.23V112a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V256l58,42.5A16,16,0,0,1,348.49,321Z"
        fill="url(#linearGradient875)"
      />
    </svg>,
    <svg key={0} width="1em" height="1em" viewBox="0 0 448 512">
      <defs>
        <linearGradient
          id="linearGradient874"
          x1="228.17"
          x2="230.96"
          y1="51.942"
          y2="485.1"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#68176f" offset="0" />
          <stop stopColor="#f00" offset="1" />
        </linearGradient>
      </defs>
      <path
        d="M323.56 51.2c-20.8 19.3-39.58 39.59-56.22 59.97C240.08 73.62 206.28 35.53 168 0 69.74 91.17 0 209.96 0 281.6 0 408.85 100.29 512 224 512s224-103.15 224-230.4c0-53.27-51.98-163.14-124.44-230.4zm-19.47 340.65C282.43 407.01 255.72 416 226.86 416 154.71 416 96 368.26 96 290.75c0-38.61 24.31-72.63 72.79-130.75 6.93 7.98 98.83 125.34 98.83 125.34l58.63-66.88c4.14 6.85 7.91 13.55 11.27 19.97 27.35 52.19 15.81 118.97-33.43 153.42z"
        fill="url(#linearGradient874)"
      />
    </svg>,
    <svg key={2} width="1em" height="1em" viewBox="0 0 16 16">
      <g transform="matrix(.99099 0 0 .99278 1.1515e-5 .11552)">
        <path
          d="m6.4141 3.8164-2.3516 0.23438h-0.00586a2.552 2.552 0 0 0-1.5254 0.73242l-2.3809 2.3867a0.512 0.512 0 0 0 0.43164 0.86719l1.8965-0.26953c0.28-0.04 0.59208 0.011859 0.95508 0.13086 0.232 0.076 0.43825 0.16005 0.65625 0.24805l0.20312 0.083984c0.196 0.816 0.65844 1.5803 1.2734 2.1953 0.613 0.614 1.3764 1.0784 2.1914 1.2754l0.082031 0.20312c0.089 0.218 0.174 0.42325 0.25 0.65625 0.118 0.363 0.17086 0.67703 0.13086 0.95703l-0.27148 1.9004a0.512 0.512 0 0 0 0.86719 0.43164l2.3828-2.3848c0.41-0.41 0.66842-0.95034 0.73242-1.5273l0.23438-2.3496c-0.09411-0.038713-0.18846-0.077341-0.28125-0.11719-0.16801-0.072149-0.3348-0.14642-0.49805-0.22266-0.16325-0.076239-0.3245-0.15356-0.48242-0.23438-0.15792-0.08081-0.31281-0.16414-0.46484-0.25-0.15203-0.085861-0.29973-0.17423-0.44531-0.26562-0.14558-0.091394-0.28917-0.1858-0.42773-0.2832-0.13857-0.097408-0.2733-0.19883-0.4043-0.30273s-0.258-0.20944-0.38086-0.32031c-0.12286-0.11088-0.24131-0.22542-0.35547-0.34375-0.11416-0.11833-0.22462-0.24139-0.33008-0.36719s-0.20542-0.2559-0.30273-0.38867c-0.097312-0.13278-0.19152-0.26893-0.28125-0.4082-0.08973-0.13928-0.1751-0.28049-0.25781-0.42578-0.08271-0.1453-0.16203-0.29448-0.23828-0.44531-0.076252-0.15083-0.15035-0.30309-0.2207-0.45898-0.070355-0.15589-0.1381-0.31414-0.20312-0.47461-0.061639-0.15212-0.1204-0.30708-0.17773-0.46289z"
          fill="#a40"
        />
        <path
          d="m6.501 3.7584c0.057336 0.15582 0.1161 0.31077 0.17773 0.46289 0.06502 0.16047 0.13277 0.31872 0.20312 0.47461 0.070355 0.15589 0.14445 0.30815 0.2207 0.45898 0.076252 0.15083 0.15557 0.30002 0.23828 0.44531 0.08271 0.1453 0.16808 0.28651 0.25781 0.42578 0.08973 0.13928 0.18394 0.27543 0.28125 0.4082 0.097312 0.13278 0.19728 0.26288 0.30273 0.38867s0.21592 0.24885 0.33008 0.36719c0.11416 0.11833 0.23261 0.23287 0.35547 0.34375 0.12286 0.11088 0.24987 0.21641 0.38086 0.32031s0.26573 0.20533 0.4043 0.30273c0.13857 0.097408 0.28215 0.19181 0.42773 0.2832 0.14558 0.091394 0.29328 0.17976 0.44531 0.26562 0.15203 0.085862 0.30692 0.16919 0.46484 0.25 0.15792 0.08081 0.31918 0.15814 0.48242 0.23438 0.16325 0.076239 0.33003 0.15051 0.49805 0.22266 0.09279 0.039847 0.18714 0.078474 0.28125 0.11719l0.0059-0.058594h-2e-3c2.307-2.592 3.2776-4.6828 3.6406-6.2168 0.21-0.887 0.21416-1.5814 0.16016-2.0664a3.578 3.578 0 0 0-0.10742-0.5625 2.22 2.22 0 0 0-0.07813-0.23047c-0.073-0.164-0.16756-0.23392-0.35156-0.29492a2.35 2.35 0 0 0-0.16016-0.044922 3.797 3.797 0 0 0-0.57031-0.09375c-0.49-0.044-1.1901-0.0305-2.0801 0.1875-1.536 0.374-3.6172 1.3445-6.1602 3.6055zm5.209-0.87695c0.39336-0.018659 0.75595 0.099266 1.0176 0.36133 0.599 0.599 0.43762 1.7303-0.35938 2.5293h-2e-3c-0.79695 0.8-1.9293 0.96228-2.5273 0.36328-0.598-0.6-0.43567-1.7342 0.36133-2.5332 0.44888-0.44944 1.004-0.69671 1.5098-0.7207z"
          fill="#f60"
        />
        <path
          d="m5.205 10.787a7.632 7.632 0 0 0 1.804 1.352c-1.118 1.007-4.929 2.028-5.054 1.903-0.126-0.127 0.737-4.189 1.839-5.18 0.346 0.69 0.837 1.35 1.411 1.925z"
          fill="#f00"
        />
      </g>
    </svg>,
    <svg key={3} width="1em" height="1em" viewBox="0 0 24 24">
      <g transform="matrix(1.2 0 0 1.2 -2.3522 -2.3478)">
        <path
          d="m18.483 16.767c-0.6363 0.1521-1.3005 0.2326-1.9834 0.2326-4.6944 0-8.5-3.8056-8.5-8.5 0-0.48348 0.04036-0.95752 0.11791-1.419-0.03619 0.03481-0.07359 0.06687-0.11297 0.09676-0.28061 0.21302-0.63009 0.2921-1.329 0.45025l-0.63635 0.14398c-2.4597 0.55652-3.6895 0.83478-3.9821 1.7757-0.2926 0.94096 0.54583 1.9214 2.2227 3.8822l0.43382 0.5073c0.4765 0.5572 0.71476 0.8358 0.82194 1.1805 0.10719 0.3447 0.07117 0.7164-8.8e-4 1.4599l-0.06558 0.6768c-0.25352 2.6162-0.38028 3.9243 0.38575 4.5058 0.76602 0.5815 1.9175 0.0514 4.2206-1.009l0.5958-0.2744c0.6544-0.3013 0.9816-0.4519 1.3285-0.4519s0.6741 0.1506 1.3285 0.4519l0.5958 0.2744c2.303 1.0604 3.4545 1.5905 4.2206 1.009 0.766-0.5815 0.6392-1.8896 0.3857-4.5058z"
          fill="#000084"
        />
        <path
          d="m9.153 5.4084-0.3277 0.58785c-0.35994 0.64571-0.53991 0.96856-0.82052 1.1816 0.03938-0.0299 0.07678-0.06195 0.11297-0.09676-0.07755 0.46144-0.11791 0.93548-0.11791 1.419 0 4.6944 3.8055 8.5 8.5 8.5 0.6829 0 1.347-0.0805 1.9834-0.2326l-0.0184-0.1898c-0.0721-0.7435-0.1081-1.1152-9e-4 -1.4599s0.3454-0.6233 0.8219-1.1805l0.4339-0.5073c1.6768-1.9608 2.5152-2.9413 2.2226-3.8822-0.2926-0.94091-1.5224-1.2192-3.9821-1.7757l-0.6363-0.14398c-0.699-0.15815-1.0485-0.23722-1.3291-0.45024s-0.4606-0.53587-0.8205-1.1816l-0.3277-0.58787c-1.2667-2.2722-1.9-3.4084-2.8468-3.4084-0.9469 0-1.5802 1.1361-2.8469 3.4084z"
          fill="#3b059f"
        />
      </g>
    </svg>,
  ],
  text: ["Today", "Popular", "Rocket odds"],
};

const Logo = ({ team, placeholder }) => {
  // const [img, setImg] = useState(placeholder);

  // const getLogo = async () => {
  //   const data = await apiController.getLogo(team);
  //   if (data) setImg(data);
  // };

  // useEffect(() => {
  //   let imgContainer = document.getElementById(team.split(" ").join(""));
  //   inView(imgContainer, () => setTimeout(getLogo, 800));
  // }, [img]);

  return (
    <Image
      // id={team.split(" ").join("")}
      src={placeholder}
      width={40}
      height={30}
      priority
      alt=""
    />
  );
};

function Slider() {
  const [mounted, setMounted] = useState(false);
  const { globalGames, setGame, favSport } = useContext(Context);

  const [games, setGames] = useState(null);
  const [active, setActive] = useState(0);
  const [activeLeague, setActiveLeague] = useState(0);
  const leagues = useRef([]);
  const div = useRef(null);
  const span = useRef(null);
  const activeRef = useRef(0);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: false,
    rubberband: false,
    defaultAnimation: {
      duration: 1000,
    },
    animationEnded: () => {
      setActiveLeague(activeRef.current);
    },
    slideChanged: (e) => {
      if (leagues.current.length > 0) {
        let i = 0;

        while (leagues.current.length > i) {
          if (
            e.track.details.abs <
            (leagues.current.length - 1 === i
              ? e.track.details.length + 1
              : leagues.current[i + 1]?.pos)
          )
            break;

          i++;
        }

        span.current.scrollTo(span.current.children[i].offsetLeft - 50, 0);
        activeRef.current = i;
      }
    },
  });

  const getGames = async (filter = "Today") => {
    setGames("loading");

    const favSport = parseInt(localStorage.getItem("favSport") || 0) + 1;

    let data = globalGames.current[favSport]
      ? globalGames.current[favSport]
      : await apiController.getGlobalGames(favSport);

    if (data) {
      if (!globalGames.current[favSport]) globalGames.current[favSport] = data;

      let l = "";
      let arr = [];

      const lFilter = (v) => {
        if (filter === "Today") {
          return (
            v.starts.split("T")[0] === new Date().toISOString().split("T")[0]
          );
        } else if (filter === "Popular") {
          return mainLeagues.includes(v.league_id);
        }
        if (filter === "Rocket odds") {
          return v.rocketOdds;
        }
      };

      let todayGames = arrange(data.filter(lFilter).slice(0, 30));

      todayGames.forEach((elem, key) => {
        if (elem.league_name !== l) {
          arr.push({ v: elem.league_name, pos: key });
          l = elem.league_name;
        }
      });
      leagues.current = arr;
      setGames(todayGames);
      return true;
    } else {
      setGames("error");
      return false;
    }
  };

  // const changeSport = async (id) => {
  //   setActiveSport(id - 1);
  //   let res = await getGames(id);
  //   if (!res) alertService.error("No Internet Connection");
  // };

  useEffect(() => {
    games === null && getGames();
  }, []);

  const slice = (v) => {
    if (v.length > 20)
      return `${v.slice(0, 20).split(" ").slice(0, -1).join(" ")}...`;
    return v;
  };

  useEffect(() => {
    !mounted && setMounted(true);
  }, [mounted]);

  return (
    <>
      <div
        ref={div}
        className="w-screen scroll-smooth no-bars pr-7 whitespace-nowrap overflow-x-scroll overflow-y-hidden md:mt-14 gap-3 flex items-center justify-start pl-8"
      >
        {categories.text.map((txt, key) => (
          <button
            key={key}
            onClick={() => {
              setActive(key);
              getGames(txt);
            }}
            className={`${
              key === active ? `dark:bg-c4/50 bg-c3/60` : ""
            } fx gap-1.5 last-of-type:mr-6 active:scale-90 rounded-t-2xl duration-150 pl-3.5 pr-5 pt-2 pb-1.5 mt-1.5 relative text-xs`}
          >
            {categories.icons[key]}
            {txt}
          </button>
        ))}
      </div>
      <Retry
        state={games}
        loading={
          <div className="w-full h-44 relative from-c3/60 to-transparent bg-gradient-to-b dark:from-c4 dark:to-c4 inset-0 z-20 fx flex-col pb-2">
            <Skeleton className="pl-7 pb-0.5 flex rounded-lg ml-3 mt-3 w-2/3" />
            <div className="fx flex-1 w-full relative">
              {[0, 1].map((key2) => (
                <div
                  key={key2}
                  className={`${
                    key2 && "order-3"
                  } w-1/3 fx flex-col h-full overflow-hidden`}
                >
                  <span className="w-full mb-1 flex-1 fx">
                    <Image
                      src={"/badge.svg"}
                      width={35}
                      height={30}
                      priority
                      alt=""
                    />
                  </span>
                  <Skeleton className="text-sm rounded-md w-[65%]" />
                </div>
              ))}
              <Skeleton className="order-2 rounded-md h-8 mt-3 flex flex-1" />
            </div>
            <div className="w-4/5 gap-2 pb-1 flex h-10 mt-3">
              {[0, 1, 2].map((key) => (
                <Skeleton className="h-full rounded-md flex-1" key={key} />
              ))}
            </div>
          </div>
        }
        error={
          <Error
            type
            refresh={() => getGames()}
            className="w-full h-44 gap-2 fx relative from-c3/60 to-transparent bg-gradient-to-b dark:from-c4 dark:to-c4 inset-0 z-20 fx flex-col pb-2"
          />
        }
      >
        {typeof games === "object" && games && games.length > 0 ? (
          <div className="from-c3/60 to-transparent bg-gradient-to-b w-full flex flex-col dark:from-c4 dark:to-c4">
            <span
              ref={span}
              className=" pl-7 gap-3 scroll-smooth overflow-x-scroll no-bars pt-1 pb-0.5 flex whitespace-nowrap w-full"
            >
              {leagues.current.map((l, key) => (
                <button
                  key={key}
                  className={`rounded-xl px-3 active:opacity-10 duration-150 flex mt-0.5 mb-1 gap-1 pt-1.5 pb-1 text-xs ${
                    activeLeague === key
                      ? "bg-c2/10 dark:bg-c2/5 text-c2"
                      : "dark:text-white/50 text-black bg-c3 dark:bg-black/25"
                  }`}
                  onClick={() => instanceRef.current.moveToIdx(l.pos)}
                >
                  {l.v}
                </button>
              ))}
            </span>
            <div
              key={active}
              ref={sliderRef}
              className="keen-slider relative w-full"
            >
              {games.map((g, key) => (
                <div
                  key={key}
                  className="w-full fx flex-col pb-2 keen-slider__slide"
                >
                  <div
                    onClick={() =>
                      setGame({
                        id: g.event_id,
                        sport: g.sport_id,
                        home: g.home,
                        away: g.away,
                      })
                    }
                    className="fx rounded-lg pb-2 flex-1 w-full relative"
                  >
                    {[0, 1].map((key2) => (
                      <div
                        key={key2}
                        className={`${
                          key2 && "order-3"
                        } w-1/3 flex justify-start items-center flex-col h-full overflow-hidden`}
                      >
                        <motion.span className="w-full h-14 fx">
                          <Logo
                            team={key2 ? g.away : g.home}
                            placeholder={key2 ? "/away.svg" : "/home.svg"}
                          />
                        </motion.span>
                        <span className="text-xs fx max-h-8 flex-1 px-2 md:px-5 w-[80%] text-center">
                          {slice(key2 ? g.away : g.home)}
                        </span>
                      </div>
                    ))}
                    <div className="order-2 relative min-h-[40px] justify-between flex items-center z-10 flex-1">
                      {/* {[0, 1].map((key2) => (
                        <span
                          key={key2}
                          className={`text-2xl opacity-75 px-2 ${
                            key2 && "order-3"
                          }`}
                        >
                          0
                        </span>
                      ))} */}
                      <span className="order-2 flex-1  flex items-start px-6 flex-col text-sm text-c2">
                        <span className=" dark:text-white text-sm">
                          {condition(
                            dateDifference(
                              new Date().toISOString(),
                              g.starts.split("T")[0]
                            ),
                            [0, 1, "*"],
                            [
                              "Today",
                              "Tomorrow",
                              weekDays[
                                new Date(g.starts.split("T")[0]).getDay()
                              ],
                            ]
                          )}
                        </span>
                        <span className="text-2xl font-bold">
                          {g.starts.split("T")[1].slice(0, -3)}
                        </span>
                      </span>
                    </div>
                    <Image
                      className="absolute opacity-10"
                      src={"vs.svg"}
                      width={75}
                      height={50}
                      priority
                      alt=""
                    ></Image>
                  </div>
                  <Odds game={g} slider mkt={"1X2"} className={"w-4/5"} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Error
            className="w-full h-48 gap-2 fx relative from-c3/60 to-transparent bg-gradient-to-b dark:from-c4 dark:to-c4 inset-0 z-20 fx flex-col mb-1 pb-2"
            refresh={() => getGames()}
          >
            <span className=" relative aft after:h-1 rotate-45 fx after:w-[120%] opacity-60 after:bg-c2">
              <BiFootball className="text-2xl" />
            </span>
            There are no games available
          </Error>
        )}
      </Retry>
      {/* <ul className="px-5 py-1 mt-1 dark:mb-2 whitespace-nowrap overflow-x-scroll no-bars overflow-y-hidden flex gap-2 w-full">
        {[0, 1, 2].map((key) => {
          return (
            <li
              key={key}
              onClick={() => changeSport(key + 1)}
              className={`px-4 active:scale-90 overflow-hidden relative duration-150 fx items-center gap-1 py-1.5 rounded-2xl ${
                key === activeSport
                  ? "dark:text-c2 text-white dark:from-c1/0 dark:bg-c4 dark:to-c2/0 from-c1 to-c2 bg-gradient-to-l"
                  : "text-white dark:bg-c4 bg-c4/50"
              }`}
            >
              <Svg
                id={key + 1}
                className={`absolute scale-[2] opacity-25 -left-1 ${
                  key === activeSport
                    ? "text-white dark:opacity-20 dark:text-c2"
                    : "dark:text-black dark:opacity-40"
                }`}
              />
              <span className="z-10">{sports[key].item}</span>
            </li>
          );
        })}
      </ul> */}
    </>
  );
}

export default Slider;
