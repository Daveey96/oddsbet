import React, { useState, useEffect } from "react";
import { CircularLoader } from "../services/Loaders";
import { betController } from "@/controllers";
import Animated from "../global/Animated";
import { motion } from "framer-motion";
import Retry from "../services/Retry";
import Error from "../services/Error";

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

export const ShareCode = ({ state, close, variants, getTicket }) => {
  const [bookingCode, setBookingCode] = useState(null);

  const getCode = async () => {
    setBookingCode("loading");

    const { tid, slip } = getTicket();

    const data = await betController.getCode({ tid, slip });
    data ? setBookingCode(data) : setBookingCode("error");
  };

  return (
    <Animated
      onClick={close}
      variants={variants}
      state={state}
      variantKey="2"
      className="inset-0 absolute bg-black/80 z-[47] fx"
    >
      <motion.div
        variants={{
          init2: { y: 30 },
          show2: { y: 0 },
          exit2: { y: 30 },
        }}
        onClick={(e) => e.stopPropagation()}
        className="fx overflow-hidden mt-4 flex-col min-h-[25vh] w-[94%] relative rounded-[30px] bg-c4"
      >
        <Retry
          state={bookingCode}
          loading={<CircularLoader size={40} depth={3} color />}
          error={<Error type />}
          getState={getCode}
        >
          hhdjhdj
        </Retry>
      </motion.div>
    </Animated>
  );
};
