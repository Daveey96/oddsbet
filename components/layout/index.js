import { createContext, useEffect, useState } from "react";
import Tab from "./Tab";
import Nav from "./Nav";
import Footer from "./Footer";
import { ThemeProvider } from "next-themes";
import Prompt from "../services/Prompt";
import Overlay from "../services/Overlay";
import { BlurredModal } from "../Animated";
import { userController } from "@/controllers";
import Stats from "../games/Stats";
import Panel from "./Panel";
import Auth from "../auth";
import { AnimatePresence } from "framer-motion";

export const Context = createContext(null);

export default function Layout({ children }) {
  const [betList, setBetList] = useState([]);
  const [user, setUser] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [backdrop, setBackdrop] = useState(false);
  const [ping, setPing] = useState(false);

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
        gameId,
        setGameId,
        backdrop,
        setBackdrop,
        ping,
        setPing,
      }}
    >
      <ThemeProvider attribute="class">
        <Nav />
        <Prompt />
        <div className="h-[200vh] flex flex-col w-full">
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
          <div>
            <span>fgkrtk</span>
          </div>
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
