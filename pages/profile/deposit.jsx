import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BiLeftArrowAlt, BiMoney } from "react-icons/bi";
import { PayTemplate } from ".";
import { Naira } from "@/components/layout/Nav";

function Amount({ value, setValue }) {
  return (
    <div
      className={`h-14 w-full relative aft after:h-0.5 after:top-0 after:inset-x-0 after:bg-gradient-to-r after:from-c1 after:to-c2 bef before:h-0.5 before:bottom-0 before:inset-x-0 before:bg-gradient-to-r before:from-c1 before:to-c2  border-l-2 border-r-2 border-r-c2 fx border-l-c1 flex`}
    >
      <label className="text-c1 text-xl absolute left-0 px-5 fx ">
        <BiMoney />
      </label>
      <input
        type={"number"}
        className="h-full w-full text-md pl-14 pr-2"
        value={value}
        placeholder={`min 200`}
        onChange={({ target }) => setValue(target.value)}
      />
    </div>
  );
}

function Deposit() {
  const [value, setValue] = useState("");
  const [stage, setStage] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [activePage, setActivePage] = useState(0);

  let info = [
    "Enter amount you want to transfer",
    "Proceed to your bank app and transfer the money to this account",
    "Confirming your transfer",
  ];

  const stage_I = (params) => {
    setDisabled(true);
    setStage(1);
  };

  useEffect(() => {
    if (parseInt(value) >= 200) setDisabled(false);
  }, [value]);

  return (
    <PayTemplate v={"Deposit"}>
      <nav className="flex border-b-2 border-b-c4 mx-5 justify-around">
        {["transfer", "card"].map((v, key) => (
          <button
            className={`text-sm ${
              activePage === key
                ? "text-c2 aft pb-2.5 pt-2 active:opacity-20 fx relative after:bottom-0 after:h-1 after:rounded-t-2xl after:from-c1 after:to-c2 after:bg-gradient-to-br after:w-6"
                : "text-white/75"
            }`}
            onClick={() => setActivePage(key)}
            key={key}
          >
            via {v}
          </button>
        ))}
      </nav>
      <div className="px-5 w-full ">
        <div className="fx mb-4 mt-6 gap-2 w-full">
          {[0, 1, 2].map((key) => (
            <React.Fragment key={key}>
              {key ? (
                <span
                  className={`h-px rounded-2xl  outline-none border-0 w-1/4 ${
                    stage >= key ? "bg-c1" : "bg-white/30"
                  }`}
                ></span>
              ) : (
                ""
              )}
              <span
                className={` border-2 w-7 h-7 text-sm  fx rounded-full ${
                  stage >= key
                    ? "border-c1 text-c2"
                    : "border-white/30 text-white/30"
                }`}
              >
                {key + 1}
              </span>
            </React.Fragment>
          ))}
        </div>
        <div className="mb-8 opacity-70 text-sm text-center">{info[stage]}</div>
        <Amount value={value} setValue={(v) => setValue(v)}></Amount>
        <button
          disabled={disabled}
          onClick={stage_I}
          className="bg-green-500 mt-3 w-full duration-100 disabled:opacity-50 fx h-14"
        >
          Deposit
        </button>
      </div>
    </PayTemplate>
  );
}

export default Deposit;
