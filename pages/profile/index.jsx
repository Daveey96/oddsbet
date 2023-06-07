import { Naira } from "@/components/Auth";
import { userService } from "@/services";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  BiCog,
  BiMoon,
  BiPowerOff,
  BiSun,
  BiTransferAlt,
  BiUserCircle,
} from "react-icons/bi";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

const Theme = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => (theme === "dark" ? setTheme("light") : setTheme("dark"))}
      className="h-full w-full flex dark:items-end items-start"
    >
      <motion.span
        layout
        className={`w-24 bg-blue-500 text-black dark:invert rounded-xl h-16 fx `}
      >
        {theme === "dark" ? (
          <BiMoon className="text-2xl" />
        ) : (
          <BiSun className=" text-3xl" />
        )}
      </motion.span>
    </button>
  );
};

function Index() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  const getUser = async () => {
    const data = await userService.getUser();
    setCurrentUser(data.user);
  };

  useEffect(() => {
    currentUser === null && getUser();
  }, [currentUser]);

  let settings = [
    {
      className: "col-span-2 row-span-4",
      jsx: <Theme />,
    },
    { className: "col-span-5 row-span-2", jsx: <>Payment Pin</> },
    { className: "col-span-3 row-span-2", jsx: <BiTransferAlt /> },
    { className: "col-span-2 row-span-3", jsx: <BiPowerOff /> },
    { className: "col-span-4 col-start-2 row-span-2", jsx: <>Default Stake</> },
  ];

  let pVariants = {
    init: {},
    show: { transition: { staggerChildren: 0.05 } },
  };

  let cVariants = {
    init: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <>
      {currentUser && (
        <div className="min-h-[82vh]">
          <div className="bg-gray-700/10 flex-1 flex flex-col items-start rounded-b-[50px]">
            <span className="fx sticky top-0 z-20 bg-[#000000] px-5 py-2 shadow-lg shadow-black/50 text-white/75 rounded-b-xl rounded-tr-xl content-start">
              <BiUserCircle className="mr-1 text-lg text-c2" />{" "}
              {currentUser.email}
            </span>
            <div className="flex opacity-75 items-center mt-5  w-full flex-1 justify-around">
              <span>Total Balance:</span>
              <motion.button
                whileTap={{ scale: 1.2 }}
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? <BsEyeFill /> : <BsEyeSlashFill />}
              </motion.button>
            </div>
            <div className="pb-6 fx pt-4 w-full text-center text-green-500 text-3xl ">
              {isVisible ? (
                <>
                  <Naira /> {currentUser.balance.toFixed(2)}
                </>
              ) : (
                "******"
              )}
            </div>
            <div className="flex gap-3 w-full px-16 pb-0">
              {["Deposit", "Withdraw"].map((item, key) => (
                <button
                  key={key}
                  className={`flex-1 rounded-t-xl py-2 ${
                    !key
                      ? "from-c1/75 to-c2/75 bg-gradient-to-br"
                      : "bg-white/5"
                  } `}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <span className="flex mt-6 mb-3 px-3 items-center gap-2 ml-4">
            <BiCog /> Settings
          </span>
          <motion.ul
            variants={pVariants}
            initial="init"
            animate="show"
            className="grid h-80 w-full px-7 grid-rows-6 grid-cols-7 gap-4 "
          >
            {settings.map((li, key) => (
              <motion.li
                key={key}
                variants={cVariants}
                whileTap={{ scale: 0.8 }}
                className={
                  "bg-slate-700/10 py-4 px-4 rounded-xl " + li.className
                }
              >
                {li.jsx}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      )}
    </>
  );
}

export default Index;
