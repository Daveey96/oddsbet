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

const SideBar = ({ className, children }) => {
  return (
    <aside
      className={
        "bg-c4 md:flex hidden rounded-2xl sticky top-12 h-[calc(100vh_-_60px)] flex-1 " +
        className
      }
    >
      {children}
    </aside>
  );
};

export default function Layout({ children }) {
  const [user, setUser] = useState(undefined);
  const [betList, setBetList] = useState([]);
  const [gameId, setGameId] = useState(null);
  const [backdrop, setBackdrop] = useState(false);

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
        <main className="flex md:px-7 px-0 text-sm gap-3 bg-white dark:bg-black text-black dark:text-white">
          <SideBar className={""}>left</SideBar>
          <div className="flex flex-col md:w-1/2 w-full">
            <div className="min-h-[calc(100vh_-_70px)] w-full-c w-full flex flex-col">
              {children}
            </div>
            <GameAnalysis />
            <Footer />
          </div>
          <SideBar className={""}>right</SideBar>
        </main>
        <Overlay />
        <Tab />
      </ThemeProvider>
    </Context.Provider>
  );
}
