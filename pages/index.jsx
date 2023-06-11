import { useEffect, useState } from "react";
import axios from "axios";
import Slider from "@/components/Slider";
import GameList from "@/components/Games";
import { alertService } from "@/services";
import mgames from "@/helpers/games";

// export async function getServerSideProps() {
//   try {
//     return {
//       props: { isConnected: true },
//     };
//   } catch (e) {
//     return {
//       props: { isConnected: false },
//     };
//   }
// }

export default function Home() {
  // const [games, setGames] = useState(mgames);

  const getGames = async () => {
    try {
      // let { data } = await axios.get(
      //   "https://api.betting-api.com/1xbet/football/live/all",
      //   {
      //     headers: {
      //       Authorization: `50b134713d5b4f4fa563d9063c0be5b9820c6bac24aa4637bfde0bb96eb5e897`,
      //     },
      //   }
      // );
      let data = mgames;

      if (data) {
        setGames({
          all: data,
          isLive: data.filter((d) => d.minute !== undefined),
          notStart: data.filter((d) => d.minute === undefined),
        });
      }
    } catch (error) {
      alertService.error("No Internet");
    }
  };

  // useEffect(() => {
  //   getGames();
  // }, []);

  return (
    <main className="flex items-center min-h-screen flex-col bg-black">
      <div className=" h-[50px] flex w-full gap-2 mb-2 justify-between">
        <span className="bg-c4 h-full w-[30%] rounded-br-2xl"></span>
        <span className="bg-c4 h-full w-[68%] rounded-bl-2xl"></span>
      </div>
      <Slider games={mgames} />
      <GameList title={"Live"} games={mgames} />
      <GameList title={"Live"} games={mgames} />
      {/* <GameList
        title={"Today"}
        className={"rounded-b-3xl"}
        games={games?.notStart}
      /> */}
    </main>
  );
}
