import Slider from "@/components/Slider";
import TopSlider from "@/components/TopSlider";
import GameLayout from "@/components/games";
import Live from "@/components/games/Live";
import { Context } from "@/components/layout";
import { useContext } from "react";

export default function Home() {
  // const { globalGames, sport } = useContext(Context);
  return (
    <>
      <TopSlider />
      <Slider />
      <Live />
      <GameLayout />
    </>
  );
}
