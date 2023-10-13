import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { sports } from "../games";
import Svg from "../global/Svg";
import { useKeenSlider } from "keen-slider/react";
import { condition } from "@/helpers";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import Animated from "../global/Animated";
import { Context } from "../layout";

function Preferences() {
  const { favSport, setFavSport, hint, setHint } = useContext(Context);
  const { theme, setTheme } = useTheme();
  const [state, setState] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: false,
    drag: false,
  });

  const [activeSlide, setActiveSlide] = useState(0);

  let text = [
    "Choose your preferred sport",
    "Choose your preferred theme",
    "Hints",
  ];

  useEffect(() => {
    !localStorage.getItem("preferences") && setState(true);
  }, []);

  const change = (key) => {
    const { next, prev, track } = instanceRef.current;

    if (activeSlide === 2 && key) {
      localStorage.setItem("preferences", "true");
      localStorage.setItem("favSport", `${favSport}`);
      localStorage.setItem("showHints", `${hint}`);
      setState(false);
    } else {
      key ? next() : prev();
      setActiveSlide(key ? track.details.abs + 1 : track.details.abs - 1);
    }
  };

  return (
    <Animated
      state={state}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed bg-black/70 fx inset-0 z-[70]"
    >
      <motion.div
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        exit={{ y: 40 }}
        transition={{ ease: "easeInOut" }}
        className="dark:bg-c4 duration-150 bg-white shadow-xl shadow-c4/25 h-[70vh] flex items-center flex-col fixed inset-x-1 overflow-hidden rounded-3xl"
      >
        <header className="flex shadow-lg dark:border-b-2 dark:border-black/20 items-center pl-5 text-lg gap-2 pt-4 pb-3 w-full">
          Welcome to
          <Image
            width={75}
            height={10}
            priority
            className="scale-[0.85] -translate-x-2"
            src={"/logo.svg"}
            alt="Oddsbet logo"
          />
        </header>
        <div className="flex-1 w-full overflow-y-scroll">
          <div ref={sliderRef} className="keen-slider w-full">
            {text.map((txt, key) => (
              <div
                key={key}
                className="w-full keen-slider__slide flex flex-col gap-9 px-4"
              >
                <header className="flex opacity-50 items-center pt-4 w-full text-base gap-3">
                  {txt}
                </header>
                {condition(
                  key,
                  [0, 1, 2],
                  [
                    sports.map((v, key) => (
                      <div
                        key={key}
                        className="w-full flex text-base justify-between items-center"
                      >
                        <span className="capitalize fx gap-1">
                          <Svg id={key + 1} className={"text-c2"} />
                          {v.item}
                        </span>
                        <input
                          type="checkbox"
                          checked={favSport === key ? true : false}
                          onChange={() => setFavSport(key)}
                          className="rounded-full w-4 h-4 accent-c2"
                        />
                      </div>
                    )),
                    ["system", "light", "dark"].map((v, key) => (
                      <div
                        key={key}
                        className="w-full flex text-base justify-between items-center"
                      >
                        <span className="capitalize fx gap-1">{v}</span>
                        <input
                          type="checkbox"
                          checked={theme === v ? true : false}
                          onChange={() => v !== theme && setTheme(v)}
                          className="rounded-full w-4 h-4 accent-c2"
                        />
                      </div>
                    )),
                    ["Enable", "Disable"].map((v, key) => (
                      <div
                        key={key}
                        className="w-full flex text-base justify-between items-center"
                      >
                        <span className="capitalize fx gap-1">{v}</span>
                        <input
                          type="checkbox"
                          checked={key ? hint === false : hint === true}
                          onChange={() => setHint(key ? false : true)}
                          className="rounded-full w-4 h-4 accent-c2"
                        />
                      </div>
                    )),
                  ]
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-full">
          {["Back", "Next"].map((v, key) => (
            <button
              key={key}
              disabled={!key && !activeSlide}
              onClick={() => change(key)}
              className="flex-1 duration-200 last-of-type:border-l-2 border-black/10 bg-c3 disabled:opacity-30 py-3.5 dark:bg-black/40"
            >
              {key ? (activeSlide === 2 ? "Finish" : v) : v}
            </button>
          ))}
        </div>
      </motion.div>
    </Animated>
  );
}

export default Preferences;
