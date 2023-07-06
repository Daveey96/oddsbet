import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import Retry from "./services/Retry";
import { AnimatePresence, motion } from "framer-motion";
import { alertService, userService } from "@/services";
import { Context } from "./layout";
import { condition } from "@/helpers";
import { FaChevronLeft } from "react-icons/fa";
import { CircularLoader, DotLoader } from "./services/Loaders";
import { BiEnvelope, BiLockOpenAlt, BiXCircle } from "react-icons/bi";
import { BsEye, BsEyeSlash } from "react-icons/bs";

export default function Auth() {
  const { setUser } = useContext(Context);
  const { backdrop, setBackdrop } = useContext(Context);

  const [currentStage, setCurrentStage] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [emailD, setEmailD] = useState(false);
  const [buttonText, setbuttonText] = useState("verify");

  const handleSubmit = async (e) => {
    currentStage !== 1 && e.preventDefault();

    if (currentStage === 0) {
      setEmailD(true);
      setDisabled(true);
      setbuttonText("verifying");

      const data = await userService.checkEmail({ email });

      if (data) {
        setbuttonText("Submit");
        setDisabled(true);
        if (data.userRegistered) setCurrentStage(3);
        else {
          alertService.success(data.message);
          setCurrentStage(1);
        }
      } else {
        setEmailD(false);
        setDisabled(false);
        setbuttonText("verify");
      }
    } else if (currentStage === 1) {
      const data = await userService.verifyEmail({ email, token: e });

      if (data) {
        alertService.success(data.message);
        setTimeout(() => {
          setCurrentStage(2);
        }, 500);
        return true;
      }
      return false;
    } else if (currentStage > 1) {
      setbuttonText("Submitting");
      setDisabled(true);

      const data =
        currentStage === 2
          ? await userService.signup({ email, password })
          : await userService.signin({ email, password });

      if (data) {
        alertService.success(data.message);
        setUser(data.user);
        setBackdrop(false);
      } else {
        setbuttonText("Submit");
        setDisabled(false);
      }
    }
  };

  const getCurrentStage = async () => {
    setCurrentStage("loading");
    let data = await userService.getStage();

    if (data) {
      setCurrentStage(data.stage);
      data.email && setEmail(data.email);
    } else {
      setCurrentStage("error");
    }
  };

  const changeMail = async () => {
    let data = await userService.changeMail();

    if (data) {
      setCurrentStage(0);
      setbuttonText("verify");
      setEmailD(false);
      setDisabled(false);
      return true;
    }
    return false;
  };

  useEffect(() => {
    setTimeout(() => {
      backdrop && getCurrentStage();
    }, 1000);
  }, [backdrop]);

  const validate = (v, type) => {
    type ? setEmail(v) : setPassword(v);

    if (currentStage === 0 && type)
      v.match("@gmail.com") ? setDisabled(false) : setDisabled(true);

    if (currentStage > 1 && !type)
      v.length > 6 ? setDisabled(false) : setDisabled(true);
  };

  return (
    <Retry
      state={currentStage}
      loading={
        <span className="mt-12 fx gap-3">
          <CircularLoader size={18} /> fetching forms
        </span>
      }
      error={
        <span className="fx flex-col mt-2 gap-3">
          <BiXCircle className="text-4xl opacity-25" />
          <span>Something went wrong</span>
          <button
            className="relative px-4 py-1.5 aft after:h-0.5 after:top-0 after:inset-x-0 after:bg-gradient-to-r after:from-c1 after:to-c2 bef before:h-px before:bottom-0 before:inset-x-0 before:bg-gradient-to-r before:from-c1 before:to-c2  border-l-2 border-r-2 border-r-c2 fx border-l-c1 flex text-c2"
            onClick={getCurrentStage}
          >
            Retry
          </button>
        </span>
      }
    >
      <AnimatePresence mode="popLayout">
        {currentStage !== 1 ? (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            key={239283736}
            className="flex absolute top-0 w-full px-4 flex-col gap-1 mx- items-start"
          >
            <Input
              value={email}
              disabled={emailD}
              setValue={(v) => validate(v, true)}
              setD={(v) => setDisabled(v)}
              setED={(v) => setEmailD(v)}
              currentStage={currentStage}
              changeMail={changeMail}
            />
            {currentStage > 1 && (
              <Input value={password} setValue={validate} v />
            )}
            {currentStage === 3 && (
              <button
                onClick={(e) => e.preventDefault()}
                className="bg-c2/5 -mt-3 text-sm text-c2 px-3 rounded-r-xl rounded-bl-xl rounded-tl-sm pt-1 pb-1 mb-3"
              >
                forgot password?
              </button>
            )}
            <button
              disabled={disabled}
              className="bg-green-500 w-full duration-100 disabled:opacity-50 fx h-14"
            >
              {buttonText} {buttonText.slice(-3) === "ing" && <DotLoader />}
            </button>
          </motion.form>
        ) : (
          <Token
            key={parseInt(Math.random() * 10000000)}
            handleSubmit={handleSubmit}
            email={email}
            changeMail={changeMail}
          />
        )}
      </AnimatePresence>
    </Retry>
  );
}

function Token({ email, handleSubmit, changeMail }) {
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
      ["border-red-600", "border-red-600/75"],
      ["border-gray-600", "border-gray-600/20"],
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
    const data = await userService.resendCode();

    if (data) {
      alertService.success(data.message);
      setbuttonText("60s");
    } else {
      setbuttonText("resend code");
    }
  };

  useEffect(() => {
    input.current.focus();
  }, [email]);

  useEffect(() => {
    const submitToken = async () => {
      setLoading("loading");
      const response = await handleSubmit(token);
      if (response) return setLoading("success");
      setLoading("error");
      setToken("");
      setTimeout(() => {
        input.current.focus();
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
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: "0%" }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3 }}
      className="fx absolute top-0 flex-col px-11 gap-3 w-full "
    >
      <h2
        className={`${
          loading === "loading" && "opacity-20"
        } flex whitespace-nowrap items-center`}
      >
        Enter otp sent to
        <span className="text-c2 ml-1 rounded-lg fx bg-c2/5 py-1 flex-1">
          <span className="w-[90%] whitespace-nowrap text-ellipsis overflow-hidden">
            {email}
          </span>
        </span>
      </h2>
      <div
        className={`${loading === "loading" && "opacity-30"} w-full flex gap-4`}
      >
        {tokenArray.map((i, key) => (
          <span
            key={key}
            className={`flex-1 text-2xl fx h-20 duration-150 border-4  rounded-md ${
              isNaN(parseInt(i)) ? color[1] : color[0]
            }`}
            onClick={() => input.current.focus()}
          >
            {i === "|" ? <span className="animate-pulse">{i}</span> : i}
          </span>
        ))}
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
      {loading === "loading" && (
        <div className="absolute fx bg-green-950 gap-2 rounded-lg pt-2 pb-2.5 px-5 mb-8">
          <CircularLoader
            size={15}
            depth={3}
            className={"border-t-green-500"}
          />
          verifying
        </div>
      )}
      <input
        type="tel"
        ref={input}
        value={token}
        disabled={loading === "loading" || loading === "success" ? true : false}
        className="opacity-0"
        maxLength={4}
        onChange={({ target }) =>
          !isNaN(target.value) && setToken(target.value)
        }
      />
    </motion.div>
  );
}

function Input({
  v,
  currentStage,
  disabled = false,
  value,
  setValue,
  setD,
  setED,
  changeMail,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const emailInput = useRef(null);
  let email = "";

  const change = () => {
    email = value;
    setED(false);
    setD(true);

    setTimeout(() => {
      emailInput.current.focus();
      emailInput.current.addEventListener("blur", async () => {
        if (emailInput.current.value.match("@gmail.com")) {
          if (email === emailInput.current.value) {
            setED(true);
            setD(false);
          } else {
            let success = await changeMail();
            if (!success) {
              setED(true);
              setD(false);
            }
          }
        } else {
          setValue(email);
          setED(true);
        }
      });
    }, 500);
  };

  return (
    <div
      className={`h-14 w-full relative aft after:h-0.5 after:top-0 after:inset-x-0 after:bg-gradient-to-r after:from-c1 after:to-c2 bef before:h-0.5 before:bottom-0 before:inset-x-0 before:bg-gradient-to-r before:from-c1 before:to-c2  border-l-2 border-r-2 items-center fx ${
        v ? "mt-8 mb-4" : "mt-7 mb-3"
      } ${
        disabled
          ? "after:opacity-50 before:opacity-50 border-r-c2/50 border-l-c1/50"
          : "border-r-c2 border-l-c1"
      }`}
    >
      <label
        className={`ml-1 absolute bottom-[108%] left-0 ${
          disabled && "opacity-50"
        }`}
      >
        Your {v ? "Password" : "Email"}
      </label>
      <label
        className={`text-c1 text-xl absolute left-0 px-5 fx  ${
          disabled && "opacity-50"
        }`}
      >
        {v ? <BiLockOpenAlt /> : <BiEnvelope />}
      </label>
      <input
        type={v ? (isVisible ? "text" : "password") : "email"}
        disabled={disabled}
        className={`h-full w-full text-md pl-14 pr-2 ${
          disabled && "opacity-50"
        }`}
        ref={v ? null : emailInput}
        value={value}
        onChange={({ target }) => setValue(target.value)}
      />
      {!v && disabled && (
        <button
          onClick={change}
          className="py-1.5 absolute right-2 active:scale-90 duration-150 px-3 mr-2 shadow bg-c2/5 text-c2 rounded-l-xl rounded-tr-xl rounded-br-sm"
        >
          change
        </button>
      )}
      {!v && !disabled && currentStage > 0 && (
        <span className="py-1.5 absolute right-2 active:scale-90 duration-150 px-3 mr-2 shadow bg-c2/5 text-c2 rounded-l-xl rounded-tr-xl rounded-br-sm">
          done
        </span>
      )}
      {v && value.length > 0 && (
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsVisible(!isVisible);
          }}
          className={`text-xl absolute right-0 inset-y-0 w-14 pl-1 ${
            disabled && "opacity-50"
          }`}
        >
          {value.length > 0 ? isVisible ? <BsEye /> : <BsEyeSlash /> : ""}
        </button>
      )}
    </div>
  );
}

export const ForgotPassword = () => {
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "0%" }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.3 }}
    >
      <header>Password reset</header>
    </motion.div>
  );
};
