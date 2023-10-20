import React, { useEffect, useState } from "react";
import { PayTemplate } from ".";
import { BiFootball, BiTransferAlt, BiXCircle } from "react-icons/bi";
import Retry from "@/components/services/Retry";
import { appController } from "@/controllers";
import { CircularLoader } from "@/components/services/Loaders";
import { condition, format } from "@/helpers";

function Transactions() {
  const [array, setArray] = useState(null);

  const getTransactions = async () => {
    setArray("loading");

    const data = await appController.getTransactions();

    data ? setArray(data.reverse()) : setArray("error");
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <PayTemplate v={"Transaction History"}>
      <Retry
        state={array}
        loading={
          <span className="fx mt-[25vh]">
            <CircularLoader size={30} color />
          </span>
        }
        error={
          <span className="fx flex-col -translate-y-1/2 mt-[20vh] gap-3">
            <BiXCircle className="text-4xl opacity-25" />
            <span>Something went wrong</span>
            <button
              className="relative px-4 py-1.5 aft after:h-0.5 after:top-0 after:inset-x-0 after:bg-gradient-to-r after:from-c1 after:to-c2 bef before:h-px before:bottom-0 before:inset-x-0 before:bg-gradient-to-r before:from-c1 before:to-c2  border-l-2 border-r-2 border-r-c2 fx border-l-c1 flex text-c2"
              onClick={getTransactions}
            >
              Retry
            </button>
          </span>
        }
      >
        <div className="flex w-full overflow-y-scroll overflow-x-hidden mt-2 flex-1 flex-col gap-2 items-center">
          {typeof array === "object" && array && array?.length > 0 ? (
            array.map((v, key) => (
              <div
                key={key}
                className="w-full relative justify-between flex px-4 dark:from-c4/50 dark:to-c4/40 from-c5 to-c3 bg-gradient-to-r shadow shadow-white/5"
              >
                <span className="fx gap-1 py-5 text-base ">
                  {condition(
                    v.info.toLowerCase(),
                    ["deposit", "*"],
                    [
                      <BiTransferAlt key={1} className="text-lg text-c2" />,
                      <BiFootball key={12} className="text-lg text-c2" />,
                    ]
                  )}
                  {v.info}
                </span>
                <span
                  className={`h-full flex items-end text-xl ${
                    v.amount > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {v.amount > 0 ? "+" : "-"}
                  {format(Math.abs(v.amount))}
                </span>
              </div>
            ))
          ) : (
            <span className="text-sm mt-[20vh] fx ">
              You have no transactions{" "}
            </span>
          )}
        </div>
      </Retry>
    </PayTemplate>
  );
}

export default Transactions;
