import { useEffect, useState } from "react";
import axios from "axios";
import Slider from "@/components/Slider";
import GameList from "@/components/Games";
import { alertService } from "@/services";

export async function getServerSideProps() {
  try {
    return {
      props: { isConnected: true },
    };
  } catch (e) {
    return {
      props: { isConnected: false },
    };
  }
}

export default function Home({ isConnected }) {
  // const getUser = async () => {
  //   try {
  //     const user = await axios.post("/api/user", {
  //       user: localStorage.getItem("user"),
  //     });
  //     setUser(user);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const [games, setGames] = useState({});

  const getGames = async () => {
    try {
      let { data } = await axios.get(
        "https://api.betting-api.com/1xbet/football/live/all",
        {
          headers: {
            Authorization:
              "50b134713d5b4f4fa563d9063c0be5b9820c6bac24aa4637bfde0bb96eb5e897",
          },
        }
      );

      if (data) {
        setGames({
          isLive: data.filter((d) => d.minute !== undefined),
          notStart: data.filter((d) => d.minute === undefined),
        });
      }
    } catch (error) {
      console.log(error);
      alertService.error("No Internet");
    }
  };
  const test = async () => {
   const axios = require("axios");

   const options = {
     method: "GET",
     url: "https://sports-live-scores.p.rapidapi.com/basketball/live",
     headers: {
       "X-RapidAPI-Key": "22240fc084msh62a0c86d166238ep10d18cjsncc14a26e52e9",
       "X-RapidAPI-Host": "sports-live-scores.p.rapidapi.com",
     },
   };

   try {
     const response = await axios.request(options);
     console.log(response.data);
   } catch (error) {
     console.error(error);
   }
  };
  useEffect(() => {
    getGames();
    test();
  }, []);

  // useEffect(() => !user && getUser(), []);

  return (
    <main className="flex items-center min-h-screen gap-2 flex-col bg-black">
      <div className=" h-[50px] flex w-full justify-between">
        <span className="bg-gray-700/10 h-full w-[30%] rounded-r-2xl"></span>
        <span className="bg-gray-700/10 h-full w-[68%] rounded-l-2xl"></span>
      </div>
      <Slider />
      <GameList
        title={"Live"}
        // className={"rounded-t-3xl"}
        games={games?.isLive}
      />
      <GameList
        title={"Today"}
        className={"rounded-b-3xl"}
        games={games?.notStart}
      />
    </main>
  );
}
