import Link from "next/link";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { Context } from ".";
import Button from "../betlist/Button";
import BetList from "../betlist";

export default function Tab() {
  const { pathname, events } = useRouter();
  const [pathName, setPathName] = useState(pathname);
  const [toggle, setToggle] = useState(false);
  const { ping, setGame, setOpen } = useContext(Context);

  const visible = useMemo(
    () => (pathName === "" || pathName === "/" ? true : false),
    [pathName]
  );

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
        <path d="m2.5505 14.348 2.6778 0.0064c0.7384 2e-6 1.337 0.49563 1.3369 1.1071-3e-7 0.61137-0.59855 1.1071-1.3369 1.1071l-2.6425-2e-6c-0.64374 1e-6 -0.96568 0-1.163 0.17051-0.19747 0.17051-0.18397 0.43136-0.15723 0.95316 0.10535 2.0573 0.44227 3.3213 1.5183 4.2122 1.0784 0.8931 2.6095 1.1713 5.1044 1.2579 0.49467 0.01723 0.74214 0.02585 0.90713-0.05047 0.16511-0.07631 0.371-0.381 0.78305-0.99038 0.4575-0.67674 1.3316-1.1342 2.3347-1.1342 1.0031 0 1.8772 0.45742 2.3347 1.1342 0.41202 0.60936 0.61798 0.91407 0.78302 0.99038 0.16506 0.0763 0.41244 0.0677 0.9072 0.05047 2.4949-0.08658 4.0259-0.36476 5.1044-1.2578 1.1706-0.96926 1.4663-2.3801 1.541-4.7737 0.0096-0.30877-0.29183-0.56222-0.66484-0.56223l-3.3207 9e-6c-0.73837 0-1.337-0.49574-1.3369-1.1071 2e-6 -0.61148 0.59858-1.1071 1.3369-1.1071l3.3443-0.0081c0.36843-8.77e-4 0.66654-0.24848 0.66652-0.55352l2.3e-5 -3.8764c0-4.1751 0-6.2627-1.5663-7.5597-1.0785-0.89301-2.6095-1.1712-5.1044-1.2578-0.49477-0.017184-0.74216-0.025777-0.90719 0.050535-0.16505 0.076319-0.37102 0.38099-0.78302 0.99031-0.4575 0.67672-1.3316 1.1342-2.3347 1.1342-1.0031-1e-7 -1.8772-0.45743-2.3347-1.1342-0.41205-0.60932-0.61794-0.91399-0.78306-0.99031-0.16498-0.076308-0.41245-0.067719-0.90712-0.050535-2.4949 0.086636-4.026 0.3648-5.1044 1.2579-1.5664 1.297-1.5664 3.3846-1.5664 7.5597l-9e-7 3.3245c1.6e-6 0.52048 1e-6 0.78077 0.19507 0.94278 0.19519 0.16201 0.50938 0.16278 1.138 0.16432zm8.0256 2.2206 2.6739-1e-6c0.7384 2e-6 1.337-0.49574 1.3369-1.1071 0-0.61148-0.59855-1.1071-1.3369-1.1071h-2.6739c-0.7384 0-1.337 0.49563-1.3369 1.1071 0 0.61137 0.59856 1.1071 1.3369 1.1071z" />
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
      // setGame(null);
      // setOpen(null);
      setPathName(url);
    });
  }, [events]);

  return (
    <>
      <div className="fixed -bottom-1 inset-x-0 flex justify-center z-[27]">
        <div
          className={`relative px-[2vw] duration-150 max-w-[100vw] min-w-[90vw] md:min-w-[auto] flex md:justify-center md:gap-[10%] rounded-t-[60px] md:rounded-none text-white ${
            toggle
              ? "dark:bg-c4 bg-[rgb(9,11,16)]"
              : "dark:bg-black bg-c4 text-black"
          }`}
        >
          {links.map((link, key) => (
            <Link
              href={link.path}
              key={key}
              className={`fx pb-4 pt-3.5 flex-1 gap-1 relative duration-200 active:scale-90 z-10 px-[2vw] md:h-7 md:pb-3 md:items-end `}
            >
              <svg
                className={`${
                  pathName === link.path ? " fill-c2 " : "fill-white/20"
                } `}
                width={"22px"}
                height={"22px"}
                viewBox={"0 0 24 24"}
              >
                {link.svgPath}
              </svg>
              <span
                className={`text-xs relative mt-1 ${
                  ping &&
                  key === 1 &&
                  "aft after:bg-rose-500 after:w-2 after:h-2 after:rounded-full after:left-[120%] after:bottom-[90%]"
                }`}
              >
                {link.text}
              </span>
            </Link>
          ))}
          <AnimatePresence>
            {visible && (
              <Button toggle={toggle} setToggle={(t) => setToggle(t)} />
            )}
          </AnimatePresence>
        </div>
      </div>
      {visible && <BetList toggle={toggle} setToggle={(t) => setToggle(t)} />}
    </>
  );
}
