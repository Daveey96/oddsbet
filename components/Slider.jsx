import Image from "next/image";
import React, { useEffect, useState } from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { SkeletonLoad } from "./services/Loaders";
import Odds from "./games/Odds";
import { BiFootball, BiTennisBall } from "react-icons/bi";

function Slider({ games }) {
  const [mounted, setMounted] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      // slideChanged() {
      //   console.log("slide changed");
      //   console.log(instanceRef);
      // },
      loop: true,
      dragSpeed: 2,
      rubberband: false,
      defaultAnimation: {
        duration: 1000,
      },
    },
    [
      // add plugins here
    ]
  );

  let mgames = games
    ? games.filter((g) => g.minute).slice(0, 4)
    : Array(4).fill(false);

  useEffect(() => {
    setTimeout(() => {
      !mounted && setMounted(true);
    }, 1000);
  }, [mounted]);

  return (
    <>
      <ul className="mt-10 px-2 mb-2 whitespace-nowrap overflow-x-scroll no-bars overflow-y-hidden flex gap-3 w-full">
        <li className="px-3 fx gap-0.5 py-1.5 bg-c4 rounded-t-2xl rounded-b-lg">
          <BiFootball className="text-c2 mt-0.5" /> Uefa Nations League
        </li>
        <li className="px-3 fx gap-0.5 py-1.5 bg-c4 rounded-t-2xl rounded-b-lg">
          <BiFootball className="text-c2 mt-0.5" />
          La liga
        </li>
        <li className="px-3 fx gap-0.5 py-1.5 bg-c4 rounded-t-2xl rounded-b-lg">
          <BiTennisBall className="text-c2 mt-0.5" />
          Tennis
        </li>
      </ul>
      <div
        ref={sliderRef}
        className="keen-slider h-52 relative mb-2 dark:bg-c4 w-full"
      >
        {mgames.map((g, key) => (
          <div key={key} className="w-full fx flex-col pb-2 keen-slider__slide">
            <div className="fx pt-10 flex-1 w-full relative">
              {[0, 1].map((key2) => (
                <div
                  key={key2}
                  className={`${
                    key2 && "order-3"
                  } w-1/3 fx flex-col h-full overflow-hidden gap-2`}
                >
                  <span className="w-full flex-1 fx">
                    <Image
                      src={key2 ? "/badge.svg" : "/badge.svg"}
                      width={50}
                      height={30}
                      priority
                      alt=""
                    />
                  </span>
                  <SkeletonLoad
                    state={g}
                    className="text-sm w-[65%] opacity-80 overflow-hidden text-center whitespace-nowrap text-ellipsis"
                  >
                    {key2 ? g.team2 : g.team1}
                  </SkeletonLoad>
                </div>
              ))}
              <SkeletonLoad
                state={g}
                className="order-2 relative min-h-[40px] justify-between flex items-center z-10 flex-1"
              >
                {[0, 1].map((key2) => (
                  <span
                    key={key2}
                    className={`text-2xl opacity-75 px-2 ${key2 && "order-3"}`}
                  >
                    {key2 ? g.score2 : g.score1}
                  </span>
                ))}
                <span className="order-2 flex-1 fx flex-col text-sm text-c2">
                  <span className="text-green-600 text-sm px-2 mb-1 rounded-r-xl bg-green-700/10">
                    Live
                  </span>
                  <span iClass="px-5 scale-y-50" className="text-center">
                    {g.minute + "' " + g.seconds + "'"}
                  </span>
                </span>
              </SkeletonLoad>
              <SkeletonLoad
                state={g}
                className="absolute top-3 text-sm w-[55%] text-center opacity-50 overflow-hidden whitespace-nowrap text-ellipsis z-10"
              >
                {g.title}
              </SkeletonLoad>
              <Image
                className="absolute opacity-20"
                src={"vs.svg"}
                width={70}
                height={50}
                priority
                alt=""
              ></Image>
            </div>
            <Odds slider game={g} className={"w-4/5 mt-6"} />
          </div>
        ))}
        {!mounted && (
          <div className="w-full absolute bg-c4 inset-0 z-20 fx flex-col pb-2">
            <div className="fx pt-10 flex-1 w-full relative">
              {[0, 1].map((key2) => (
                <div
                  key={key2}
                  className={`${
                    key2 && "order-3"
                  } w-1/3 fx flex-col h-full overflow-hidden gap-2`}
                >
                  <span className="w-full flex-1 fx">
                    <Image
                      src={key2 ? "/badge.svg" : "/badge.svg"}
                      width={50}
                      height={30}
                      priority
                      alt=""
                    />
                  </span>
                  <SkeletonLoad className="text-sm w-[65%] opacity-80 overflow-hidden text-center whitespace-nowrap text-ellipsis"></SkeletonLoad>
                </div>
              ))}
              <SkeletonLoad className="order-2 relative justify-between h-10 flex items-center z-10 flex-1" />
            </div>
            <SkeletonLoad className="absolute top-3 w-[60%] h-4 z-10" />
            <div className="w-4/5 gap-2 flex h-10 mt-6">
              {[0, 1, 2].map((key) => (
                <SkeletonLoad className="h-full flex-1" key={key} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Slider;
