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
import AllGames from "../pages/AllGames";

export const Context = createContext(null);

export default function Layout({ children }) {
  const [betList, setBetList] = useState([]);
  const [user, setUser] = useState(null);
  const [game, setGame] = useState(null);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [backdrop, setBackdrop] = useState(false);
  const [ping, setPing] = useState(false);
  const globalGames = useRef({});

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
        setUser,
        setBetList,
        setGame,
        setBackdrop,
        setPing,
        user,
        betList,
        setLoading,
        game,
        globalGames,
        backdrop,
        ping,
        open,
        setOpen,
      }}
    >
      <ThemeProvider attribute="class">
        <Nav />
        <Prompt />
        <Overlay />
        <div className="h-screen flex flex-col w-full">
          <main className="z-[5] dark:bg-black bg-white inset-0 fixed flex flex-col w-full lg:relative lg:flex lg:px-7 lg:gap-3">
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
              <AllGames />
              <Animated
                state={loading}
                variants={{
                  init: { x: "-110%" },
                  show: { x: "-5%" },
                  exit: { x: "-110%" },
                }}
                className="fixed z-30 left-0 pr-3 pl-1.5 rounded-r-3xl top-1/2 dark:bg-black bg-c4 py-3"
              >
                <CircularLoader size={20} depth={3} color />
              </Animated>
            </div>
          </main>
        </div>
        <BlurredModal
          state={backdrop}
          type={"allChidren"}
          className="flex text-sm bg-white dark:bg-transparent dark:backdrop-blur-xl flex-col z-[35] items-center"
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
