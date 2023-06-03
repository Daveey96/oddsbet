import Image from "next/image";
import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { BiSearchAlt, BiUser } from "react-icons/bi";
import games from "@/helpers/games";
import { GameLayout } from "./Games";

function Slider() {
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      slideChanged() {
        console.log("slide changed");
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

  let mgames = games.filter((g) => g.minute).slice(0, 4);

  return (
    <div
      ref={sliderRef}
      className=" keen-slider relative bg-gray-700/10 rounded-3xl overflow-hidden w-full"
    >
      {mgames.map((g, key) => (
        <div
          key={key}
          className="w-full fx flex-col pb-2 items-center keen-slider__slide"
        >
          <GameLayout slider game={g} className={"w-4/5 mt-6"}>
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
                      className=""
                      width={60}
                      height={30}
                      priority
                      alt=""
                    />
                  </span>
                  <span className="text-sm w-[65%] opacity-80 overflow-hidden text-center whitespace-nowrap text-ellipsis">
                    {key2 ? g.team2 : g.team1}
                  </span>
                </div>
              ))}
              <div className="order-2 relative h-full overflow-visible justify-between flex items-center z-10 flex-1">
                {[0, 1].map((key2) => (
                  <span className={`text-3xl opacity-75 ${key2 && "order-3"}`}>
                    {key2 ? g.score2 : g.score1}
                  </span>
                ))}
                <span className="order-2 flex-1 fx flex-col text-lg text-c2">
                  <span className="text-green-600 text-sm px-2 mb-1 rounded-r-xl bg-green-700/10">
                    Live
                  </span>
                  <span className=" text-center">
                    {g.minute + "' " + g.seconds + "'"}
                  </span>
                </span>
              </div>
              <span className="absolute top-3 text-[15px] w-[55%] text-center opacity-50 overflow-hidden whitespace-nowrap text-ellipsis z-10">
                {g.title}
              </span>
              <Image
                className="absolute opacity-5"
                src={"vs.svg"}
                width={100}
                height={100}
                priority
                alt=""
              ></Image>
            </div>
          </GameLayout>
        </div>
      ))}
    </div>
  );
}

export default Slider;
