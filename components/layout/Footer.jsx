import React from "react";
import { motion } from "framer-motion";

function Footer() {
  return (
    <>
      <hr className="mt-5 mb-7 border-2 border-gray-700 w-[80%] mx-auto opacity-10" />
      <footer className="w-full mb-20 relative pt-6 rounded-3xl">
        <span className="text-xs absolute opacity-30 top-0 left-8">
          oddsbet2023. All rights reserved
        </span>
        <span className="flex w-full  pb-2 px-4 items-center">
          <span className="rounded-xl bg-red-600/10 text-red-600 py-2.5 px-3 font-mono ml-3 mr-6 text-xl">
            18+
          </span>
          <span className="opacity-50">|</span>
          <span className="flex flex-1 flex-col items-center text-xs">
            <span className="text-red-600">Warning!!</span>
            <span>Sport betting is addictive and can be harmful</span>
            <span className="text-blue-700">#betresponsibly</span>
          </span>
        </span>
        <span className="w-full gap-3 flex justify-center mt-1 text-sm opacity-50">
          {["About", "Terms & condition"].map((item, key) => (
            <motion.button
              key={key}
              className="border-x-2 border-t-2 border-white/10 px-4 py-0.5 rounded-lg"
              whileTap={{ scale: 1.1 }}
            >
              {item}
            </motion.button>
          ))}
        </span>
      </footer>
    </>
  );
}

export default Footer;
