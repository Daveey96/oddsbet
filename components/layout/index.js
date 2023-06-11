import { createContext, useEffect, useState } from "react";
import Tab from "./Tab";
import Nav from "./Nav";
import Footer from "./Footer";
import { userService } from "@/services";
import { ThemeProvider } from "next-themes";

export const Context = createContext(null);

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [betList, setBetList] = useState([]);

  const getUser = async () => {
    const data = await userService.getUser();
    setUser(data.user);
  };

  useEffect(() => {
    user === null && getUser();
  }, [user]);

  return (
    <Context.Provider value={{ user, setUser, betList, setBetList }}>
      <ThemeProvider attribute="class">
        <Nav />
        {children}
        <Tab />
        <Footer />
      </ThemeProvider>
    </Context.Provider>
  );
}
