import React, { useContext, useEffect, useState } from "react";
import { PayTemplate } from ".";
import { Context } from "@/components/layout";
import { BiBadgeCheck } from "react-icons/bi";
import { BsCaretDownFill, BsTrophy } from "react-icons/bs";
import { promptService } from "@/services";
import Svg from "@/components/global/Svg";
import { sports } from "@/components/games";
import DropDown from "@/components/DropDown";
import { useRouter } from "next/navigation";
import { format } from "@/helpers";

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

const Input = ({ item }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(localStorage.getItem(item) || "");
  }, []);

  return (
    <input
      type="text"
      value={value}
      onBlur={() => localStorage.setItem(item, value)}
      onChange={(e) => setValue(format(e.target.value.split(",").join("")))}
      className="border-2 focus:border-c2 border-c5 text-center rounded-md w-20 py-1"
    />
  );
};

const Stakes = () => {
  return (
    <div className="flex no-bars whitespace-nowrap gap-6 overflow-x-scroll">
      {["Default Stake", "Stake +1", "Stake +2", "Stake +3"].map((v, key) => (
        <div key={key} className="fx flex-col">
          {v}
          <Input v={key} />
        </div>
      ))}
    </div>
  );
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
    <PayTemplate v={user?.email} route>
      <div className="flex flex-1 items-center justify-start  flex-col">
        <div className="overflow-y-scroll w-full overflow-x-hidden flex flex-1 items-center justify-start  flex-col">
          <header className="flex overflow-y-hidden pl-8 pt-10 whitespace-nowrap overflow-x-scroll no-bars pb-7 w-full bg-gradient-to-b bg-c3 gap-3">
            {["Total bets", "Bets Won", "Average Stake", "Highest Win"].map(
              (v, key) => (
                <span
                  className={`fx duration-200 last-of-type:mr-5 active:scale-90 gap-2 relative shadow-lg rounded-lg py-2 pl-6 pr-7 ${
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
                  <span className="text-lg font-bold text-white">0</span>
                  <span className="absolute bottom-[105%]">{v}</span>
                </span>
              )
            )}
          </header>
          <ul className="flex items-start  mt-5 w-full text-white flex-col relative gap-0.5">
            <span className="flex w-full from-c2/20 text-c2 to-transparent bg-gradient-to-r dark:bg-black pt-2 pb-3 pl-4 pr-6 items-center gap-1">
              Quick Settings
            </span>
            {["Payment Pin", "Favourite Sport", "Edit Stakes"].map(
              (item, key) => (
                <li
                  key={key}
                  className={`flex justify-between w-full  px-5 relative from-c3 text-black to-c3/30 bg-gradient-to-r dark:from-transparent dark:to-transparent dark:bg-c4/40 mx-auto ${
                    !key && "active:scale-95 duration-150"
                  } ${
                    key === 2 ? "flex-col pt-5 pb-3 gap-3" : "items-center py-5"
                  } `}
                >
                  {key !== 2 && <span>{item}</span>}
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
                  {key === 2 && <Stakes />}
                </li>
              )
            )}
          </ul>
        </div>
        <ul className="flex mb-5 px-6 items-start justify-self-end mt-10 w-full text-white relative gap-2.5">
          {["Log out", "Delete Account"].map((item, key) => (
            <li
              key={key}
              className={`flex rounded-lg justify-between items-center w-full py-3 px-5 relative shadow-lg text-white mx-auto active:scale-90 duration-150 ${
                key ? "bg-red-600 shadow-red-600" : "bg-red-500 shadow-red-500"
              }`}
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
