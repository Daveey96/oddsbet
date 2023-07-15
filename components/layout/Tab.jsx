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
      svgPath: (
        <>
          <path d="m0.65218 12.121c0-2.572 0-3.858 0.59256-4.9241 0.59256-1.0661 1.6752-1.7277 3.8402-3.051l2.2826-1.3951c2.2887-1.3988 3.4332-2.0982 4.6976-2.0982s2.4089 0.6994 4.6976 2.0982l2.2826 1.3951c2.1652 1.3233 3.2477 1.9849 3.8402 3.051 0.59256 1.0661 0.59256 2.352 0.59256 4.9241v1.7096c0 4.3841 0 6.5764-1.3371 7.9383-1.337 1.3621-3.4892 1.3621-7.7932 1.3621h-4.5652c-4.3041 0-6.4562 0-7.7933-1.3621-1.3371-1.362-1.3371-3.5541-1.3371-7.9383z" />
          <path
            d="m8.6413 17.792c-0.47274 0-0.85598 0.37741-0.85598 0.84294 0 0.46553 0.38324 0.84294 0.85598 0.84294h6.8478c0.47273 0 0.85598-0.37741 0.85598-0.84294 0-0.46553-0.38325-0.84294-0.85598-0.84294z"
            fill="#000"
          />
        </>
      ),
    },
    {
      text: "bets",
      path: "/bets",
      svgPath: (
        <path d="m17.068 11.615-2.9332-0.78004 4.7e-5 -4.9476 0.23465 8e-7c1.4959-1.24e-5 2.6985 1.0029 2.6985 2.2287 0 0.91374 0.9973 1.6715 2.1998 1.6715 1.2026-4.3e-6 2.1998-0.7577 2.1999-1.6715-1e-6 -3.0755-3.1677-5.5716-7.0981-5.5716l-0.23465-7e-7 -6e-6 -0.55716c0-0.91374-0.9973-1.6715-2.1998-1.6715-1.2026 4.17e-6 -2.1998 0.7577-2.1999 1.6715l-4.7e-6 0.55716-0.87993 3.7e-6c-3.549-4.1e-6 -6.4528 2.2732-6.4528 5.0813-8.9e-6 3.2538 2.4931 4.3013 4.3996 4.8139l2.9331 0.78003-4.87e-5 4.9476h-0.23465c-1.4958 3e-6 -2.6985-1.0029-2.6985-2.2287-3e-7 -0.91374-0.9973-1.6715-2.1998-1.6715-1.2026 4e-6 -2.1998 0.7577-2.1999 1.6715 1.9e-6 3.0755 3.1678 5.5717 7.0981 5.5716l0.23465-1e-6 7e-6 0.55716c0 0.91374 0.9973 1.6715 2.1998 1.6715 1.2025 8e-6 2.1998-0.7577 2.1999-1.6715l-5e-6 -0.55716 0.87993-4e-6c3.549-5e-6 6.4528-2.2732 6.4528-5.0813 1.2e-5 -3.2761-2.4931-4.3236-4.3996-4.8139zm-8.8286-2.3624c-0.99725-0.26744-1.4373-0.42346-1.4373-1.6493 3.9e-6 -0.95832 0.93859-1.7383 2.0531-1.7384l0.87993-3.7e-6 -1.2e-6 3.7664zm6.7755 8.8923-0.87993 4e-6 1e-6 -3.7664 1.4958 0.40115c0.99725 0.26744 1.4373 0.42346 1.4373 1.6492-3e-6 0.93603-0.93859 1.716-2.0531 1.7161z" />
      ),
    },
    {
      path: "/profile",
      text: "me",
      svgPath: (
        <>
          <path d="m21.339 20.706c-2.5882 1.6926-5.7227 2.6831-9.1001 2.6831-3.3775 0-6.5119-0.99067-9.1001-2.6833-1.1431-0.74755-1.6317-2.1715-0.96701-3.3303 1.3778-2.4023 4.2169-3.8985 10.067-3.8985 5.8502 0 8.6893 1.4964 10.067 3.8985 0.66467 1.1588 0.17606 2.5829-0.967 3.3305z" />
          <path d="m12.239 11.639c3.1367 0 5.6793-2.4205 5.6793-5.4066 0-2.9859-2.5426-5.4066-5.6793-5.4066-3.1365 0-5.6793 2.4207-5.6793 5.4066 0 2.9861 2.5428 5.4066 5.6793 5.4066z" />
        </>
      ),
    },
  ];

  useEffect(() => {
    events.on("routeChangeStart", (url) => {
      setPathName(url);
    });
  }, [events]);

  return (
    <>
      <div className="fixed after:bg-black aft after:h-56 after:top-[97%] after:inset-x-0 px-[8vw] md:px-[3vw] items-end -bottom-1 md:h-12 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-1/2 md:rounded-t-none md:bg-black/75 md:backdrop-blur-sm md:top-0 md:bottom-auto md:z-[55] z-[23] flex justify-between md:justify-center md:gap-[10%] rounded-t-[60px] md:rounded-none inset-x-4 bg-black text-white">
        {links.map((link, key) => (
          <Link
            href={link.path}
            key={key}
            className={`fx w-[25%] pb-3.5 pt-4 gap-1 relative duration-200 active:scale-90 z-10 px-[2vw] md:h-7 md:pb-3 md:items-end `}
          >
            <svg
              className={`${pathName === link.path ? " fill-c2 " : "fill-c4"} `}
              width={"20px"}
              height={"20px"}
              viewBox={"0 0 24 24"}
            >
              {link.svgPath}
            </svg>
            <span className="text-xs md:hidden mt-1">{link.text}</span>
            {/* {key === 1 && (
              <span className="bg-rose-700 py-px px-1.5 rounded-full absolute -right-2 -top-1">
                2
              </span>
            )} */}
          </Link>
        ))}
        <AnimatePresence>
          <BetListButton toggle={toggle} setToggle={(t) => setToggle(t)} />
        </AnimatePresence>
      </div>
      <BetList toggle={toggle} setToggle={(t) => setToggle(t)} />
    </>
  );
}
