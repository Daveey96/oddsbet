import React, { useEffect, useState } from "react";
import { PayTemplate } from ".";
import { overlayService } from "@/services";

function Pin() {
  const [value, setValue] = useState("");

  const addNum = ({ target }) => {
    setValue(value + target.textContent);
  };

  useEffect(() => {
    if (value.length === 4) {
      overlayService.lay();
      setTimeout(() => {
        overlayService.clear();
      }, 4000);
    }
  }, [value]);

  return (
    <PayTemplate v={"Payment pin"}>
      <span className="h-44 pb-6 gap-6 justify-end flex flex-col items-center text-lg">
        Comfirm Pin
        <span className="w-full flex gap-5 justify-center">
          {Array(4)
            .fill("")
            .map((i, key) => (
              <span
                className={`w-5 h-5 rounded-full ${
                  isNaN(parseInt(value.split("")[key]))
                    ? "border-4 border-c4"
                    : "bg-c2"
                }`}
                key={key}
              ></span>
            ))}
        </span>
      </span>
      <div className=" flex-1 mb-8 flex flex-wrap justify-center">
        {[9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((key) => (
          <span key={key} className="basis-1/3 fx font-mono text-3xl">
            <button
              onClick={addNum}
              className="w-20 h-20 active:scale-110 active:bg-white/5 bg-white/0 duration-150 rounded-full"
            >
              {key}
            </button>
          </span>
        ))}
      </div>
    </PayTemplate>
  );
}

export default Pin;
