import React, { useContext, useEffect } from "react";
import GameList from "./GameList";
import { Context } from "../layout";

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

export default function GameDays() {
  const { globalGames, getGlobalGames } = useContext(Context);

  useEffect(() => {
    if (globalGames[1].games === null) getGlobalGames(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalGames]);

  return (
    <>
      {globalGames.map((v, key) => (
        <GameList
          index={key}
          key={key}
          last={key === globalGames.length - 1}
          gGames={v}
        />
      ))}
    </>
  );
}
