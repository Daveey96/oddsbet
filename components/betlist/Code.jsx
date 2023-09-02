import React, { useState, useEffect } from "react";
import { CircularLoader } from "../services/Loaders";
import { betController } from "@/controllers";

export default function Code({ setBetList, len }) {
  const [value, setValue] = useState("");
  const [load, setLoad] = useState(false);

  const loadBet = async () => {
    setLoad(true);

    const data = await betController.loadBet({ code: value });

    if (data) setBetList(data.games);
    else {
      setValue("");
      setLoad(false);
    }
  };

  useEffect(() => {
    if (value.length === 5) loadBet();
  }, [value]);

  return (
    <>
      <div className={`w-40 mb-2 fx relative ${!len && "mt-2"}`}>
        <input
          type="text"
          placeholder="Enter Booking code"
          className="py-3 dark:bg-black bg-c4 disabled:opacity-50 duration-150 text-center text-sm dark:border-gray-800 border-slate-500 px-3 focus:border-c2 border-2 rounded-xl h-full w-full"
          maxLength={5}
          value={value}
          disabled={load}
          onChange={({ target }) => setValue(target.value)}
        />
        {load && (
          <CircularLoader
            className={"absolute border-c2"}
            depth={2}
            size={18}
          />
        )}
      </div>
    </>
  );
}
