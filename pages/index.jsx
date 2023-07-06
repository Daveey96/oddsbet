import Slider from "@/components/Slider";
import GameDays from "@/components/games";

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
  return (
    <>
      <Slider />
      <GameDays />
    </>
  );
}
