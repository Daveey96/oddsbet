import Image from "next/image";
import React, { useEffect, useState } from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { SkeletonLoad } from "./services/Loaders";
import Odds from "./Odds";

function Slider({ games }) {
  const [mounted, setMounted] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      slideChanged() {
        console.log("slide changed");
        console.log(instanceRef);
      },
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

  useEffect(() => {
    setMounted(true);
  }, []);

  let mgames = games
    ? games.filter((g) => g.minute).slice(0, 4)
    : Array(4).fill(false);

  return (
    <div
      ref={sliderRef}
      className=" keen-slider relative mb-2 bg-c4 rounded-3xl overflow-hidden w-full"
    >
      {mgames.map((g, key) => (
        <div
          key={key}
          className="w-full fx flex-col pb-2 items-center keen-slider__slide"
        >
          {mounted && (
            <>
              <div className="fx pt-10 w-full relative">
                {[0, 1].map((key2) => (
                  <div
                    key={key2}
                    className={`${
                      key2 && "order-3"
                    } w-1/3 fx flex-col overflow-hidden gap-2`}
                  >
                    <span className="h-20 w-full fx">
                      <Image
                        src={key2 ? "/badge.svg" : "/badge.svg"}
                        className="opacity-20"
                        width={60}
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
                <div className="order-2 relative h-full overflow-visible justify-between flex items-center z-10 flex-1">
                  {[0, 1].map((key2) => (
                    <SkeletonLoad
                      key={key2}
                      state={g}
                      iClass="px-2"
                      className={`text-3xl opacity-75 ${key2 && "order-3"}`}
                    >
                      {key2 ? g.score2 : g.score1}
                    </SkeletonLoad>
                  ))}
                  <span className="order-2 flex-1 fx flex-col text-sm text-c2">
                    <span className="text-green-600 text-sm px-2 mb-1 rounded-r-xl bg-green-700/10">
                      Live
                    </span>
                    <SkeletonLoad
                      iClass="px-5 scale-y-50"
                      className="text-center"
                      state={g}
                    >
                      {g.minute + "' " + g.seconds + "'"}
                    </SkeletonLoad>
                  </span>
                </div>
                <SkeletonLoad
                  state={g}
                  className="absolute top-3 text-[15px] w-[55%] text-center opacity-50 overflow-hidden whitespace-nowrap text-ellipsis z-10"
                >
                  {g.title}
                </SkeletonLoad>
                <Image
                  className="absolute opacity-5"
                  src={"vs.svg"}
                  width={100}
                  height={50}
                  priority
                  alt=""
                ></Image>
              </div>
              <Odds slider game={g} className={"w-4/5 mt-6"} />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Slider;
