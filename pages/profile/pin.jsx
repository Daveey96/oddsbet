import React, { useEffect, useState } from "react";
import { PayTemplate } from ".";
import { overlayService } from "@/services";
import { BiX } from "react-icons/bi";
import { CircularLoader } from "@/components/services/Loaders";
import Animated from "@/components/Animated";

function Pin() {
  const [value, setValue] = useState("");
  const [load, setLoad] = useState(true);
  const [page, setPage] = useState(null);

  const addNum = ({ target }) => {
    setValue(value + target.textContent);
  };

  useEffect(() => {
    if (value !== null && value.length === 4) {
      overlayService.lay();
      setTimeout(() => {
        overlayService.clear();
      }, 4000);
    }
  }, [value]);

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 4000);
  }, []);

  return (
    <PayTemplate v={"Payment pin"}>
      <div className="flex flex-1 relative flex-col ">
        <span className="pb-6 flex-1 mt-6 gap-6 fx flex-col text-lg">
          Setup Pin
          <span className="w-full flex gap-5 justify-center">
            {Array(4)
              .fill("")
              .map((i, key) => (
                <span
                  className={`w-5 h-5 rounded-full ${
                    isNaN(parseInt(value.split("")[key]))
                      ? "border-4 dark:border-c4 border-c5"
                      : "bg-c2"
                  }`}
                  key={key}
                ></span>
              ))}
          </span>
        </span>
        <div className="flex flex-wrap justify-center">
          {[9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((key) => (
            <span key={key} className="basis-1/3 fx font-mono text-3xl">
              <button
                onClick={addNum}
                className="w-[4.5rem] h-[4.5rem] fx mb-5 active:scale-110 dark:active:bg-white/5 active:bg-black/10 dark:bg-white/0 bg-c3/25 duration-150 rounded-full"
              >
                {key}
              </button>
            </span>
          ))}
        </div>
        <Animated
          state={load}
          variantType={"opacity"}
          className="absolute fx inset-0 bg-white/70"
        >
          <CircularLoader size={40} className={"mb-20"} color />
        </Animated>
      </div>
    </PayTemplate>
  );
}

export default Pin;
