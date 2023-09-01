import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Retry from "../services/Retry";
import List from "./List";
import Game from "./Game";
import { BiXCircle } from "react-icons/bi";
import { condition } from "@/helpers";
import { Context } from "../layout";
import Header from "./Header";
import GameList from "./GameList";
import { alertService } from "@/services";
import { CircularLoader } from "../services/Loaders";
import Animated from "../Animated";

export const sports = [
  {
    id: 1,
    item: "soccer",
    markets: [
      { item: "WDL", v: "WDL" },
      { item: "Double Chance", v: "DB" },
      { item: "over | under", v: "OU" },
      { item: "home over | under", v: "HOU" },
      { item: "away over | under", v: "AOU" },
    ],
  },
  {
    id: 2,
    item: "tennis",
    markets: [
      { item: "Winner", v: "WL" },
      { item: "over | under", v: "OU" },
      { item: "home over | under", v: "HOU" },
      { item: "away over | under", v: "AOU" },
    ],
  },
  {
    id: 3,
    item: "basketball",
    markets: [
      { item: "Winner", v: "WL" },
      { item: "over | under", v: "OU" },
      { item: "home over | under", v: "HOU" },
      { item: "away over | under", v: "AOU" },
    ],
  },
];

export default function GameLayout() {
  const { globalGames, getGlobalGames, setLoading } = useContext(Context);
  const [sport, setSport] = useState(1);
  const [mkt, setMkt] = useState(sports[sport - 1].markets[0].v);

  const changeSport = async (id) => {
    setLoading(true);
    const bool = await getGlobalGames(id, sport);
    setLoading(false);

    if (bool) {
      setMkt(sports[id - 1].markets[0].v);
      setSport(id);
    } else alertService.error("Connection problem");
  };

  return (
    <div id={`notLive`} className={`relative mb-1`}>
      <Header
        sport={sport}
        changeSport={changeSport}
        title={"Games"}
        lKey={sport}
        setMkt={(v) => setMkt(v)}
      />
      {globalGames[sport].map((v, key) => (
        <GameList
          index={key}
          key={key}
          mkt={mkt}
          last={key === globalGames[sport].length - 1}
          gGames={v}
        />
      ))}
    </div>
  );
}
