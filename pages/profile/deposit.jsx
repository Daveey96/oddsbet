import React, { useEffect, useState } from "react";
import { BiCheck, BiCopy, BiMoney, BiX } from "react-icons/bi";
import { PayTemplate } from ".";
import { condition } from "@/helpers";
import { Naira } from "@/components/layout/Nav";

function Amount({ value, setValue }) {
  return (
    <div
      className={`h-14 w-full mt-8 relative aft after:h-0.5 after:top-0 after:inset-x-0 after:bg-gradient-to-r after:from-c1 after:to-c2 bef before:h-0.5 before:bottom-0 before:inset-x-0 before:bg-gradient-to-r before:from-c1 before:to-c2  border-l-2 border-r-2 border-r-c2 fx border-l-c1 flex`}
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
  const [loading, setLoading] = useState(false);

  let info = [
    "Enter amount you want to transfer",
    "Proceed to your bank app and transfer the money to this account",
    "Confirming your transfer",
  ];

  const stage_I = () => {
    // setDisabled(true);
    setStage(1);
  };

  const stage_II = () => {
    // setDisabled(true);
    setStage(2);
  };

  useEffect(() => {
    if (parseInt(value) >= 200) setDisabled(false);
  }, [value]);

  return (
    <PayTemplate v={"Deposit"}>
      <div className="px-5 w-full flex flex-col items-center">
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
        {condition(
          stage,
          [0, 1, 2],
          [
            <>
              <Amount value={value} setValue={(v) => setValue(v)}></Amount>
              <button
                disabled={disabled}
                onClick={stage_I}
                className="bg-green-500 mt-3 w-full duration-100 disabled:opacity-50 fx h-14"
              >
                Deposit
              </button>
            </>,
            <div
              key={1}
              className="bg-c4/50 w-full relative flex flex-col items-center rounded-xl pt-3 pb-2 px-3 mx-auto"
            >
              <h2 className="mt-8 w-full relative flex justify-start text-4xl">
                3020100326
                <span>
                  <BiCopy className="text-c2 text-xl ml-1" />
                </span>
                <span className="text-lg w-full text-white/60 absolute bottom-full">
                  Kuda bank
                </span>
              </h2>
              <div className="flex items-center justify-end gap-4 pr-4 w-full mt-6">
                <span className="opacity-60">Amount</span>
                <span className="fx text-c2 text-xl gap-0.5">
                  <Naira /> {value}
                </span>
              </div>
              <div className="flex w-[96%] absolute top-[105%] flex-c gap-2">
                {[
                  <BiX key={213123} className="text-red-500" />,
                  <BiCheck key={141402} className="text-green-500" />,
                ].map((v, key) => (
                  <button
                    key={key}
                    disabled={disabled}
                    onClick={() => (key ? stage_II() : setStage(0))}
                    className={`gap-1 rounded-b-xl active:scale-90 duration-200 disabled:opacity-50 fx py-2.5 " ${
                      !key ? "bg-red-500/10" : "bg-green-500/10"
                    }`}
                  >
                    {v} {!key ? "cancel" : "i've sent it"}
                  </button>
                ))}
              </div>
            </div>,
            <>
              <span className="w-52 mt-2 text-3xl h-52 border-c2 border-8 rounded-full border-dotted fx">
                15:00
              </span>
              <button className="mt-6 text-c2 rounded-lg px-4 py-2">
                Transaction Details
              </button>
            </>,
          ]
        )}
      </div>
    </PayTemplate>
  );
}

export default Deposit;
