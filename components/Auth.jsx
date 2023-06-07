import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import * as Bi from "react-icons/bi";
import * as Bs from "react-icons/bs";
import { AnimatePresence, motion } from "framer-motion";
import { alertService } from "@/services";
import Animated from "./Animated";
import { Context } from "./layout";
import { userService } from "@/services/user.service";
import condition from "@/helpers/condition";
import Retry from "./services/Retry";
import { CircularLoader, DotLoader } from "./services/Loaders";

export const Naira = () => (
  <svg
    fill="currentColor"
    width="15px"
    height="15px"
    viewBox="0 0 496.262 496.262"
  >
    <path
      d="M477.832,274.28h-67.743v-65.106h67.743c10.179,0,18.43-8.243,18.43-18.424c0-10.182-8.251-18.43-18.43-18.43h-67.743
		V81.982c0-13.187-2.606-22.866-7.743-28.762c-4.882-5.609-11.301-8.219-20.19-8.219c-8.482,0-14.659,2.592-19.447,8.166
		c-5.077,5.902-7.654,15.599-7.654,28.821v90.343H227.627l-54.181-81.988c-4.637-7.317-8.997-14.171-13.231-20.75
		c-3.812-5.925-7.53-10.749-11.042-14.351c-3.109-3.189-6.652-5.657-10.796-7.554c-3.91-1.785-8.881-2.681-14.762-2.681
		c-7.501,0-14.31,2.055-20.83,6.277c-6.452,4.176-10.912,9.339-13.636,15.785c-2.391,6.126-3.656,15.513-3.656,27.63v77.626h-67.07
		C8.246,172.326,0,180.574,0,190.755c0,10.181,8.246,18.424,18.424,18.424h67.07v65.113h-67.07C8.246,274.292,0,282.538,0,292.722
		C0,302.9,8.246,311.14,18.424,311.14h67.07v103.143c0,12.797,2.689,22.378,8.015,28.466c5.065,5.805,11.487,8.5,20.208,8.5
		c8.414,0,14.786-2.707,20.07-8.523c5.411-5.958,8.148-15.533,8.148-28.442V311.14h115.308l62.399,95.683
		c4.339,6.325,8.819,12.709,13.287,18.969c4.031,5.621,8.429,10.574,13.069,14.711c4.179,3.742,8.659,6.484,13.316,8.157
		c4.794,1.726,10.397,2.601,16.615,2.601c16.875,0,34.158-5.166,34.158-43.479V311.14h67.743c10.179,0,18.43-8.252,18.43-18.43
		C496.262,282.532,488.011,274.28,477.832,274.28z M355.054,209.173v65.106h-60.041l-43.021-65.106H355.054z M141.936,134.364
		l24.76,37.956h-24.76V134.364z M141.936,274.28v-65.106h48.802l42.466,65.106H141.936z M355.054,365.153l-35.683-54.013h35.683
		V365.153z"
    />
  </svg>
);

export default function Auth() {
  const { user, setUser } = useContext(Context);
  const [backdrop, setBackdrop] = useState(false);

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

  const variants = {
    init: { backdropFilter: "blur(0px)" },
    show: {
      backdropFilter: "blur(30px)",
      transition: { when: "beforeChildren" },
    },
    exit: { backdropFilter: "blur(0px)" },
    initChild: { opacity: 0 },
    showChild: { opacity: 1 },
    exitChild: { opacity: 0 },
  };

  return (
    <>
      {user && (
        <button
          className={
            "fx gap-1 pb-3 pt-2 px-7 text-green-600 rounded-b-2xl z-30 bg-black h-full"
          }
        >
          <Naira /> <span>{user.balance}</span>
        </button>
      )}
      {user === undefined && (
        <button
          className={
            "fx gap-1 pb-3 pt-2 px-7 rounded-b-2xl z-30 bg-black h-full"
          }
          onClick={() => setBackdrop(!backdrop)}
        >
          {backdrop ? (
            <>
              <Bi.BiArrowToLeft className="mt-0.5" /> back
            </>
          ) : (
            "sign up"
          )}
        </button>
      )}
      <Animated
        variants={variants}
        transition={{ duration: 0.3, ease: "linear" }}
        className="fixed flex flex-col items-center inset-0"
        state={backdrop}
      >
        <h3 className="opacity-20 mt-[60px] text-sm border-t-[0.5px] border-white/50 px-10 pt-2 mb-4">
          Signup / Signin to Oddsbet
        </h3>
        <motion.div
          variants={variants}
          initial={"initChild"}
          animate={"showChild"}
          exit={"exitChild"}
          className="relative mt-3 w-full fx"
        >
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
                  className="flex absolute top-0 w-full px-7 flex-col gap-1 mx- items-center"
                >
                  <Input
                    value={email}
                    disabled={emailD}
                    setValue={(v) => setEmail(v)}
                  />
                  {currentStage > 1 && (
                    <Input
                      value={password}
                      setValue={(v) => setPassword(v)}
                      v
                    />
                  )}
                  <button
                    disabled={disabled}
                    className="bg-green-500 w-full duration-100 disabled:opacity-50 fx h-14"
                  >
                    {buttonText}{" "}
                    {buttonText.slice(-3) === "ing" && <DotLoader />}
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
        </motion.div>
      </Animated>
    </>
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
          className="text-xl w-14 pl-1"
        >
          {value.length > 0 ? isVisible ? <Bs.BsEye /> : <Bs.BsEyeSlash /> : ""}
        </button>
      )}
    </div>
  );
}
