import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import * as Bi from "react-icons/bi";
import * as Bs from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import { alertService, userService } from "@/services";
import Animated, { BlurredModal } from "./Animated";
import { Context } from "./layout";
import { condition } from "@/helpers";
import Retry from "./services/Retry";
import { CircularLoader, DotLoader } from "./services/Loaders";

export default function Auth() {
  const { setUser } = useContext(Context);
  const { backdrop, setBackdrop } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [currentStage, setCurrentStage] = useState(null);
  const [loading, setLoading] = useState(null);

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
      // const data = { message: "Mail sent!" };

      if (data) {
        if (data.userRegistered) {
          setCurrentStage(3);
          setbuttonText("Submit");
        } else {
          alertService.success(data.message);
          setTimeout(() => {
            setCurrentStage(1);
          }, 500);
        }
      } else {
        setEmailD(false);
        setDisabled(false);
        setbuttonText("verify");
      }
    } else if (currentStage === 1) {
      setLoading("loading");

      const data = await userService.verifyEmail({ email, token: e });
      // const data = { message: "verified!" };

      if (data) {
        alertService.success(data.message);
        setLoading("success");
        setbuttonText("Submit");
        setTimeout(() => {
          setCurrentStage(2);
        }, 500);
      } else {
        setLoading("error");
      }
    } else if (currentStage > 1) {
      setbuttonText("Submitting");
      setDisabled(true);

      const data =
        currentStage === 2
          ? await userService.signup({ email, password })
          : await userService.signin({ email, password });
      // const data = { message: `Welcome ${email}`, user: {balance: 0, email} };

      if (data) {
        alertService.success(data.message);
        setTimeout(() => {
          setUser(data.user);
          setBackdrop(false);
          setbuttonText("Submit");
          setDisabled(false);
        }, 500);
      } else {
        setbuttonText("Submit");
        setDisabled(false);
      }
    }
  };

  const getCurrentStage = async () => {
    setCurrentStage("loading");
    let data = await userService.getStage();
    // let data = false;

    if (data) {
      setCurrentStage(data.stage);
      if (data.email && data.email !== email) setEmail(data.email);
    } else {
      setCurrentStage("error");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      currentStage === null && getCurrentStage();
    }, 2000);

    if (currentStage > 1) {
      currentStage === 2 && setEmailD(true);
      setbuttonText("Submit");
    }
  }, [currentStage]);

  useEffect(() => {
    if (currentStage === 0) {
      email.match("@gmail.com") ? setDisabled(false) : setDisabled(true);
    }
    if (currentStage > 1) {
      password.length > 6 ? setDisabled(false) : setDisabled(true);
    }
  }, [email, password, currentStage]);

  return (
    <BlurredModal
      state={backdrop}
      type={"allChidren"}
      className="flex flex-col z-[35] items-center"
      iClass={[
        "text-white/20 mt-[60px] text-sm border-t-[0.5px] border-white/50 px-10 pt-2 mb-4",
        "relative max-w-[480px] w-full mt-3 fx",
      ]}
    >
      <>Signup / Signin to Oddsbet</>
      <>
        <Retry
          state={currentStage}
          loading={
            <span className="mt-12 fx gap-3">
              <CircularLoader size={18} /> fetching forms
            </span>
          }
          error={
            <span className="fx flex-col mt-2 gap-3">
              <Bi.BiWifiOff className="text-6xl opacity-25" />
              Network Error
              <button
                className="relative px-5 py-2 aft after:h-0.5 after:top-0 after:inset-x-0 after:bg-gradient-to-r after:from-c1 after:to-c2 bef before:h-0.5 before:bottom-0 before:inset-x-0 before:bg-gradient-to-r before:from-c1 before:to-c2  border-l-2 border-r-2 border-r-c2 fx border-l-c1 flex text-c2"
                onClick={getCurrentStage}
              >
                try again
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
                className="flex absolute top-0 w-full px-4 flex-col gap-1 mx- items-center"
              >
                <Input
                  value={email}
                  disabled={emailD}
                  setValue={(v) => setEmail(v)}
                />
                {currentStage > 1 && (
                  <Input value={password} setValue={(v) => setPassword(v)} v />
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
                key={827382837826}
                email={email}
                loading={loading}
                handleSubmit={handleSubmit}
              />
            )}
          </AnimatePresence>
        </Retry>
      </>
    </BlurredModal>
  );
}

function Token({ email, handleSubmit, loading }) {
  const [token, setToken] = useState("");
  const tokenArray = useMemo(convertToken, [token]);
  let input = useRef(null);
  let color = condition(
    loading,
    ["success", "error", "*"],
    [
      ["border-green-600", "border-green-600"],
      ["border-red-600", "border-red-600/75"],
      ["border-gray-600", "border-gray-600/20"],
    ]
  );
  const [buttonText, setbuttonText] = useState("resend code");

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
    // const data = await userService.resendCode();
    const data = { message: "Mail sent!" };

    if (data) {
      setTimeout(() => {
        alertService.success(data.message);
        setbuttonText("60s");
      }, 2000);
    }
  };

  useEffect(() => {
    input.current.focus();
  }, []);

  useEffect(() => {
    if (token.length === 4) handleSubmit(token);
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

  useEffect(() => {
    if (loading === "error") {
      setToken("");
      setTimeout(() => {
        input.current.focus();
      }, 2000);
    }
  }, [loading]);

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
          loading === "loading" ? "opacity-20" : "opacity-80"
        }  whitespace-nowrap text-center overflow-hidden text-ellipsis w-[90%]`}
      >
        Enter otp sent to {email}
      </h2>
      <div
        className={`${loading === "loading" && "opacity-30"} w-full flex gap-4`}
      >
        {tokenArray.map((i, key) => (
          <span
            key={key}
            className={`flex-1 text-2xl fx h-20 duration-150 border-4  rounded-md ${
              parseInt(i) ? color[0] : color[1]
            }`}
            onClick={() => input.current.focus()}
          >
            {i === "|" ? (
              <motion.span
                animate={{
                  opacity: [0.3, 0.7],
                  transition: {
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: 0.7,
                  },
                }}
              >
                {i}
              </motion.span>
            ) : (
              i
            )}
          </span>
        ))}
      </div>
      <div
        className={`${
          loading === "loading" && "opacity-30"
        } px-5 w-full flex justify-between`}
      >
        <button className="opacity-30">change email</button>
        <button
          className="text-c2"
          onClick={buttonText === "resend code" && resend}
        >
          {buttonText}
        </button>
      </div>
      {loading === "loading" && (
        <div className="absolute fx gap-2 bg-black rounded-lg pt-2 pb-2.5 px-5 mb-8 text-green-500">
          <CircularLoader size={18} />
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
        onChange={({ target }) => setToken(target.value)}
      />
    </motion.div>
  );
}

function Input({ v, disabled = false, value, setValue }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={`h-14 w-full relative aft after:h-0.5 after:top-0 after:inset-x-0 after:bg-gradient-to-r after:from-c1 after:to-c2 bef before:h-0.5 before:bottom-0 before:inset-x-0 before:bg-gradient-to-r before:from-c1 before:to-c2  border-l-2 border-r-2 border-r-c2 fx border-l-c1 flex ${
        v ? "mt-8 mb-4" : "mt-7 mb-3"
      } ${disabled && "opacity-50"}`}
    >
      <label className="ml-1 absolute bottom-[108%] left-0">
        Your {v ? "Password" : "Email"}
      </label>
      <label className="text-c1 text-xl absolute left-0 px-5 fx ">
        {v ? <Bi.BiLockOpenAlt /> : <Bi.BiEnvelope />}
      </label>
      <input
        type={v ? (isVisible ? "text" : "password") : "email"}
        disabled={disabled}
        className="h-full w-full text-md pl-14 pr-2"
        value={value}
        onChange={({ target }) => setValue(target.value)}
      />
      {v && (
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsVisible(!isVisible);
          }}
          className="text-xl absolute right-0 inset-y-0 w-14 pl-1"
        >
          {value.length > 0 ? isVisible ? <Bs.BsEye /> : <Bs.BsEyeSlash /> : ""}
        </button>
      )}
    </div>
  );
}
