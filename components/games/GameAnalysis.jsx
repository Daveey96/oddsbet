import React, { useContext, useEffect } from "react";
import { Context } from "../layout";
import Animated from "../Animated";
import axios from "axios";

export default function GameAnalysis() {
  let { gameId, setGameId } = useContext(Context);

  return (
    <Animated
      state={gameId}
      className="fixed h-4/5 bottom-0 z-40 w-full bg-black"
    >
      <header></header>
      <span onClick={() => setGameId(null)}>i am a fucking game {gameId}</span>
    </Animated>
  );
}
