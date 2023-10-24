import React, { useEffect, useRef } from "react";
import List from "./List";
import { sports } from ".";
import { BsLayersFill } from "react-icons/bs";
import { BiLayout } from "react-icons/bi";
import Image from "next/image";

const Title = ({ live }) => {
  return live ? (
    <svg
      width="210mm"
      height="100mm"
      version="1.1"
      viewBox="0 0 210 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="scale(1.0859 .92089)" aria-label="Live">
        <g transform="matrix(1 0 0 1.1374 3.0847e-8 -4.8231)" fill="#0ff">
          <path d="m0.74945 10.202h25.649v51.236q0 6.0017 1.8953 8.0233 1.9584 1.9584 7.6443 1.9584h1.3267v25.018h-6.823q-14.025 0-21.859-8.1497-7.8338-8.2129-7.8338-22.743z" />
          <path d="m67.779 33.451v62.986h-23.628v-62.986zm-11.751-28.113q4.8014 0 8.276 3.4115 3.5378 3.3483 3.5378 7.9601 0 4.9277-3.3483 8.0865-3.2851 3.1588-8.4656 3.1588t-8.5287-3.1588q-3.2851-3.1588-3.2851-8.0865 0-4.6118 3.4747-7.9601 3.5378-3.4115 8.3392-3.4115z" />
          <path d="m129 33.451-29.44 65.45-29.061-65.45h22.554l6.6966 16.994 7.3284-16.994z" />
          <path d="m193.44 68.766h-35.821q-0.82128-2.7166-0.82128-4.9909 0-3.1588 1.1372-6.1912h12.003q-1.2635-7.0125-7.897-7.0125-4.4223 0-7.202 3.7905-2.7797 3.7274-2.7797 9.6027 0 6.1281 2.6534 9.9186 2.7166 3.7905 7.0757 3.7905 3.5378 0 6.823-3.5378l13.456 16.173q-9.4132 7.3916-20.911 7.3916-14.025 0-23.565-9.4132-9.5395-9.4132-9.5395-23.312 0-13.835 9.6027-23.375 9.6659-9.5395 23.691-9.5395 13.709 0 22.996 9.35 9.35 9.2868 9.35 22.933 0 1.3899-0.25271 4.4223z" />
        </g>
      </g>
    </svg>
  ) : (
    <svg
      width="210mm"
      height="60mm"
      version="1.1"
      viewBox="0 0 210 60"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="scale(.96133 1.0402)" aria-label="Games">
        <g fill="#fff">
          <path d="m26.833 26.178h15.219q4.9156 6.0953 4.9156 12.859 0 7.8649-5.7807 13.213-5.7414 5.3481-14.157 5.3481-10.932 0-18.561-8.2975-7.629-8.2975-7.629-20.213 0-11.955 7.7469-19.898 7.7863-7.9436 19.426-7.9436 3.9718 0 8.8087 1.6123v15.966q-3.7752-1.7696-6.8818-1.7696-5.6234 0-9.2019 3.4999-3.5392 3.4999-3.5392 9.084 0 5.7021 3.3033 9.0446t8.9267 3.3426q3.5785 0 3.5785-2.0842 0-1.573-2.3595-1.573h-3.8145z" />
          <path d="m71.461 41.554v15.219q-1.8089 0.3146-3.3033 0.3146-8.848 0-14.747-5.82-5.8987-5.82-5.8987-14.589 0-8.5334 5.938-14.471 5.9773-5.938 14.511-5.938 9.5165 0 14.983 5.5841 5.5054 5.5448 5.5054 15.179v19.23h-14.707v-18.168q0-3.1066-1.5337-4.9549-1.4943-1.8483-4.0504-1.8483-2.3201 0-4.0111 1.691t-1.691 4.0111q0 2.4381 1.5337 4.0111 1.5337 1.573 3.8931 1.573 1.9269 0 3.5785-1.0224z" />
          <path d="m144.79 56.261h-14.707v-21.157q0-2.4381-0.51122-3.3819-0.51122-0.94379-1.8482-0.94379-2.4774 0-2.4774 4.365v21.117h-14.707v-21.157q0-2.4381-0.55054-3.3819-0.51122-0.94379-1.8482-0.94379-2.4381 0-2.4381 4.365v21.117h-14.707v-24.145q0-6.6065 4.4437-11.207 4.4437-4.6403 10.775-4.6403 6.5279 0 11.719 5.5054 5.7807-5.5054 11.561-5.5054 7.3537 0 11.797 5.3481 3.4999 4.1684 3.4999 12.151z" />
          <path d="m187.92 39.037h-22.297q-0.51122-1.691-0.51122-3.1066 0-1.9662 0.70784-3.8538h7.4717q-0.78649-4.365-4.9156-4.365-2.7527 0-4.483 2.3595-1.7303 2.3201-1.7303 5.9773 0 3.8145 1.6516 6.1739 1.691 2.3595 4.4043 2.3595 2.2022 0 4.247-2.2022l8.3761 10.067q-5.8594 4.601-13.016 4.601-8.73 0-14.668-5.8594-5.938-5.8594-5.938-14.511 0-8.6121 5.9773-14.55 6.0166-5.938 14.747-5.938 8.5334 0 14.314 5.82 5.82 5.7807 5.82 14.275 0 0.86514-0.1573 2.7527z" />
          <path d="m217.92 17.605v15.494q-3.1066 0-4.2864 1.1797-1.1404 1.1404-1.455 4.5616-1.0224 11.365-8.8087 16.044-4.1291 2.4381-11.719 2.4381h-2.0449v-15.573h0.66851q3.5392 0 5.0335-1.455 1.5337-1.4943 1.7696-5.1908 0.3146-6.0167 1.1011-8.4548 0.82581-2.4381 3.3033-4.8369 4.3257-4.2077 11.994-4.2077z" />
        </g>
      </g>
    </svg>
  );
};

function Header({ setMkt, live, title, changeSport, sport }) {
  const header = useRef(null);

  useEffect(() => {
    const scrollElement = document.getElementById("scroll-container");
    let pos = document.getElementById(
      `${live ? "live" : "notLive"}`
    )?.offsetTop;

    scrollElement.scrollTop > pos
      ? header.current.classList.add(live ? "isSticky2" : "isSticky")
      : header.current.classList.add(live ? "isNotSticky2" : "isNotSticky");

    scrollElement.addEventListener("scroll", (e) => {
      if (header.current !== null) {
        if (
          pos !==
          document.getElementById(`${live ? "live" : "notLive"}`).offsetTop
        )
          pos = document.getElementById(
            `${live ? "live" : "notLive"}`
          ).offsetTop;

        e.target.scrollTop > pos
          ? !header.current.classList.contains(
              live ? "isSticky2" : "isSticky"
            ) &&
            header.current.classList.replace(
              live ? "isNotSticky2" : "isNotSticky",
              live ? "isSticky2" : "isSticky"
            )
          : header.current.classList.contains(
              live ? "isSticky2" : "isSticky"
            ) &&
            header.current.classList.replace(
              live ? "isSticky2" : "isSticky",
              live ? "isNotSticky2" : "isNotSticky"
            );
      }
    });
  }, []);

  return (
    <header
      ref={header}
      className={`flex mb-px duration-200 z-20 pt-11 md:rounded-t-2xl sticky items-center w-full -top-[1px] flex-col pb-1 ${
        live ? "dark:bg-c4/30" : "bg-white dark:bg-c4"
      }`}
    >
      <span className="max-w-[80%] overflow-hidden rounded-lg text-base gap-1.5 flex items-center pl-4">
        <Image
          src={live ? "/live.svg" : "/games.svg"}
          width={live ? 40 : 65}
          className={`mr-3 ${live ? "" : "invert dark:invert-0"}`}
          height={50}
          alt=""
        />
        <List
          className={"w-full"}
          iClass="py-1 shadow-[0px_2px_2px_1px] my-1.5 text-xs gap-1 px-3"
          activeClass={`text-c2 dark:bg-c2/5 shadow-black/20 rounded-2xl`}
          inActiveClass={"rounded-2xl dark:bg-black/10 shadow-black/20"}
          onActive={true}
          onClick={changeSport}
          list={sports}
          v="id"
          icon
        />
      </span>
      <span className="w-full fx relative">
        <List
          id={!live && "smkt"}
          className={"mt-px scroll-smooth text-xs mb-1 w-[95%] py-1 px-2"}
          iClass={`px-3.5 py-1 dark:shadow-black/20 dark:shadow-[0px_2px_2px_1px] ${
            live
              ? "bg-black/50 shadow-black/20 shadow-[0px_2px_2px_1px]"
              : "shadow-black/20 last-of-type:mr-1 shadow-[0px_2px_2px_1px]"
          } active:scale-75 bg-c4/5 rounded-2xl duration-200`}
          inActiveClass={`dark:bg-black/40 dark:text-white/60 ${
            live ? "text-white/60" : "text-black"
          }`}
          activeClass={"text-c2 dark:bg-c2/5"}
          onClick={(v) => setMkt(v)}
          list={
            live
              ? [
                  ...sports[sport - 1].markets.filter((v) => v.live),
                  { item: "Home Over/Under", v: "HOU" },
                  { item: "Away Over/Under", v: "AOU" },
                ]
              : sports[sport - 1].markets
          }
          key={sport}
        />
      </span>
    </header>
  );
}

export default Header;
