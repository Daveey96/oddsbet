import React, { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRouter } from "next/router";
import Auth from "../Auth";
import Image from "next/image";
import Link from "next/link";
import Animated from "../Animated";

function Nav() {
  const { scrollY } = useScroll();
  const { events, pathname } = useRouter();
  const [state, setState] = useState(scrollY > 0 ? 1 : 0);
  const [visible, setVisible] = useState(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    latest > 20 ? !state && setState(1) : state && setState(0);
  });

  const toggleNav = (url) => {
    url === "/profile" || url === "/bets"
      ? setVisible(false)
      : setVisible(true);
  };

  useEffect(() => {
    if (visible === null) toggleNav(pathname);
    events.on("routeChangeStart", toggleNav);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  return (
    <>
      <Animated
        tag="nav"
        className={`flex z-50 justify-between fixed duration-300 inset-x-0 top-0 ${
          state ? "px-6" : " px-4"
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
          className="px-2 z-10 pt-2 pb-1.5 rounded-b-2xl backdrop-blur-xl"
        >
          <Image
            width={65}
            height={28}
            priority
            src={"/logo2.svg"}
            alt="Oddsbet logo"
          />
        </Link>
        <Auth />
      </Animated>
    </>
  );
}

export default Nav;
