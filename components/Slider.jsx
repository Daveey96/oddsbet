import Image from "next/image";
import React, { useEffect, useState } from "react";
import Retry from "./services/Retry";
import Odds from "./games/Odds";
import { useKeenSlider } from "keen-slider/react";
import { SkeletonLoad } from "./services/Loaders";
import { BiFootball, BiTv, BiXCircle } from "react-icons/bi";
import { apiService } from "@/services";
import { FaClock, FaFireAlt } from "react-icons/fa";
import { BsSlashCircle } from "react-icons/bs";
import "keen-slider/keen-slider.min.css";
import { sports } from "./games";

function Slider() {
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
  const [games, setGames] = useState(null);
  const [sportId, setSportId] = useState(1);

  const getGames = async (id) => {
    setGames("loading");

    let data = await apiService.getMatches(id, true);

    if (data.events) {
      console.log(data);
      setGames(data.events);
    } else {
      setGames("error");
    }
  };

  const changeSport = (id) => {
    getGames(id);
    setSportId(id);
  };

  useEffect(() => {
    setTimeout(() => {
      games === null && getGames();
    }, 1000);
  }, [games]);

  useEffect(() => {
    setTimeout(() => {
      !mounted && setMounted(true);
    }, 1000);
  }, [mounted]);

  return (
    <>
      <div className="mt-10 md:mt-14 -mb-1 flex justify-start px-8 text-lg">
        <span className="bg-c4 fx gap-2 pr-8 pl-5 pt-1.5 pb-2 rounded-t-3xl">
          <BiTv className="mb-0.5 text-c2" /> Live
        </span>
        <ul className="flex-1 ml-1 text-sm flex whitespace-nowrap overflow-x-scroll no-bars overflow-y-hidden">
          {[
            <>
              <FaClock className="text-c2" />
              <span className="flex flex-col leading-3 text-[10px]">
                Next <span>3 hours</span>
              </span>
            </>,
            <>
              <FaFireAlt className="text-c2" /> Hot
            </>,
          ].map((i, key) => (
            <li key={key} className="fx gap-1.5 px-3.5 h-full text-xs">
              {i}
            </li>
          ))}
        </ul>
      </div>
      <Retry
        state={games}
        loading={
          <div className="w-full h-52 rounded-2xl relative bg-c4 inset-0 z-20 fx flex-col mb-1 pb-2">
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
                      src={"/badge.svg"}
                      width={50}
                      height={30}
                      priority
                      alt=""
                    />
                  </span>
                  <SkeletonLoad className="text-sm w-[65%]" />
                </div>
              ))}
              <SkeletonLoad className="order-2 h-10 flex flex-1" />
            </div>
            <SkeletonLoad className="absolute top-3 w-[60%] h-4 z-10" />
            <div className="w-4/5 gap-2 flex h-10 mt-6">
              {[0, 1, 2].map((key) => (
                <SkeletonLoad className="h-full flex-1" key={key} />
              ))}
            </div>
          </div>
        }
        error={
          <div className="w-full h-52 gap-2 fx rounded-2xl relative bg-c4 inset-0 z-20 fx flex-col mb-1 pb-2">
            <BiXCircle className="text-3xl" />
            Something went wrong
            <button className="text-c2" onClick={() => getGames(sportId)}>
              refresh
            </button>
          </div>
        }
      >
        {typeof games === "object" && games && games.length > 0 ? (
          <div
            ref={sliderRef}
            className="keen-slider h-52 rounded-2xl relative mb-1 dark:bg-c4 w-full"
          >
            {games.map((g, key) => (
              <div
                key={key}
                className="w-full fx flex-col pb-2 keen-slider__slide"
              >
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
                          src={key2 ? "/abadge.svg" : "/hbadge.svg"}
                          width={50}
                          height={30}
                          priority
                          alt=""
                        />
                      </span>
                      <span className="text-sm md:px-5 w-[80%] overflow-hidden whitespace-nowrap text-ellipsis text-center">
                        {key2 ? g.away : g.home}
                      </span>
                    </div>
                  ))}
                  <div className="order-2 relative min-h-[40px] justify-between flex items-center z-10 flex-1">
                    {[0, 1].map((key2) => (
                      <span
                        key={key2}
                        className={`text-2xl opacity-75 px-2 ${
                          key2 && "order-3"
                        }`}
                      >
                        0
                      </span>
                    ))}
                    <span className="order-2 flex-1 fx flex-col text-sm text-c2">
                      <span className="text-green-600 text-sm px-2 mb-1 rounded-r-xl bg-green-700/10">
                        Live
                      </span>
                      <span className="text-center">{g.starts}</span>
                    </span>
                  </div>
                  <span className="absolute top-3 text-sm w-[55%] text-center opacity-50 overflow-hidden whitespace-nowrap text-ellipsis z-10">
                    {g.league_name}
                  </span>
                  <Image
                    className="absolute opacity-20"
                    src={"vs.svg"}
                    width={70}
                    height={50}
                    priority
                    alt=""
                  ></Image>
                </div>
                <div className="w-4/5 gap-2 flex h-10 mt-6">
                  {[0, 1, 2].map((key) => (
                    <SkeletonLoad className="h-full flex-1" key={key} />
                  ))}
                </div>
                {/* <Odds slider game={g} className={"w-4/5 mt-6"} /> */}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-52 gap-2 fx rounded-2xl relative bg-c4 inset-0 z-20 fx flex-col mb-1 pb-2">
            <BsSlashCircle className="text-3xl" />
            There are no games currently available
            <button className="text-c2" onClick={() => getGames(sportId)}>
              refresh
            </button>
          </div>
        )}
      </Retry>
      {games === null ? (
        <ul className="px-3 mb-4 mt-1 whitespace-nowrap overflow-x-scroll no-bars overflow-y-hidden flex gap-2">
          {Array(4)
            .fill("")
            .map((i, key) => {
              return (
                <li
                  key={key}
                  className="px-3 fade w-24 py-1 bg-c4 rounded-b-2xl rounded-t-md"
                ></li>
              );
            })}
        </ul>
      ) : (
        <ul className="px-3 mb-4 mt-1 whitespace-nowrap overflow-x-scroll no-bars overflow-y-hidden flex gap-2 w-full">
          {sports.map((item, key) => {
            return (
              <li
                key={key}
                onClick={() => changeSport(item.id)}
                className="px-3 active:scale-90 duration-200 fx items-center gap-1 py-1.5 bg-c4 rounded-b-2xl rounded-t-md"
              >
                {sportId === item.id ? (
                  <>
                    {item.icon} {item.item}
                  </>
                ) : (
                  <>{item.icon}</>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default Slider;
