import { Naira } from "@/components/layout/Nav";
import { alertService, promptService } from "@/services";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  BiLeftArrowAlt,
  BiMoon,
  BiPowerOff,
  BiSun,
  BiTransferAlt,
  BiUserCircle,
} from "react-icons/bi";
import { BsAsterisk, BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import Link from "next/link";
import { Context } from "@/components/layout";
import { useRouter } from "next/navigation";
import { SkeletonLoad } from "@/components/services/Loaders";
import { userController } from "@/controllers";

const Fix = () => <span className="z-20 absolute inset-0"></span>;

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

const PaymentPin = ({ user }) => {
  return (
    <span
      className={`flex bg-c4 flex-col justify-between items-end ${
        !user && "opacity-40"
      }`}
    >
      <span className="w-full flex items-center justify-between opacity-60 px-4 mt-5">
        <span>Payment pin</span>
        <BsEyeFill />
      </span>
      <span className="py-4 relative px-8 text-c2 flex items-center gap-1 bg-black rounded-tl-3xl">
        {Array(4)
          .fill("")
          .map((i, key) => (
            <BsAsterisk key={key} className="text-xs" />
          ))}
        <span className="right-[110%] bg-c2/5 py-1 px-3 rounded-xl text-sm absolute">
          change
        </span>
      </span>
    </span>
  );
};

const DefStake = () => {
  const [stake, setStake] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("defStake"))
      localStorage.setItem("defStake", "100");

    stake === false && setStake(parseInt(localStorage.getItem("defStake")));
  }, [stake]);

  return (
    <span className="bg-c4 flex relative flex-col justify-end items-end">
      <span className="bg-black absolute left-0 top-0 text-white/50 rounded-br-3xl px-5 py-3">
        Default stake
      </span>
      <input
        type="number"
        value={stake ? stake : ""}
        placeholder="min. 100"
        onChange={({ target }) => setStake(target.value)}
        onBlur={() =>
          stake >= 100
            ? localStorage.setItem("defStake", stake.toString())
            : setStake(parseInt(localStorage.getItem("defStake")))
        }
        className="border-4 focus:border-c2/100 w-32 mr-2 border-c2/50 px-2 text-right rounded-l-3xl rounded-r-lg py-1.5 mb-2"
      />
    </span>
  );
};

const LogOut = () => {
  const { push } = useRouter();
  const { user, setUser } = useContext(Context);

  const logOut = async () => {
    const data = await userController.signout();
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
      className={`bg-red-950/70 text-red-500 justify-between items-center flex flex-col w-full h-full py-4 px-2 ${
        !user && "opacity-40"
      }`}
    >
      <BiPowerOff className="text-4xl mb-3" />
      <span className="opacity-60 text-sm">log out</span>
    </button>
  );
};

function Index() {
  const { user, setBackdrop } = useContext(Context);
  const [isVisible, setIsVisible] = useState(true);

  let settings = [
    { className: "col-span-2 row-span-4", jsx: <Theme /> },
    {
      className: "col-span-5 row-span-2 ",
      jsx: <PaymentPin user={user} />,
    },
    {
      className: "col-span-3 row-span-2",
      jsx: (
        <>
          <Link
            href={"/profile/transactions"}
            disabled
            className={`pt-3 flex bg-c4 flex-col px-3 ${!user && "opacity-40"}`}
          >
            <BiTransferAlt className="mb-1 text-c2 text-xl" />
            <span>
              Transaction <br /> History
            </span>
          </Link>
        </>
      ),
    },
    {
      className: "col-span-2 row-span-2",
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
      <SkeletonLoad
        state={user !== null}
        className="bg-c4 flex flex-col min-h-[100px]"
      >
        {user ? (
          <>
            <span className="fx fixed top-0 z-20 bg-[#000000] px-5 py-2 shadow-lg shadow-black/50 text-white/75 rounded-b-xl rounded-tr-xl">
              <BiUserCircle className="mr-1 text-lg text-c2" />
              {user.email}
            </span>
            <div className="flex opacity-75 items-center mt-12 w-full flex-1 justify-around">
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
            <div className="flex gap-3 w-full px-16">
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
          <span className="w-full mb-4 mt-8 fx gap-3">
            <span className="text-sm">
              Oops.. <br /> You&apos;re not signed in
            </span>
            <button
              className="fx h-12 rounded-xl from-c2/70 px-8 to-c1/60 bg-gradient-to-br"
              onClick={() => setBackdrop(true)}
            >
              sign in
            </button>
          </span>
        )}
      </SkeletonLoad>
      <motion.ul
        variants={pVariants}
        initial="init"
        animate="show"
        className="grid mt-7 h-[23rem] w-full px-5 grid-rows-6 grid-cols-7 gap-4 "
      >
        {settings.map((li, key) => (
          <motion.li
            key={key}
            variants={cVariants}
            whileTap={{ scale: 0.85 }}
            className={`flex relative h-full-c w-full-c overflow-hidden rounded-xl ${li.className}`}
          >
            {li.jsx}
            {!user && key === 1 && <Fix />}
            {!user && key === 2 && <Fix />}
            {!user && key === 3 && <Fix />}
          </motion.li>
        ))}
      </motion.ul>
    </>
  );
}

export const PayTemplate = ({ v, children }) => {
  let { back } = useRouter();
  return (
    <div className="min-h-screen">
      <header
        onClick={back}
        className="flex gap-3 text-lg bg-c4 items-center py-4"
      >
        <BiLeftArrowAlt className="text-c2 border-c1 ml-6 border-2 rounded-full" />
        {v}
      </header>
      {children}
    </div>
  );
};

export default Index;
