import GameLayout from "@/components/games";
import Live from "@/components/games/Live";
import Slider from "@/components/sliders/Slider";
import TopSlider from "@/components/sliders/TopSlider";

export default function Home() {
  return (
    <>
      <TopSlider />
      <Slider />
      <Live />
      <GameLayout />
    </>
  );
}
