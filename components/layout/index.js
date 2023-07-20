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
import BetList from "../games/BetList";
import Panel from "./Panel";

export const Context = createContext(null);

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [betList, setBetList] = useState([]);
  const [gameId, setGameId] = useState(null);
  const [backdrop, setBackdrop] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      let data = await userController.getUser();
      setUser(data);
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
      }}
    >
      <ThemeProvider attribute="class">
        <Nav />
        <Prompt />
        <main className="flex h-screen fixed inset-0 md:px-7 px-0 text-sm gap-3 bg-white dark:bg-black text-black dark:text-white">
          <Panel />
          <div className="flex flex-col md:w-1/2 w-full">
            <div className="min-h-[calc(100vh_-_70px)] w-full-c w-full flex flex-col">
              {children}
            </div>
            <Stats />
            <Footer />
          </div>
          <BetList className="" />
        </main>
        <Overlay />
        <Tab />
        <BlurredModal
          state={backdrop}
          type={"allChidren"}
          className="flex text-sm backdrop-blur-xl flex-col z-[35] items-center"
          iClass={[
            "text-white/20 mt-[50px] text-sm px-10 pt-2 mb-4",
            "relative max-w-[480px] w-full mt-3 fx",
          ]}
        >
          <>Signup | Signin to Oddsbet</>
          <Auth />
        </BlurredModal>
      </ThemeProvider>
    </Context.Provider>
  );
}
