import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { PaystackButton } from "react-paystack";
import { PayTemplate } from ".";
import { Context } from "@/components/layout";
import { format, isArray } from "@/helpers";
import {
  BsBank,
  BsBank2,
  BsCaretDownFill,
  BsCheck2Circle,
  BsSearch,
} from "react-icons/bs";
import { useRouter } from "next/navigation";
import axios from "axios";
import { alertService } from "@/services";
import Retry from "@/components/services/Retry";
import Error from "@/components/services/Error";
import { CircularLoader, DotLoader } from "@/components/services/Loaders";
import { appController } from "@/controllers";

const Select = ({ onVerified }) => {
  const [value, setValue] = useState("");
  const [bank, setBank] = useState({});
  const [bankList, setBankList] = useState(null);
  const [accountNum, setAccountNum] = useState("");
  const [open, setOpen] = useState(false);
  const [bankName, setBankName] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const data = useMemo(
    () =>
      isArray(bankList)
        ? bankList.filter(({ name }) =>
            name.toLowerCase().includes(value.toLowerCase())
          )
        : bankList,
    [value, bankList]
  );

  const getOwner = async () => {
    if (bank?.code && accountNum.length === 10) {
      setDisabled(true);
      setBankName("loading");

      const { data } = await appController.valiDateAccount(
        accountNum,
        bank.code
      );

      if (data) setBankName(data);
      else {
        setBankName("error");
        setDisabled(false);
      }
    }
  };

  const getBankList = async () => {
    setBankList("loading");
    try {
      const { data } = await axios.get("https://nubapi.com/bank-json");
      setBankList(data);
    } catch (error) {
      alertService.error(error?.message);
      setBankList("error");
    }
  };

  useEffect(() => {
    open && !isArray(bankList) && getBankList();
  }, [open]);

  useMemo(getOwner, [accountNum, bank]);

  return (
    <>
      <div className="mt-12 w-[95%] overflow-hidden rounded-lg mx-auto bg-c3 flex flex-col text-base">
        <button
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className="flex px-4 active:scale-105 duration-200 py-3.5 w-full justify-between items-center"
        >
          <span>{!bank?.name ? "Select Bank" : bank.name}</span>{" "}
          <BsCaretDownFill className="text-c2" />
        </button>
        <div
          className={`w-full duration-150 overflow-hidden flex flex-col ${
            open ? "max-h-[55vh]" : "max-h-0"
          }`}
        >
          <div className="flex bg-c5/50 mx-2 items-center mb-2 rounded-3xl py-2 px-3">
            <input
              className="flex-1 peer px-3 order-2 capitalize"
              placeholder="Search for a bank"
              onChange={(e) => setValue(e.target.value)}
              value={value}
            />
            <BsSearch className="peer-focus:text-c2 order-1" />
          </div>
          <ul className="flex-1 relative after:absolute after:content-['No_results'] after:w-full empty:after:flex after:hidden after:justify-center after:mt-10 overflow-y-scroll px-1 mb-1.5 rounded-b-xl w-full overflow-x-hidden">
            <Retry
              state={data}
              loading={
                <span className="h-40 w-full fx">
                  <CircularLoader size={30} depth={2} color />
                </span>
              }
              error={
                <Error refresh={getBankList} className={"h-40 text-xs"} type />
              }
            >
              {isArray(bankList) &&
                data.map(({ name, code }, key) => (
                  <li
                    className="w-full flex gap-2 items-center py-3 px-3 rounded-lg my-1 bg-c4/5 border-b-2"
                    key={key}
                    onClick={() => {
                      setBank({ name, code });
                      setOpen(false);
                    }}
                  >
                    <BsBank2 /> {name}
                  </li>
                ))}
            </Retry>
          </ul>
        </div>
      </div>
      <div className="mt-2 w-[95%] overflow-hidden rounded-lg mx-auto bg-c3/60 flex flex-col text-base">
        <input
          placeholder="Accont Number"
          type="number"
          value={accountNum}
          disabled={disabled}
          onChange={(e) =>
            e.target.value.length < 11 && setAccountNum(e.target.value)
          }
          className="flex px-4 py-3.5 w-full justify-between items-center"
        />
      </div>
      {bankName && (
        <Retry
          state={bankName}
          loading={
            <span className="mt-0.5 gap-2 text-c2 px-4 items-center py-2.5 w-[95%] overflow-hidden rounded-lg mx-auto flex text-sm">
              <CircularLoader depth={2} />
              verifying
            </span>
          }
          error={<></>}
        >
          <div className="mt-2 bg-green-100 px-4 items-center py-2.5 text-green-500 gap-3 w-[95%] overflow-hidden rounded-lg mx-auto flex text-lg">
            <BsCheck2Circle className="text-lg" />
            <span>{bankName}</span>
          </div>
        </Retry>
      )}
    </>
  );
};

const Withdraw = () => {
  const { user } = useContext(Context);
  const [disabled, setDisabled] = useState(false);
  const { replace } = useRouter();
  const [verified, setVerified] = useState(false);

  const [amount, setAmount] = useState("");

  if (!user) replace("/profile");

  return (
    <PayTemplate v={"Withdraw"}>
      <div className="flex-1 overflow-y-scroll w-full">
        <Select onVerified={() => setVerified(true)} />
        {verified && (
          <div>
            <span className="pl-6 flex text-sm mt-10 mb-1">
              Available Balance -{" "}
              <span
                className={
                  user.balance > 99 ? "text-green-600" : "text-red-500"
                }
              >
                {user.balance}
              </span>
            </span>
            <div className="flex mb-14 text-base gap-1 flex-col mx-auto w-[95%] items-center">
              <input
                pattern="[0-9]"
                className="py-2.5 text-lg rounded-lg duration-150 placeholder:text-black/50 dark:placeholder:text-white/40 w-full border-4 focus:border-c2 border-c3 dark:border-c4 px-4"
                value={format(amount.split(",").join(""))}
                placeholder="Enter Amount"
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="w-full relative">
                <button className="w-full active:opacity-40 duration-200 text-white rounded-b-lg rounded-t-sm fx relative dark:bg-c4 bg-c4/25 overflow-hidden">
                  <span
                    className={`w-full ${
                      disabled ? "-translate-x-[110%]" : "-translate-x-0"
                    } rounded-inh text-white/0 relative py-3 fx duration-150 from-c1 to-c2 bg-gradient-to-r `}
                  >
                    Withdraw
                  </span>
                  <span className="z-10 absolute">Withdraw</span>
                </button>
                {disabled && <span className="absolute z-10 inset-0"></span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </PayTemplate>
  );
};

export default Withdraw;
