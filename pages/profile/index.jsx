import { Naira } from "@/components/layout/Nav";
import { alertService, promptService, userService } from "@/services";
import { motion } from "framer-motion";
import React, { useContext, useState } from "react";
import { useTheme } from "next-themes";
import {
  BiCheck,
  BiCog,
  BiDownArrow,
  BiDownArrowAlt,
  BiDownArrowCircle,
  BiLeftArrowAlt,
  BiMoneyWithdraw,
  BiMoon,
  BiPowerOff,
  BiSun,
  BiTransferAlt,
  BiUserCircle,
} from "react-icons/bi";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import Link from "next/link";
import { Context } from "@/components/layout";
import { useRouter } from "next/navigation";

const Theme = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => (theme === "dark" ? setTheme("light") : setTheme("dark"))}
      className="h-full w-full py-4 px-4 bg-c4 flex dark:items-end items-start"
    >
      <motion.span
        layout
        className={`w-24 bg-black text-c2 rounded-xl h-16 fx `}
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

const PaymentPin = () => {
  return (
    <span className="flex flex-col justify-between items-end py-3 px-3">
      <span className="w-full opacity-60">Payment pin</span>
      <span className="overflow-hidden shadow-lg shadow-black/20 h-8 bg-c2/5 rounded-lg">
        <span className="text-c2 translate-y-1 flex gap-1 text-5xl px-2">
          ****
        </span>
      </span>
    </span>
  );
};

const DefStake = () => {
  return (
    <span className="bg-c4 py-4 px-4 flex flex-col justify-between items-end">
      <span className="w-full opacity-60">Default Stake</span>
      <input
        type="number"
        className="border-4 focus:border-c2/100 w-2/3 border-c2/50 px-1 text-center rounded-lg py-1"
      />
    </span>
  );
};

const LogOut = () => {
  const { push } = useRouter();
  const { setUser } = useContext(Context);

  const logOut = async () => {
    const data = await userService.signout();
    if (data) {
      alertService.success(data.message);
      setUser(undefined);
      push("/");
      promptService.clear();
    }
  };

  return (
    <button
      onClick={() =>
        promptService.prompt(
          "Are you sure you want to Logout?",
          ["Yes", "No"],
          logOut
        )
      }
      className="bg-red-950/70 text-red-500 justify-between items-center flex flex-col w-full h-full py-3 px-3"
    >
      <span className="opacity-60">log out</span>
      <BiPowerOff className="text-4xl mb-3" />
    </button>
  );
};

function Index() {
  const { user, setUser } = useContext(Context);
  const [isVisible, setIsVisible] = useState(true);

  const getUser = async () => {
    const data = await userService.getUser();
    setCurrentUser(data.user.balance);
  };

  // useEffect(() => {
  //   currentUser === null && getUser();
  // }, [currentUser]);

  let settings = [
    { className: "col-span-2 row-span-4", jsx: <Theme /> },
    {
      className: "col-span-5 row-span-2 ",
      jsx: <PaymentPin />,
    },
    {
      className: "col-span-3 row-span-2",
      jsx: (
        <Link
          href={"/profile/transactions"}
          className="py-3 flex flex-col px-3 "
        >
          <BiTransferAlt className="mb-1 text-c2" />
          <span>
            Transaction <br /> History
          </span>
        </Link>
      ),
    },
    {
      className: "col-span-2 row-span-3",
      jsx: <LogOut />,
    },
    {
      className: "col-span-4 col-start-2 row-span-2",
      jsx: <DefStake />,
    },
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
      <div className="bg-c4 h-48 pt-7 flex items-start flex-col">
        {user ? (
          <>
            <span className="fx fixed top-0 z-20 bg-[#000000] px-5 py-2 shadow-lg shadow-black/50 text-white/75 rounded-b-xl rounded-tr-xl">
              <BiUserCircle className="mr-1 text-lg text-c2" />
              {user.email}
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
                  <Naira /> {user.balance.toFixed(2)}
                </>
              ) : (
                "****"
              )}
            </div>
            <div className="flex gap-3 w-full px-16 pb-0">
              {["Deposit", "Withdraw"].map((item, key) => (
                <Link
                  key={key}
                  className={`flex-1 text-center rounded-t-xl py-2 ${
                    !key
                      ? "from-c1/75 to-c2/75 bg-gradient-to-br"
                      : "bg-white/5"
                  } `}
                  href={`/profile/${item.toLowerCase()}`}
                >
                  {item}
                </Link>
              ))}
            </div>
          </>
        ) : (
          <span className="w-full text-center">No network connection</span>
        )}
      </div>
      <motion.ul
        variants={pVariants}
        initial="init"
        animate="show"
        className="grid mt-7 h-[22rem] w-full px-5 grid-rows-6 grid-cols-7 gap-4 "
      >
        {settings.map((li, key) => (
          <motion.li
            key={key}
            variants={cVariants}
            whileTap={{ scale: 0.85 }}
            className={`flex ${
              key ? "bg-c4" : "bg-red-600/10 text-red-700"
            } h-full-c w-full-c overflow-hidden rounded-xl ${
              key > 2 && "opacity-30"
            } ${li.className}`}
            style={{ opacity: key > 2 ? 1 : 0.2 }}
          >
            {li.jsx}
          </motion.li>
        ))}
      </motion.ul>
    </>
  );
}

export const PayTemplate = ({ v, children }) => (
  <div className="min-h-screen">
    <Link
      href={"/profile"}
      className="flex gap-3 text-lg bg-c4 items-center py-4"
    >
      <BiLeftArrowAlt className="text-c2 border-c1 ml-6 border-2 rounded-full" />
      {v}
    </Link>
    {children}
  </div>
);

export default Index;
