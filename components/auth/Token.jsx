import React, { useState, useEffect, useMemo, useRef } from "react";
import { alertService } from "@/services";
import { condition } from "@/helpers";
import { FaChevronLeft } from "react-icons/fa";
import { CircularLoader, DotLoader } from "../services/Loaders";
import { userController } from "@/controllers";

export default function Token({ email, handleSubmit, changeMail }) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(null);
  const [buttonText, setbuttonText] = useState("resend code");

  const tokenArray = useMemo(convertToken, [token]);
  const input = useRef(null);
  const color = condition(
    loading,
    ["success", "error", "*"],
    [
      ["border-green-600", "border-green-600"],
      ["border-red-600", "dark:border-red-600/75 border-red-500"],
      ["border-gray-600", "dark:border-gray-600/20 border-gray-600/40"],
    ]
  );

  function convertToken() {
    let tokenArr = [];
    let tokenSplit = token.split("");
    for (let i = 0; i < 4; i++) {
      let v = tokenSplit[i] ? tokenSplit[i] : "";
      tokenArr.push(!v && tokenArr.indexOf("|") === -1 ? "|" : v);
    }
    return tokenArr;
  }

  const resend = async () => {
    setbuttonText("sending");
    const data = await userController.resendCode();

    if (data) {
      alertService.success(data.message);
      setbuttonText("60s");
    } else {
      setbuttonText("resend code");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      input.current.focus();
    }, 500);
  }, [email]);

  useEffect(() => {
    const submitToken = async () => {
      setLoading("loading");
      const response = await handleSubmit(token);
      if (response) return setLoading("success");
      setLoading("error");
      setToken("");
      setTimeout(() => {
        input.current && input.current.focus();
      }, 4000);
    };

    token.length === 4 && submitToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!isNaN(parseInt(buttonText.slice(0, -1)))) {
      setTimeout(() => {
        buttonText === "1s"
          ? setbuttonText("resend code")
          : setbuttonText(`${parseInt(buttonText.slice(0, -1)) - 1}s`);
      }, 1000);
    }
  }, [buttonText]);

  return (
    <div className="flex flex-col gap-2 items-center w-full px-[8vw]">
      <h2
        className={`${
          loading === "loading" && "opacity-20"
        } flex whitespace-nowrap items-center`}
      >
        Enter otp sent to
        <span className="text-c2 ml-1 rounded-lg fx bg-c2/5 py-1 flex-1">
          <span className="w-[90%] text-center whitespace-nowrap text-ellipsis overflow-hidden">
            {email}
          </span>
        </span>
      </h2>
      <div className="relative w-full fx gap-[4vw]">
        {tokenArray.map((i, key) => (
          <span
            key={key}
            className={`flex-1 text-2xl fx h-20 duration-150 border-4  rounded-md ${
              isNaN(parseInt(i)) ? color[1] : color[0]
            } ${loading === "loading" && "opacity-30"}`}
            onClick={() => input.current.focus()}
          >
            {i === "|" ? <span className="animate-pulse">{i}</span> : i}
          </span>
        ))}
        {loading === "loading" && (
          <CircularLoader
            size={29}
            depth={3}
            className={"border-t-green-500 z-10 absolute mt-0.5"}
          />
        )}
      </div>
      <div
        className={`${
          loading === "loading" && "opacity-30"
        } w-full text-sm flex justify-center gap-2`}
      >
        <button
          onClick={changeMail}
          className="px-4 bg-slate-500/5 fx gap-1 py-1.5 active:scale-90 duration-150 rounded-t-lg rounded-b-xl"
        >
          <FaChevronLeft className="text-sm opacity-25" /> change email
        </button>
        <button
          className="text-c2 px-4 bg-c2/5 py-1.5 active:scale-90 duration-150 rounded-t-lg rounded-b-xl"
          onClick={() => (buttonText === "resend code" ? resend() : {})}
        >
          {buttonText}
          {buttonText.slice(-3) === "ing" && <DotLoader />}
        </button>
      </div>
      <input
        type="tel"
        ref={input}
        value={token}
        disabled={loading === "loading" || loading === "success" ? true : false}
        className="opacity-0 absolute"
        maxLength={4}
        onChange={({ target }) =>
          !isNaN(target.value) && setToken(target.value)
        }
      />
    </div>
  );
}
