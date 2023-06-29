import { createContext, useEffect, useState } from "react";
import Tab from "./Tab";
import Nav from "./Nav";
import Footer from "./Footer";
import { userService } from "@/services";
import { ThemeProvider } from "next-themes";
import Prompt from "../services/Prompt";
import Overlay from "../services/Overlay";
import GameAnalysis from "../games/GameAnalysis";
import Auth from "../Auth";

export const Context = createContext(null);

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [betList, setBetList] = useState([]);
  const [gameId, setGameId] = useState(null);
  const [backdrop, setBackdrop] = useState(false);

  const getUser = async () => {
    const data = await userService.getUser();
    setUser(data.user);
  };

  useEffect(() => {
    user === null && getUser();
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
        <Auth />
        <Prompt />
        <main className="flex px-7 text-sm gap-3 bg-white dark:bg-black text-black dark:text-white">
          <aside className="bg-c4 rounded-2xl sticky top-12 h-[calc(100vh_-_60px)] flex-1">
            me
          </aside>{" "}
          <div className="flex flex-col w-1/2">
            <div className="min-h-[calc(100vh_-_70px)] w-full-c w-full flex flex-col">
              {children}
            </div>
            <GameAnalysis />
            <Footer />
          </div>
          <aside className="bg-c4 rounded-2xl sticky top-12 h-[calc(100vh_-_60px)] flex-1">
            me
          </aside>
        </main>
        <Overlay />
        <Tab />
      </ThemeProvider>
    </Context.Provider>
  );
}
