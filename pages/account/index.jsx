import { motion } from "framer-motion";
import React, { useState } from "react";
import { BiUserCircle } from "react-icons/bi";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

function Index() {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <div className="flex flex-col">
      <div className="bg-gray-700/20 flex-1 flex flex-col items-start rounded-b-[50px]">
        <span className="fx px-3 py-1 ml-5 mt-3 rounded-xl bg-white/5 content-start">
          <BiUserCircle className="mr-1 text-lg text-c2" />{" "}
          udohdavid2004@gmail.com
        </span>
        <div className="flex opacity-75 items-center mt-4  w-full flex-1 justify-around">
          <span>Total Balance:</span>
          <motion.button
            whileTap={{ scale: 1.2 }}
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? <BsEyeFill /> : <BsEyeSlashFill />}
          </motion.button>
        </div>
        <div className="pb-14 pt-12 w-full text-center text-green-500 text-3xl ">
          {isVisible ? "1,200.45" : "******"}
        </div>
        <div className="flex gap-3 w-full px-12 pb-0">
          {["Deposit", "Withdraw"].map((item, key) => (
            <button
              key={key}
              className={`flex-1 rounded-t-xl py-2 ${
                !key ? "from-c1/75 to-c2/75 bg-gradient-to-br" : "bg-white/5"
              } `}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <ul className="fx flex-col mt-3 gap-4 ">
        {[
          "Appearance",
          "Update Default Stake",
          "Change payment pin",
          "Change password",
          "Transaction History",
        ].map((li, key) => (
          <li key={key} className="bg-slate-700/10 py-4 px-5 w-5/6 rounded-2xl">
            {li}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Index;
