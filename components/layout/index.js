import { createContext, useEffect, useRef, useState } from "react";
import Tab from "./Tab";
import Nav from "./Nav";
import Footer from "./Footer";
import { ThemeProvider } from "next-themes";
import Prompt from "../services/Prompt";
import Overlay from "../services/Overlay";
import Animated, { BlurredModal } from "../Animated";
import { apiController, userController } from "@/controllers";
import { AnimatePresence } from "framer-motion";
import Stats from "../pages/Stats";
import Panel from "./Panel";
import Auth from "../auth";
import { getDate } from "@/helpers";
import { CircularLoader } from "../services/Loaders";

export const Context = createContext(null);

export const filterGames = (data, isoString) => {
  return data.filter(
    (v) => v.starts.split("T")[0] === isoString && v.parent_id === null
  );
};

export const sports = [
  {
    sport: "soccer",
    markets: [
      { item: "WDL", v: "WDL" },
      { item: "Double Chance", v: "DB" },
      { item: "over | under", v: "OU" },
      { item: "home over | under", v: "HOU" },
      { item: "away over | under", v: "AOU" },
    ],
  },
  {
    sport: "tennis",
    markets: [
      { item: "WDL", v: "WL" },
      { item: "over | under", v: "OU" },
      { item: "home over | under", v: "HOU" },
      { item: "away over | under", v: "AOU" },
    ],
  },
  {
    sport: "basketball",
    markets: [
      { item: "Winner", v: "WL" },
      { item: "over | under", v: "OU" },
      { item: "home over | under", v: "HOU" },
      { item: "away over | under", v: "AOU" },
    ],
  },
];

export const fGames = (v, nv, num) => {
  let g = v;
  g[num] = nv;
  return g;
};

export default function Layout({ children }) {
  const [betList, setBetList] = useState([]);
  const [user, setUser] = useState(null);
  const [game, setGame] = useState(null);
  const [backdrop, setBackdrop] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ping, setPing] = useState(false);
  const [sport, setSport] = useState(1);
  const specials = useRef({ 1: [], 2: [], 3: [] });
  const [globalGames, setGlobalGames] = useState({
    1: [{ title: "Today", games: null }],
    2: [{ title: "Today", games: null }],
    3: [{ title: "Today", games: null }],
  });

  const getGlobalGames = async (id) => {
    if (
      globalGames[id][0].games !== null &&
      typeof globalGames[id][0].games === Object
    )
      return setSport(id);

    globalGames[sport][0].games !== null &&
    typeof globalGames[sport][0].games === Object
      ? setLoading(true)
      : setGlobalGames(
          fGames(globalGames, [{ title: "Today", games: "loading" }], id)
        );

    const data = await apiController.getGlobalGames(id);

    if (data) {
      let genArray = [];

      for (let i = 0; i < 8; i++) {
        const { isoString, weekDay } = getDate(i);
        const games = filterGames(data, isoString);
        const md = `${isoString.split("-")[1]}/${isoString.split("-")[2]}`;

        if (games.length > 0) {
          genArray.push({
            title: i ? `${weekDay} ${md}` : `Today ${md}`,
            games,
          });
        }
      }

      specials.current[id] = data.filter((v) => v.parent_id);
      setGlobalGames(fGames(globalGames, genArray, id));
      setSport(id);
    } else {
      globalGames[sport][0].games !== null &&
      typeof globalGames[sport][0].games === Object
        ? setLoading(false)
        : setGlobalGames(
            fGames(globalGames, [{ title: "Today", games: "loading" }], id)
          );

      setSport(id);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      let data = await userController.getUser();
      if (data.ping) setPing(true);
      setUser(data.user);
    };

    setTimeout(() => {
      user === null && getUser();
    }, 3000);
  }, [user]);

  useEffect(() => {
    globalGames[sport][0].games === null && getGlobalGames(1);
  }, [globalGames]);

  return (
    <Context.Provider
      value={{
        setUser,
        setBetList,
        setGame,
        setBackdrop,
        setPing,
        getGlobalGames,
        user,
        betList,
        game,
        globalGames,
        specials,
        backdrop,
        ping,
        sport,
      }}
    >
      <ThemeProvider attribute="class">
        <Nav />
        <Prompt />
        <Overlay />
        <div className="h-screen flex flex-col w-full">
          <main className="z-[5] dark:bg-black bg-c3 inset-0 fixed flex flex-col w-full lg:relative lg:flex lg:px-7 lg:gap-3">
            <div
              id="scroll-container"
              className="flex-1 flex flex-col w-full lg:w-[50%] overflow-y-scroll scroll-smooth overflow-x-hidden"
            >
              <div className="relative flex flex-col w-full lg:w-[50%]">
                <div className="min-h-[calc(100vh_-_70px)] w-full-c w-full flex flex-col">
                  <AnimatePresence>{children}</AnimatePresence>
                </div>
                <Footer />
              </div>
              <Panel />
              <Tab />
              <Stats />
            </div>
          </main>
        </div>
        <Animated
          state={loading}
          variants={{
            init: { x: "-110%" },
            show: { x: "0%" },
            exit: { x: "-110%" },
          }}
          className="fixed z-30 left-0 pr-3 pl-1.5 rounded-r-3xl top-1/2 bg-black py-3"
        >
          <CircularLoader size={20} depth={3} color />
        </Animated>
        <BlurredModal
          state={backdrop}
          type={"allChidren"}
          className="flex text-sm bg-c3 dark:bg-transparent dark:backdrop-blur-xl flex-col z-[35] items-center"
          iClass={[
            "dark:text-white/20 text-black mt-[50px] text-sm px-10 pt-2 mb-4",
            "relative max-w-[480px] overflow-x-hidden overflow-y-visible flex-1 w-full mt-3 flex flex-col justify-start items-center",
          ]}
        >
          <>Signup | Signin to Oddsbet</>
          <Auth />
        </BlurredModal>
      </ThemeProvider>
    </Context.Provider>
  );
}
