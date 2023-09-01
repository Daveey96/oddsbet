import { motion } from "framer-motion";
import React, { useContext, useMemo } from "react";
import { findTotalOdds } from ".";
import { Context } from "../layout";

export default function Button({ toggle, setToggle }) {
  const { betList, setBetList } = useContext(Context);
  const totalOdds = useMemo(() => findTotalOdds(betList), [betList]);

  return (
    <>
      {[0, 1].map((key) => {
        let pick = key ? betList.length > 0 : betList.length === 0;
        return (
          !pick &&
          !toggle && (
            <motion.button
              key={key}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              onClick={(e) => {
                e.stopPropagation();
                setToggle(true);
              }}
              whileTap={{ scale: 1.1 }}
              style={{ x: "-50%", left: "50%" }}
              className={`absolute fx rounded-xl z-20 ${
                key
                  ? "h-[6px] w-12 bottom-[106%]"
                  : "bottom-[110%] py-2 dark:bg-black bg-c4 px-4 shadow shadow-black"
              }`}
            >
              {key ? (
                <span className="w-full from-c1 to-c2 bg-gradient-to-r rounded-t-xl rounded-b-sm h-full"></span>
              ) : (
                <>
                  <span className="flex border-r-2 border-c2 pr-3 mr-3">
                    {betList.length}
                  </span>
                  <span className="text-c2">{totalOdds}</span>
                </>
              )}
            </motion.button>
          )
        );
      })}
    </>
  );
}
