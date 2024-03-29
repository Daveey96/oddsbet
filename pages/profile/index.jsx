import { Naira } from "@/components/layout/Nav";
import { alertService, promptService } from "@/services";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
  BiLeftArrowAlt,
  BiMoon,
  BiSun,
  BiTransferAlt,
  BiUserCircle,
} from "react-icons/bi";
import {
  BsBookmarkFill,
  BsEyeFill,
  BsEyeSlashFill,
  BsFillQuestionDiamondFill,
  BsInfoCircleFill,
  BsTicketDetailedFill,
} from "react-icons/bs";
import Link from "next/link";
import { Context } from "@/components/layout";
import { useRouter } from "next/navigation";
import { CircularLoader, Skeleton } from "@/components/services/Loaders";
import { appController, userController } from "@/controllers";
import { format } from "@/helpers";
import { FaBars, FaUserFriends } from "react-icons/fa";
import Retry from "@/components/services/Retry";

const Theme = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`bg-white dark:bg-black flex dark:justify-start justify-end relative w-14 px-1.5 py-1.5 rounded-xl `}
    >
      <BiSun className="absolute tex left-2 text-black" />
      <BiMoon className="absolute right-2 text-white/20" />
      <motion.span
        layout
        className={`w-4 h-4 z-10 rounded-full bg-c2 flex `}
      ></motion.span>
    </button>
  );
};

const Vouchers = () => {
  const [num, setNum] = useState(null);

  const getVouchers = async () => {
    const data = await appController.getVouchers();
    data ? setNum(data.length) : setNum("error");
  };

  useEffect(() => {
    num === null && getVouchers();
  }, []);

  return (
    <Retry
      state={num}
      error={<></>}
      loading={
        <CircularLoader
          className={"border-white dark:border-c2 mr-1"}
          size={14}
          depth={2}
        />
      }
    >
      <span className="duration-200 flex gap-1 items-center dark:text-c2 text-white">
        <BsTicketDetailedFill /> {!num ? "None" : num} available
      </span>
    </Retry>
  );
};

export default function Index() {
  const { user, setUser, setBackdrop } = useContext(Context);
  const [isVisible, setIsVisible] = useState(true);
  const { replace, push } = useRouter();

  let arr = useMemo(
    () =>
      user ? ["Appearance", "Transaction history", "Vouchers"] : ["Appearance"],
    [user]
  );

  const logOut = async () => {
    const data = await userController.signout();
    if (data) {
      alertService.success(data.message);
      setUser(undefined);
      replace("/");
      promptService.clear();
    }
  };

  const clicked = (key) => {
    key === 1 && push("/profile/transactions");
    key === 2 && push("/profile/vouchers");
  };

  return (
    <>
      <Skeleton
        state={user !== null}
        className="dark:bg-c4 bg-white flex flex-col min-h-[100px]"
      >
        {user?.email ? (
          <>
            <Link
              href="/profile"
              className="fx fixed text-white top-0 z-20 dark:bg-black bg-c4 px-5 py-2 shadow-lg shadow-black/50 rounded-b-xl rounded-tr-xl"
            >
              <BiUserCircle className="mr-1 text-lg text-c2" />
              {user?.email}
            </Link>
            <div className="flex duration-200 dark:opacity-75 items-center mt-12 w-full flex-1 justify-around">
              <span>Total Balance:</span>
              <button
                className="active:scale-75 scale-125 duration-200"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? <BsEyeFill /> : <BsEyeSlashFill />}
              </button>
            </div>
            <div className="pb-7 fx pt-8 w-full text-center text-green-600 dark:text-green-500 text-3xl ">
              {isVisible ? (
                <>
                  <Naira /> {format(user.balance.toString())}
                </>
              ) : (
                "****"
              )}
            </div>
            <div className="flex gap-3 w-full px-16">
              {["Deposit", "Withdraw"].map((item, key) => (
                <Link
                  key={key}
                  className={`flex-1 active:scale-75 duration-150 text-center rounded-t-2xl shadow-lg shadow-black/40 dark:rounded-b-none rounded-b-2xl py-2.5 ${
                    !key
                      ? "dark:from-c1/75 from-c1 to-c2 dark:to-c2/75 text-white bg-gradient-to-r"
                      : "dark:bg-white/5 bg-c4/40 text-white"
                  } `}
                  href={key === 1 ? `/profile/withdraw` : "/profile/deposit"}
                >
                  {item}
                </Link>
              ))}
            </div>
          </>
        ) : (
          <span className="w-full dark:bg-transparent pb-4 h-full flex items-end justify-center gap-4">
            <span className="text-sm">
              Oops.. <br /> You&apos;re not signed in
            </span>
            <button
              className="fx h-11 text-white rounded-xl dark:from-c2/70 px-8 from-c2 to-c1 dark:to-c1/60 bg-gradient-to-r"
              onClick={() => setBackdrop(true)}
            >
              sign in
            </button>
          </span>
        )}
      </Skeleton>
      <div className="flex flex-col items-center mt-4 rounded-t-2xl">
        <ul className="flex w-[94%] text-white flex-col relative gap-0.5 rounded-3xl overflow-hidden">
          {arr.map((item, key) => (
            <li
              key={key}
              className={`first:rounded-t-3xl flex justify-between items-center w-full first:pt-14 last-of-type:rounded-b-3xl pb-4 pt-6 px-5 relative from-c1 to-c2 bg-gradient-to-r dark:from-transparent dark:to-transparent dark:bg-c4/40 mx-auto ${
                key > 0 && "active:scale-95 duration-150"
              } `}
              onClick={() => clicked(key)}
            >
              <span>{item}</span>
              {key === 0 && <Theme />}
              {/* {key === 1 && <Demo />} */}
              {key === 1 && (
                <BiTransferAlt className="dark:text-c2 text-white mr-2 scale-125 text-xl" />
              )}
              {key === 2 && <Vouchers />}
            </li>
          ))}
          <span className="flex -top-0 -left-3 bg-c1 dark:bg-black pt-2 pb-3 pl-4 text-sm pr-6 rounded-br-3xl ml-3 absolute items-center dark:text-c2 text-white gap-1">
            <FaBars className="dark:text-c1 text-c2 text-xs mb-px " /> Menu
          </span>
        </ul>
        <ul className="flex mb-6 overflow-hidden bg-c3 dark:bg-c4/40 mt-4 w-[94%] relative pt-14 gap-2.5 pb-3 rounded-3xl px-3">
          {[
            <>
              <BsBookmarkFill className="text-lg mb-3 text-c2" />
              <span>terms and</span>
              <span>conditions</span>
            </>,
            <>
              <BsInfoCircleFill className="text-lg text-c2 mb-4" /> Help
            </>,
            <>
              <BsFillQuestionDiamondFill className="text-lg text-c2 mb-4" /> FAQ
            </>,
          ].map((item, key) => (
            <Link
              key={key}
              href={`/profile/about`}
              className="rounded-2xl flex-1 active:scale-90 duration-150 text-xs px-5 py-4 fx bg-black/5 dark:bg-slate-500/5 flex flex-col"
            >
              {item}
            </Link>
          ))}
          <span className="flex top-0 -left-3 bg-black/5 dark:bg-black pt-2 pb-3 pl-4 pr-6 rounded-br-3xl ml-3 absolute text-sm items-center dark:text-c2 gap-1">
            <FaUserFriends className="dark:text-c1 text-black text-sm " /> About
          </span>
        </ul>
        {user?.email && (
          <button
            className="dark:text-red-700 text-red-500 font-bold mb-10 px-4 rounded-2xl py-3 mt-4"
            onClick={() =>
              promptService.prompt(
                <>Are you sure you want to logout</>,
                ["Yes", "No"],
                logOut
              )
            }
          >
            Sign out
          </button>
        )}
      </div>
    </>
  );
}

export const PayTemplate = ({ v, children, route }) => {
  const { back, push } = useRouter();
  const { user } = useContext(Context);

  useEffect(() => {
    if (route && !user) push("/profile");
  }, []);

  return (
    <div className="h-screen flex flex-col z-50 fixed dark:bg-black bg-white inset-0">
      <header
        onClick={back}
        className="flex gap-3 text-lg dark:bg-c4 bg-c3 items-center py-4"
      >
        <BiLeftArrowAlt className="text-c2 border-c1 ml-6 border-2 rounded-full" />
        {v}
      </header>
      {children}
    </div>
  );
};
