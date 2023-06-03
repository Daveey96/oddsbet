import React, { useEffect, useState } from "react";
import Auth from "../Auth";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRouter } from "next/router";

function Nav() {
  const { scrollY } = useScroll();
  const router = useRouter();
  const [state, setState] = useState(scrollY > 0 ? 1 : 0);
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollY, "change", (latest) => {
    latest > 20 ? !state && setState(1) : state && setState(0);
  });


  // useEffect(() => {
  //   if (router.pathname === "/bets") {
  //   }
  //   if (router.pathname === "/bets") {
  //   }
  // }, [router]);

  return (
    <>
      {visible && (
        <motion.nav
          className={`flex z-50 py-1 justify-between fixed duration-300 inset-x-0 top-0 items-center ${
            state ? "px-10 bg-black/75" : " px-8 bg-black/0"
          }`}
        >
          <img src={"/logo2.svg"} className={"w-14 z-10 h-12"} />
          <Auth />
        </motion.nav>
      )}
    </>
  );
}

export default Nav;
