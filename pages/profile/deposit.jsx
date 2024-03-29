import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { PaystackButton } from "react-paystack";
import { PayTemplate } from ".";
import { Context } from "@/components/layout";
import { format } from "@/helpers";
import { BiInfoCircle } from "react-icons/bi";
import { appController } from "@/controllers";
import { alertService, overlayService } from "@/services";
import { useRouter } from "next/navigation";

const Deposit = () => {
  const { user, setUser } = useContext(Context);
  const { replace } = useRouter();
  const input = useRef(null);

  const [amount, setAmount] = useState("");

  const disabled = useMemo(() => {
    if (parseFloat(amount.split(",").join("")) > 99) {
      return false;
    }
    return true;
  }, [amount]);

  const onSuccess = async () => {
    const data = await appController.deposit({ amount });

    if (data) {
      setUser({ ...user, balance: data.balance });
      alertService.success("Deposit Successful");
      replace("/");
    }
  };

  const componentProps = {
    email: user.email,
    amount: parseFloat(amount) * 100,
    publicKey: "pk_live_46fd297cb732030ffa67369e72818d559136c589",
    onSuccess: () => {
      onSuccess();
    },
  };

  useEffect(() => {
    input.current.focus();
  }, []);

  if (!user) replace("/profile");

  return (
    <PayTemplate v={"Deposit"}>
      <div className="flex text-base gap-1 flex-col mt-7 mx-auto w-[90%] items-center">
        <input
          ref={input}
          pattern="[0-9]"
          className="py-3.5 mt-6 text-lg duration-150 placeholder:text-black/50 dark:placeholder:text-white/40 w-full border-b-4 focus:border-c2 border-c3 dark:border-c4 text-center"
          value={format(amount.split(",").join(""))}
          placeholder="Enter Amount"
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="w-full relative">
          <PaystackButton
            className="w-full active:opacity-40 duration-200 text-white rounded-b-lg rounded-t-sm fx relative dark:bg-c4 bg-c4/25 overflow-hidden"
            {...componentProps}
          >
            <span
              className={`w-full ${
                disabled ? "-translate-x-[110%]" : "-translate-x-0"
              } rounded-inh text-white/0 relative py-3 fx duration-150 from-c1 to-c2 bg-gradient-to-r `}
            >
              Continue
            </span>
            <span className="z-10 absolute">Continue</span>
          </PaystackButton>
          {disabled && <span className="absolute z-10 inset-0"></span>}
        </div>
      </div>
    </PayTemplate>
  );
};

export default Deposit;
