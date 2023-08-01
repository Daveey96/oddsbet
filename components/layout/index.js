import { createContext, useEffect, useState } from "react";
import Tab from "./Tab";
import Nav from "./Nav";
import Footer from "./Footer";
import { ThemeProvider } from "next-themes";
import Prompt from "../services/Prompt";
import Overlay from "../services/Overlay";
import Auth from "../Auth";
import { BlurredModal } from "../Animated";
import { userController } from "@/controllers";
import Stats from "../games/Stats";
import Panel from "./Panel";

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
        <main className="w-screen z-[5] h-[100vh] fixed top-0 left-0 scroll-smooth overflow-y-scroll overflow-x-hidden lg:relative lg:flex lg:px-7 lg:gap-3">
          <div className="relative flex flex-col w-full lg:w-[50%]">
            <div className="min-h-[calc(100vh_-_70px)] w-full-c w-full flex flex-col">
              {children}
            </div>
            <Footer />
          </div>
          <Panel />
          <Tab />
          <Stats />
        </main>
        {/* <main className="flex md:px-7 px-0 justify-center text-sm gap-3 bg-white dark:bg-black text-black dark:text-white">
          <div className="flex flex-col md:w-1/2 w-full">
            <div></div>
          </div>
        </main> */}
        <Overlay />
        <BlurredModal
          state={backdrop}
          type={"allChidren"}
          className="flex text-sm backdrop-blur-xl flex-col z-[35] items-center"
          iClass={[
            "text-white/20 mt-[50px] text-sm px-10 pt-2 mb-4",
            "relative max-w-[480px] overflow-x-hidden overflow-y-visible flex-1 w-full mt-3 fx",
          ]}
        >
          <>Signup | Signin to Oddsbet</>
          <Auth />
        </BlurredModal>
      </ThemeProvider>
    </Context.Provider>
  );
}
