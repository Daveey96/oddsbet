import Slider from "@/components/Slider";
import mgames from "@/helpers/games";
import GameList from "@/components/games";
import { getDate } from "@/helpers";

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

  // const getGames = async () => {
  //   try {
  // let { data } = await axios.get(
  // https://api.betting-api.com/parimatch/football/line/all
  //   "https://api.betting-api.com/1xbet/football/live/all",
  //   {
  //     headers: {
  //       Authorization: `50b134713d5b4f4fa563d9063c0be5b9820c6bac24aa4637bfde0bb96eb5e897`,
  //     },
  //   }
  // );
  //     let data = mgames;

  //     if (data) {
  //       setGames({
  //         all: data,
  //         isLive: data.filter((d) => d.minute !== undefined),
  //         notStart: data.filter((d) => d.minute === undefined),
  //       });
  //     }
  //   } catch (error) {
  //     alertService.error("No Internet");
  //   }
  // };
  let array = ["Live", "Today"];
  for (let i = 1; i < 4; i++) {
    let { weekDay } = getDate(i);
    array.push(weekDay);
  }

  return (
    <>
      <Slider games={mgames} />
      {array.map((title, key) => (
        <GameList key={key} title={title} games={mgames} />
      ))}
    </>
  );
}
