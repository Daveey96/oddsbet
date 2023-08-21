import { createContext, useEffect, useRef, useState } from "react";
import Tab from "./Tab";
import Nav from "./Nav";
import Footer from "./Footer";
import { ThemeProvider } from "next-themes";
import Prompt from "../services/Prompt";
import Overlay from "../services/Overlay";
import { BlurredModal } from "../Animated";
import { apiController, userController } from "@/controllers";
import { AnimatePresence } from "framer-motion";
import Stats from "../games/Stats";
import Panel from "./Panel";
import Auth from "../auth";
import { getDate } from "@/helpers";

export const Context = createContext(null);

export const filterGames = (data, isoString) => {
  return data.filter(
    (v) => v.starts.split("T")[0] === isoString && v.parent_id === null
  );
};

export default function Layout({ children }) {
  const [betList, setBetList] = useState([]);
  const [user, setUser] = useState(null);
  const [game, setGame] = useState(null);
  const [backdrop, setBackdrop] = useState(false);
  const [ping, setPing] = useState(false);
  const [globalGames, setGlobalGames] = useState([
    { title: "Live", games: null },
    { title: "Today", games: null },
  ]);
  let specials = useRef([]);

  const getGlobalGames = async (id) => {
    setGlobalGames([
      { title: "Live", games: "loading" },
      { title: "Today", games: "loading" },
    ]);

    const { data } = await apiController.getGlobalGames(id);

    if (data) {
      let genArray = [{ title: "Live", games: null }];

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

      specials.current = data.filter((v) => v.parent_id);
      setGlobalGames(genArray);
    } else
      setGlobalGames([
        { title: "Live", games: "error" },
        { title: "Today", games: "error" },
      ]);
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

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        betList,
        setBetList,
        game,
        setGame,
        globalGames,
        getGlobalGames,
        specials,
        backdrop,
        setBackdrop,
        ping,
        setPing,
      }}
    >
      <ThemeProvider attribute="class">
        <Nav />
        <Prompt />
        <div className="h-[100vh] flex flex-col w-full">
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
        <Overlay />
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
