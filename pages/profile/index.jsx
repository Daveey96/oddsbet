import { Naira } from "@/components/layout/Nav";
import { alertService, promptService } from "@/services";
import { motion } from "framer-motion";
import React, { useContext, useState } from "react";
import { useTheme } from "next-themes";
import {
  BiClipboard,
  BiCog,
  BiLeftArrowAlt,
  BiMoon,
  BiSun,
  BiTransferAlt,
  BiUserCircle,
} from "react-icons/bi";
import {
  BsArrowRightShort,
  BsBookmarkFill,
  BsEyeFill,
  BsEyeSlashFill,
  BsFillQuestionDiamondFill,
  BsInfoCircleFill,
} from "react-icons/bs";
import Link from "next/link";
import { Context } from "@/components/layout";
import { useRouter } from "next/navigation";
import { SkeletonLoad } from "@/components/services/Loaders";
import { userController } from "@/controllers";

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

// const Demo = () => {
//   // const { theme, setTheme } = useTheme();

//   return (
//     <button
//       // onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//       className={`dark:bg-black flex justify-start relative w-14 px-1.5 items-center py-1.5 rounded-xl `}
//     >
//       <span className="absolute tex left-2 text-black">off</span>
//       <span className="absolute right-2 text-white/20">off</span>
//       <motion.span
//         layout
//         className={`w-4 h-4 z-10 rounded-full bg-c2 flex `}
//       ></motion.span>
//     </button>
//   );
// };

const PaymentPin = () => {
  return (
    <Link
      href={"/profile/pin"}
      className="bg-black/40 flex gap-1 items-center text-c2 relative pl-4 pr-3 py-1.5 rounded-xl"
    >
      setup <BsArrowRightShort />
    </Link>
  );
};

function Index() {
  const { user, setUser, setBackdrop } = useContext(Context);
  const [isVisible, setIsVisible] = useState(true);
  const { push } = useRouter();

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
    <>
      <SkeletonLoad
        state={user !== null}
        className="bg-c4 flex flex-col min-h-[100px]"
      >
        {user?.email ? (
          <>
            <Link
              href="#"
              className="fx fixed top-0 z-20 bg-[#000000] px-5 py-2 shadow-lg shadow-black/50 text-white/75 rounded-b-xl rounded-tr-xl"
            >
              <BiUserCircle className="mr-1 text-lg text-c2" />
              {user?.email}
            </Link>
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
                    !key ? "from-c1/75 to-c2/75 bg-gradient-to-r" : "bg-white/5"
                  } `}
                  href={`/profile/${item.toLowerCase()}`}
                >
                  {item}
                </Link>
              ))}
            </div>
          </>
        ) : (
          <span className="w-full mb-4 mt-8 fx gap-4">
            <span className="text-sm">
              Oops.. <br /> You&apos;re not signed in
            </span>
            <button
              className="fx h-11 rounded-xl from-c2/70 px-8 to-c1/60 bg-gradient-to-r"
              onClick={() => setBackdrop(true)}
            >
              sign in
            </button>
          </span>
        )}
      </SkeletonLoad>
      <div className="flex flex-col items-center mt-4">
        <ul className="flex w-[94%] flex-col relative gap-0.5 rounded-3xl overflow-hidden">
          {["Appearance", "Transaction history", "Payment pin"].map(
            (item, key) => (
              <li
                key={key}
                className={`first:rounded-t-3xl flex justify-between items-center w-full first:pt-14 last-of-type:rounded-b-3xl pb-4 pt-6 px-5 relative bg-c4/40 mx-auto ${
                  key === 1 && "active:scale-95 duration-150"
                } `}
                onClick={() => key === 1 && push("/profile/transactions")}
              >
                <span className={"opacity-100"}>{item}</span>
                {key === 0 && <Theme />}
                {/* {key === 1 && <Demo />} */}
                {key === 1 && (
                  <BiTransferAlt className="text-c2 mr-2 scale-125 text-xl" />
                )}
                {key === 2 && <PaymentPin />}
              </li>
            )
          )}
          <span className="flex top-0 -left-3 bg-black pt-2 pb-3 pl-4 pr-6 rounded-br-3xl ml-3 absolute text-base items-center text-c2 gap-1">
            <BiCog className="text-c1 text-base " /> Settings
          </span>
        </ul>
        <ul className="flex overflow-hidden bg-c4/40 mt-4 w-[94%] relative pt-14 gap-2.5 pb-3 rounded-3xl px-3">
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
              className="rounded-2xl flex-1 active:scale-90 duration-150 text-xs px-5 py-4 fx bg-slate-500/5 flex flex-col"
            >
              {item}
            </Link>
          ))}
          <span className="flex top-0 -left-3 bg-black pt-2 pb-3 pl-4 pr-6 rounded-br-3xl ml-3 absolute text-base items-center text-c2 gap-1">
            <BiClipboard className="text-c1 text-base " /> About
          </span>
        </ul>
        {user?.email && (
          <button
            className="text-red-700 font-bold mb-10 px-4 rounded-2xl py-3 mt-4"
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

export const PayTemplate = ({ v, children }) => {
  const { back } = useRouter();
  return (
    <div className="h-screen flex flex-col z-50 fixed bg-black inset-0">
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
