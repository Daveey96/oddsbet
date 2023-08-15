import React, { useContext, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Animated from "../Animated";
import { BiArrowToLeft } from "react-icons/bi";
import { Context } from ".";
import Alert from "../services/Alert";
import { SkeletonLoad } from "../services/Loaders";

export const Naira = ({ className }) => (
  <svg
    fill="currentColor"
    width="12px"
    height="12px"
    className={className}
    viewBox="0 0 496.262 496.262"
  >
    <path
      d="M477.832,274.28h-67.743v-65.106h67.743c10.179,0,18.43-8.243,18.43-18.424c0-10.182-8.251-18.43-18.43-18.43h-67.743
		V81.982c0-13.187-2.606-22.866-7.743-28.762c-4.882-5.609-11.301-8.219-20.19-8.219c-8.482,0-14.659,2.592-19.447,8.166
		c-5.077,5.902-7.654,15.599-7.654,28.821v90.343H227.627l-54.181-81.988c-4.637-7.317-8.997-14.171-13.231-20.75
		c-3.812-5.925-7.53-10.749-11.042-14.351c-3.109-3.189-6.652-5.657-10.796-7.554c-3.91-1.785-8.881-2.681-14.762-2.681
		c-7.501,0-14.31,2.055-20.83,6.277c-6.452,4.176-10.912,9.339-13.636,15.785c-2.391,6.126-3.656,15.513-3.656,27.63v77.626h-67.07
		C8.246,172.326,0,180.574,0,190.755c0,10.181,8.246,18.424,18.424,18.424h67.07v65.113h-67.07C8.246,274.292,0,282.538,0,292.722
		C0,302.9,8.246,311.14,18.424,311.14h67.07v103.143c0,12.797,2.689,22.378,8.015,28.466c5.065,5.805,11.487,8.5,20.208,8.5
		c8.414,0,14.786-2.707,20.07-8.523c5.411-5.958,8.148-15.533,8.148-28.442V311.14h115.308l62.399,95.683
		c4.339,6.325,8.819,12.709,13.287,18.969c4.031,5.621,8.429,10.574,13.069,14.711c4.179,3.742,8.659,6.484,13.316,8.157
		c4.794,1.726,10.397,2.601,16.615,2.601c16.875,0,34.158-5.166,34.158-43.479V311.14h67.743c10.179,0,18.43-8.252,18.43-18.43
		C496.262,282.532,488.011,274.28,477.832,274.28z M355.054,209.173v65.106h-60.041l-43.021-65.106H355.054z M141.936,134.364
		l24.76,37.956h-24.76V134.364z M141.936,274.28v-65.106h48.802l42.466,65.106H141.936z M355.054,365.153l-35.683-54.013h35.683
		V365.153z"
    />
  </svg>
);

function Nav() {
  const { user } = useContext(Context);
  const { events, pathname } = useRouter();
  const [visible, setVisible] = useState(null);
  const { backdrop, setBackdrop } = useContext(Context);
  const [alert, setAlert] = useState(false);

  const toggleNav = (url) => {
    url.slice(0, 2) === "/p" ? setVisible(false) : setVisible(true);
  };

  useEffect(() => {
    if (visible === null) toggleNav(pathname);
    events.on("routeChangeStart", toggleNav);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (alert) setTimeout(() => setAlert(false), 3500);
  }, [alert]);

  useEffect(() => {
    if (pathname.slice(0, 2) === "/p" && backdrop) setVisible(true);
    else if (pathname.slice(0, 2) === "/p" && !backdrop) setVisible(false);
  }, [backdrop]);

  return (
    <>
      <Animated
        tag="nav"
        className={`flex text-sm z-50 md:h-12 justify-between fixed duration-300 inset-x-0 top-0 px-4 ${
          alert ? "opacity-10" : "opacity-100"
        }`}
        variants={{
          init: { y: "-100%" },
          show: { y: "0%" },
          exit: { y: "-100%" },
        }}
        state={visible}
        transition={{ duration: 0.1 }}
      >
        <Link
          href={"/"}
          className="justify-center -mt-1 px-2 h-9 md:px-0 flex md:ml-10 relative z-10 rounded-b-2xl "
        >
          <Image
            width={75}
            height={10}
            priority
            className="scale-75 md:scale-110"
            src={"/logo.svg"}
            alt="Oddsbet logo"
          />
        </Link>
        {user?.id ? (
          <span
            className={`fx gap-1 relative text-base pl-5 pr-4 rounded-b-2xl z-30 bg-black h-full" ${
              user.balance < 100 ? "text-red-600" : "text-green-600"
            }`}
          >
            <Naira className="mb-1" />
            <span className="mb-[5px]">{user.balance.toFixed(2)}</span>
            {/* {user.balance < 100 && (
              <Link
                href={"/profile/deposit"}
                className="active:opacity-20 bg-c1 rounded-r-full rounded-l-[6000px] px-5 text-sm text-white absolute right-[95%] py-0.5"
              >
                deposit
              </Link>
            )} */}
          </span>
        ) : (
          <SkeletonLoad
            state={user !== null}
            tag="button"
            className={
              "fx text-white rounded-t-none gap-1 pb-1 px-6 rounded-b-2xl z-30 bg-black h-8"
            }
            onClick={() => setBackdrop(!backdrop)}
          >
            {backdrop ? (
              <>
                <BiArrowToLeft className="mt-0.5" /> back
              </>
            ) : (
              <>
                join <span className="opacity-10 mx-1.5">|</span>
                <span className="text-c2">login</span>
              </>
            )}
          </SkeletonLoad>
        )}
      </Animated>
      <AnimatePresence>
        <Alert onAlert={() => setAlert(true)} />
      </AnimatePresence>
    </>
  );
}

export default Nav;
