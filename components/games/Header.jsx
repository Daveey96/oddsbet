import React, { useContext, useEffect, useRef } from "react";
import List from "./List";
import { sports } from ".";

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
      className={`flex mb-px z-20 md:rounded-t-2xl sticky items-center w-full -top-[1px] flex-col pb-1 `}
    >
      <span className="max-w-[90%] text-base gap-1.5 flex items-center pl-4">
        {!live ? (
          <span className="flex items-center pr-1 gap-1">
            {title.split(" ")[0]}
            <span className="text-white/30 mt-0.5 text-sm">
              {title.split(" ")[1]}
            </span>
          </span>
        ) : (
          <span className="flex gap-1 items-center mr-3">
            <svg
              width="1rem"
              height="1rem"
              className="mb-0.5"
              version="1.1"
              viewBox="0 0 32 32"
            >
              <g
                transform="matrix(.96845 0 0 .97075 .53375 .41541)"
                stroke="#06b6d4"
              >
                <path
                  d="m18.798 7.9641h-5.5966l0.052265 0.035938h-9.254c-2.209 0-4 1.791-4 4v16c0 2.209 1.791 4 4 4h24c2.209 0 4-1.791 4-4v-16c0-2.209-1.791-4-4-4h-9.254zm-14.798 2.0359h24c1.104 0 2 0.89601 2 2v16c0 1.104-0.89601 2-2 2h-24c-1.104 0-2-0.89601-2-2v-16c0-1.104 0.89601-2 2-2zm19.181 5.6163c-0.05326 0.02331-0.10235 0.05122-0.115 0.07594 0.01101-0.0023 0.02204-0.0047 0.03305-7e-3 0.0023 2e-3 4e-3 0.0065 7e-3 6e-3 0.03301-0.0053 0.05747-0.04207 0.075-0.07492zm-12.854 11.908c-0.03172 0.01349-0.06288 0.02816-0.09297 0.04477-0.0064 0.0036 0.01522-5.12e-4 0.02172-0.0038 0.02426-0.01271 0.04783-0.02671 0.07125-0.04094zm1.9587 0.46547c-0.0024 0.0036-0.0049 0.0071-0.0073 0.01063h0.03c-0.0075-0.0035-0.01511-0.0071-0.02266-0.01063z"
                  fill="#06b6d4"
                  fillRule="evenodd"
                />
                <path
                  d="m26.969 0.09125c-0.18473 8.8365e-4 -0.37153 0.056141-0.53828 0.17078 0 0-9.61 6.635-10.422 7.125l-10.44-7.125c-0.16277-0.11215-0.34489-0.16752-0.5257-0.1707-0.012054-2.1222e-4 -0.024136-1.7199e-4 -0.036172 7.813e-5 -0.32095 0.0066699-0.6332 0.17711-0.82008 0.48461-0.3 0.492-0.168 1.15 0.295 1.469l8.7197 5.9991h5.5966l8.7197-5.9991c0.46299-0.319 0.59499-0.97699 0.295-1.469-0.19155-0.31519-0.51437-0.48634-0.84367-0.48477z"
                  fill="#06b6d4"
                  fillRule="evenodd"
                />
                <path
                  d="m11.283 14.811c0.01618 3.8498 0.06881 7.7 0.13282 11.55 3.6896-1.9413 7.3717-3.8875 11.034-5.8723-3.7045-2.0401-7.4288-4.0463-11.166-6.0323l-0.0014 0.24449z"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.8593"
                />
              </g>
            </svg>
            <span className="z-10 font-bold text-base">Live</span>
          </span>
        )}
        <span className="opacity-50">|</span>
        <List
          className={"w-full"}
          iClass="py-0.5 shadow-[0px_2px_2px_1px] mt-0.5 mb-0.5 text-[13px] gap-1 pl-2"
          activeClass={`text-c2 dark:bg-c2/5 shadow-black/20 ${
            live ? "bg-c2/5" : ""
          } rounded-lg pr-3`}
          inActiveClass={"bg-white/5 rounded-lg pr-2 shadow-black/20"}
          onActive={true}
          onClick={changeSport}
          list={sports}
          v="id"
          icon
        />
      </span>
      <List
        className={"mt-px text-[13px] w-[95%] mb-0.5 py-1 px-2"}
        iClass={`px-2.5 py-0.5 dark:bg-gray-700/5 dark:shadow-black/20 dark:shadow-[0px_2px_2px_1px] ${
          live ? "bg-gray-700/5 shadow-black/20 shadow-[0px_2px_2px_1px]" : ""
        } active:opacity-10 opacity-100 rounded-lg duration-200`}
        inActiveClass={`dark:text-white/60 ${
          live ? "text-white/60" : "text-black"
        }`}
        activeClass={"text-c2"}
        onClick={(v) => setMkt(v)}
        list={sports[sport - 1].markets}
        key={sport}
      />
    </header>
  );
}

export default Header;
