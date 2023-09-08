import React, { useContext, useEffect, useState } from "react";
import { PayTemplate } from ".";
import { Context } from "@/components/layout";
import { BiBadgeCheck } from "react-icons/bi";
import { BsCaretDownFill, BsTrophy } from "react-icons/bs";
import { promptService } from "@/services";
import Svg from "@/components/Svg";
import { sports } from "@/components/games";
import DropDown from "@/components/DropDown";

const FavSport = () => {
  const [item, setitem] = useState(undefined);

  useEffect(() => {
    !item && setitem(localStorage.getItem("favsport"));
  }, []);

  return (
    <DropDown
      a={item || 0}
      ngClass={"left-0"}
      changed={(key) => localStorage.setItem("favsport", key)}
      className="flex gap-2 z-30 text-c2 fx bg-c3 rounded-md pt-1 pb-1.5 pl-3 pr-4"
      iClass="flex gap-2 justify-start text-black bg-c3 rounded-md pt-1 pb-1.5 pl-3 pr-4 mt-2"
      item={<BsCaretDownFill className="text-9 text-black mt-0.5" />}
    >
      {[0, 1, 2].map((key) => (
        <>
          <Svg id={key + 1} className={"mt-0.5"} /> {sports[key].item}
        </>
      ))}
    </DropDown>
  );
};

const Stakes = () => {
  return <div>me</div>;
};

function Me() {
  const { user } = useContext(Context);

  const account = async (key) => {
    const data = key
      ? await userController.deleteAccount()
      : await userController.signout();
    if (data) {
      alertService.success(data.message);
      setUser(undefined);
      replace("/");
      promptService.clear();
    }
  };

  return (
    <PayTemplate v={user.email}>
      <div className="flex flex-1 items-center justify-start overflow-y-scroll overflow-x-hidden flex-col">
        <header className="fx pt-10 w-full bg-gradient-to-b from-c3 to-transparent gap-3">
          {["Total bets", "Bets Won"].map((v, key) => (
            <span
              className={`fx gap-2 relative shadow-lg rounded-lg py-3 pl-6 pr-7 ${
                key
                  ? "bg-green-500 shadow-green-500"
                  : "bg-sky-600 shadow-sky-500"
              }`}
              key={key}
            >
              {key ? (
                <BsTrophy className="text-green-200 text-sm" />
              ) : (
                <BiBadgeCheck className="text-sky-200 text-sm" />
              )}
              <span className="text-xl font-bold text-white">
                {key ? 89 : 309}
              </span>
              <span className="absolute bottom-[105%]">{v}</span>
            </span>
          ))}
        </header>
        <ul className="flex items-start  mt-10 w-full text-white flex-col relative gap-0.5">
          <span className="flex rounded-r-3xl bg-c5 dark:bg-black pt-2 pb-3 pl-4 pr-6 items-center text-black gap-1">
            Quick Settings
          </span>
          {["Payment Pin", "Favourite Sport", "Edit Stakes"].map(
            (item, key) => (
              <li
                key={key}
                className={`flex justify-between items-center w-full py-5 px-5 relative from-c3 text-black to-c3/30 bg-gradient-to-r dark:from-transparent dark:to-transparent dark:bg-c4/40 mx-auto ${
                  !key && "active:scale-95 duration-150"
                } ${key === 1 && ""} `}
              >
                <span>{item}</span>
                {/* {key === 0 && <Theme />} */}
                {/* {key === 1 && <Demo />} */}
                {!key && (
                  <span className="fx gap-2 mr-2">
                    {[0, 1, 2].map((key) => (
                      <span
                        key={key}
                        className="w-2 h-2 rounded-full bg-c5"
                      ></span>
                    ))}
                  </span>
                )}
                {key === 1 && <FavSport />}
              </li>
            )
          )}
        </ul>
        <ul className="flex items-start mb-1 mt-10 w-full text-white flex-col relative gap-0.5">
          <span className="flex rounded-r-3xl bg-c5 dark:bg-black pt-2 pb-3 pl-4 pr-6 items-center text-black gap-1">
            Account
          </span>
          {["Log out", "Delete Account"].map((item, key) => (
            <li
              key={key}
              className={`flex justify-between items-center w-full py-5 px-5 relative from-red-500/30 text-red-600 to-transparent bg-gradient-to-r dark:from-transparent dark:to-transparent dark:bg-c4/40 mx-auto active:scale-90 duration-150`}
              onClick={() =>
                promptService.prompt(
                  <>
                    {key ? (
                      <span className="fx flex-col">
                        Delete this account?
                        <span>All records will be lost</span>
                      </span>
                    ) : (
                      <>Are you sure you want to logout</>
                    )}
                  </>,
                  ["Yes", "No"],
                  account
                )
              }
            >
              <span>{item}</span>
              {/* {key === 0 && <Theme />}
                {key === 1 && <Demo />}
                {key === 1 && (
                  <BiTransferAlt className="dark:text-c2 text-white mr-2 scale-125 text-xl" />
                )}
                {key === 2 && <PaymentPin />} */}
            </li>
          ))}
        </ul>
      </div>
    </PayTemplate>
  );
}

export default Me;
