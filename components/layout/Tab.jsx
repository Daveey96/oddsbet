import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import BetList, { BetListButton } from "../games/BetList";

export default function Tab() {
  const { pathname, events } = useRouter();
  const [pathName, setPathName] = useState(pathname);
  const [toggle, setToggle] = useState(false);

  const links = [
    {
      path: "/",
      text: "home",
      iconProps: ["1.05em", "0 0 24 24"],
      svgPath: (
        <path d="M12.71 2.29a1 1 0 0 0-1.42 0l-9 9a1 1 0 0 0 0 1.42A1 1 0 0 0 3 13h1v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7h1a1 1 0 0 0 1-1 1 1 0 0 0-.29-.71zM6 20v-9.59l6-6 6 6V20z"></path>
      ),
    },
    {
      path: "/bets",
      text: "open bets",
      iconProps: ["1.6em", "0 0 34.804 34.804"],
      svgPath: (
        <path d="M29.235 18.167h-1l-4e-3 -8.381-12.673 5e-3 -0.08701 1e-3h-1.285l-2.253 1e-3 -0.08701-1e-3h-1.75l5.375-4.125v3.125l13.758-6e-3zm-26.732 6.5729 29.801-9e-3 -29.801 9e-3 -2e-3 -14.665zm19.92-7.339c0-2.771-2.248-5.021-5.022-5.021-2.774 2e-3 -5.024 2.25-5.022 5.023 2e-3 2.774 2.25 5.021 5.024 5.021 2.772 1e-3 5.022-2.249 5.02-5.023zm-2.623 8e-3c0.304 0.257 0.457 0.722 0.455 1.396 0 0.73-0.164 1.242-0.494 1.533-0.332 0.297-0.907 0.44-1.729 0.441l-0.24 5e-3v0.771l-0.786 3e-3v-0.772l-0.222-3e-3c-0.822 0-1.396-0.141-1.73-0.421-0.334-0.283-0.501-0.771-0.501-1.465l4e-3 -0.237 1.163 1e-3v0.12c0 0.424 0.068 0.696 0.205 0.82 0.134 0.122 0.437 0.187 0.906 0.186l0.171 7e-3 2e-3 -1.869c-0.917 2e-3 -1.543-0.133-1.879-0.396-0.334-0.268-0.502-0.762-0.502-1.491 2e-3 -0.704 0.168-1.188 0.504-1.448s0.962-0.392 1.875-0.391l2e-3 -0.671 0.785-1e-3 -1e-3 0.67c0.874-1e-3 1.467 0.124 1.792 0.375 0.32 0.248 0.479 0.712 0.479 1.391l-2e-3 0.157-1.125-1e-3 -4e-3 -0.125c2e-3 -0.511-0.317-0.767-0.959-0.767l-0.179-3e-3 -3e-3 1.728 0.259 9e-3c0.867 0.044 1.454 0.193 1.754 0.448zm-2.797-2.191-0.167 6e-3c-0.691 2e-3 -1.034 0.272-1.035 0.82 0 0.568 0.344 0.856 1.029 0.855 8e-3 -2e-3 0.066 4e-3 0.173 9e-3zm2.073 3.606c2e-3 -0.35-0.08-0.581-0.248-0.691-0.165-0.112-0.512-0.17-1.04-0.168l-1e-3 1.822 0.17 2e-3c0.748 0 1.121-0.323 1.119-0.965zm1.6666 5.7528-14.693 0.011-3e-3 -8.667h-1l3e-3 9.667 15.693-0.01v3.124l5.375-4.125z"></path>
      ),
    },
    {
      path: "/profile",
      text: "me",
      iconProps: ["1em", "0 0 24 24"],
      svgPath: (
        <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"></path>
      ),
    },
  ];

  useEffect(() => {
    events.on("routeChangeStart", (url) =>
      setTimeout(() => {
        setPathName(url);
      }, 500)
    );
  }, [events]);

  return (
    <>
      <div className="fixed bottom-0 z-[22] flex justify-center px-4 rounded-t-[60px] inset-x-4 pt-2.5 bg-black text-white">
        {links.map((link, key) => (
          <motion.button
            key={key}
            whileTap={{ scale: 0.85 }}
            className="z-10 flex-1 relative fx"
          >
            <Link
              href={link.path}
              className={`fx h-full w-full ${key ? "pb-5" : "pb-[22px]"}`}
            >
              <Svg icon={link.iconProps}>{link.svgPath}</Svg>
              <span className="dark:text-[10px] text-[11px] absolute bottom-2">
                {link.text}
              </span>
            </Link>
            {pathName.split("/")[1] === link.path.slice(1) && (
              <motion.div
                layoutId="underline"
                className=" dark:from-c1 dark:to-c2 dark:bg-gradient-to-r bg-c2 h-2 absolute bottom-0 w-[70%] blur-md"
              />
            )}
          </motion.button>
        ))}
        <AnimatePresence>
          <BetListButton toggle={toggle} setToggle={(t) => setToggle(t)} />
        </AnimatePresence>
      </div>
      <BetList toggle={toggle} setToggle={(t) => setToggle(t)} />
    </>
  );
}

const Svg = ({ children, type = true, icon }) => {
  return (
    <svg width={icon[0]} height={icon[0]} viewBox={icon[1]} version="1.1">
      <g className={"fill-c2"}>{children}</g>
    </svg>
  );
};
