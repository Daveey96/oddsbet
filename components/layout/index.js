import { createContext, useState } from "react";
import Tab from "./Tab";
import Nav from "./Nav";
import { Alert } from "../services/Alert";
import Footer from "./Footer";

export const Context = createContext(null);

export default function Layout({ children }) {
  const [user, setUser] = useState(undefined);
  const [betList, setBetList] = useState([]);

  return (
    <Context.Provider value={{ user, setUser, betList, setBetList }}>
      <Nav />
      <Alert />
      {children}
      <Tab />
      <Footer />
    </Context.Provider>
  );
}
