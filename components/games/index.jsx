import React, { useEffect, useRef, useState } from "react";
import { getDate } from "@/helpers";
import football from "@/helpers/json/football";
import GameList from "./GameList";

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
    id: 3,
    item: "basketball",
    markets: [
      { item: "Winner", v: "WL" },
      { item: "over | under", v: "OU" },
      { item: "home over | under", v: "HOU" },
      { item: "away over | under", v: "AOU" },
    ],
  },
  {
    id: 2,
    item: "tennis",
    markets: [
      { item: "WDL", v: "WDL" },
      { item: "Double Chance", v: "DB" },
      { item: "over | under", v: "OU" },
      { item: "home over | under", v: "HOU" },
      { item: "away over | under", v: "AOU" },
    ],
  },
  {
    id: 6,
    item: "handball",
    markets: [
      { item: "WDL", v: "WDL" },
      { item: "Double Chance", v: "DB" },
      { item: "over | under", v: "OU" },
      { item: "home over | under", v: "HOU" },
      { item: "away over | under", v: "AOU" },
    ],
  },
  {
    id: 7,
    item: "mixed martial Arts",
    markets: [
      { item: "WDL", v: "WDL" },
      { item: "Double Chance", v: "DB" },
      { item: "over | under", v: "OU" },
      { item: "home over | under", v: "HOU" },
      { item: "away over | under", v: "AOU" },
    ],
  },
  {
    id: 8,
    item: "baseball",
    markets: [
      { item: "WDL", v: "WDL" },
      { item: "Double Chance", v: "DB" },
      { item: "over | under", v: "OU" },
      { item: "home over | under", v: "HOU" },
      { item: "away over | under", v: "AOU" },
    ],
  },
];

// const filterGames = (data, isoString, len) => {
//   let dataArr = [];
//   let dataSpecialArr = [];
//   let filter = data.events.filter((v) => v.starts.split("T")[0] === isoString);
//   let l = filter.filter((v) => v.parent_id !== null);

//   filter.forEach((element) => {
//     if (element.parent_id) {
//       let r = filter.filter((v) => v.event_id === element.parent_id);
//       r[0].periods.num_0[element.resulting_unit.toLowerCase()] =
//         element.periods.num_0.totals;
//       dataSpecialArr.push(r[0]);
//     } else {
//       const g = l.filter((v) => v.parent_id === element.event_id);
//       if (!g) dataArr.push(element);
//     }
//   });

//   let Arr = [
//     ...dataSpecialArr,
//     ...dataArr.sort((a, b) => a.league_id - b.league_id),
//   ];

//   let initialLen = Arr.length;

//   if (len) Arr = Arr.slice(0, len);

//   return {
//     len: initialLen,
//     v: Arr.sort(
//       (a, b) =>
//         parseInt(a.starts.split("T")[1].slice(0, 2)) -
//         parseInt(b.starts.split("T")[1].slice(0, 2))
//     ),
//   };
// };
export const filterGames = (data, isoString, len) => {
  let filter = data.events.filter((v) => v.starts.split("T")[0] === isoString);
  // .filter((v) => v?.parent_id !== null);

  let initialLen = filter.length;
  if (len) filter = filter.slice(0, len);

  return {
    len: initialLen,
    v: filter,
  };
};

export default function GameDays() {
  const [games, setGames] = useState(null);
  const array = useRef(["Live", "Today"]);

  const getGames = async (id) => {
    setGames("loading");

    const data = football;
    // const liveData = await apiController.getMatches(id, true);

    if (data.events) {
      let daysArr = ["Live"];
      let genArray = [null];

      for (let i = 0; i < 10; i++) {
        const { isoString, weekDay } = getDate(i);
        const games = filterGames(data, isoString, 5);
        const md = `${isoString.split("-")[1]}/${isoString.split("-")[2]}`;

        if (games.len > 0) {
          daysArr.push(i ? `${weekDay} ${md}` : `Today ${md}`);
          genArray.push(games);
        }
      }

      array.current = daysArr;
      setGames(genArray);
    } else setGames("error");
  };

  useEffect(() => {
    games === null && getGames(1);
  }, [games]);

  return (
    <>
      {array.current.map((title, key) => (
        <GameList
          getGames={getGames}
          title={title}
          index={key}
          key={key}
          last={key === array.current.length - 1}
          globalGames={
            typeof games === "object" && games !== null ? games[key] : games
          }
        />
      ))}
    </>
  );
}
