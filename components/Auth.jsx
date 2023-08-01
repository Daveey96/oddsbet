import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import Retry from "./services/Retry";
import { alertService, overlayService } from "@/services";
import { Context } from "./layout";
import { condition } from "@/helpers";
import { FaArrowLeft, FaChevronLeft } from "react-icons/fa";
import { CircularLoader, DotLoader } from "./services/Loaders";
import { BiEnvelope, BiLockOpenAlt, BiXCircle } from "react-icons/bi";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { userController } from "@/controllers";
import { Page } from "./Animated";

export default function Auth() {
  const { setUser } = useContext(Context);
  const { backdrop, setBackdrop } = useContext(Context);
  const [currentStage, setCurrentStage] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [disabled, setDisabled] = useState(true);
  const [emailD, setEmailD] = useState(false);

  const [buttonText, setbuttonText] = useState("verify");
  const [forgotPass, setForgotPass] = useState(null);
  const [activePage, setActivePage] = useState(null);

  const handleSubmit = async (e) => {
    currentStage !== 1 && e.preventDefault();
    overlayService.lay();

    if (currentStage === 0) {
      setEmailD(true);
      setDisabled(true);
      setbuttonText("verifying");

      const data = await userController.checkEmail({ email });

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
      const data = await userController.verifyEmail({ email, token: e });

      overlayService.clear();
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
          ? await userController.signup({ email, password })
          : await userController.signin({ email, password });

      if (data) {
        alertService.success(data.message);
        setUser(data.user);
        setBackdrop(false);
      } else {
        setbuttonText("Submit");
        setDisabled(false);
      }
    }
    overlayService.clear();
  };

  const getCurrentStage = async () => {
    setCurrentStage("loading");
    let data = await userController.getStage();

    if (data.cookie) {
      let { mail, balance, id } = data.user;
      setUser({ email: mail, balance, id });
      setBackdrop(false);
      return;
    }

    if (data.forgotPass) {
      setEmail(data.email);
      setbuttonText(data.forgotPass === 2 ? "Submit" : "verify");
      setCurrentStage(3);
      setForgotPass(data.forgotPass);
      return;
    }

    if (data) {
      setCurrentStage(data.stage);
      data?.email && setEmail(data.email);
    } else setCurrentStage("error");
  };

  const changeMail = async () => {
    let data = await userController.changeMail();

    if (data) {
      setCurrentStage(0);
      setbuttonText("verify");
      setEmailD(false);
      setDisabled(false);
      return true;
    }
    return false;
  };

  const validate = (v, type) => {
    type ? setEmail(v) : setPassword(v);

    if (currentStage === 0 && type)
      v.match("@gmail.com") ? setDisabled(false) : setDisabled(true);

    if (currentStage > 1 && !type)
      v.length > 6 ? setDisabled(false) : setDisabled(true);
  };

  const variants = {
    0: ["-100%", "0%", "-100%"],
    1: ["100%", "0%", "100%"],
    2: ["100%", "0%", "100%"],
  };

  useEffect(() => {
    setTimeout(() => {
      backdrop && getCurrentStage();
    }, 1000);
  }, [backdrop]);

  useEffect(() => {
    if (forgotPass !== null) setActivePage(2);
    else if (currentStage === 1) setActivePage(1);
    else setActivePage(0);
  }, [currentStage, forgotPass]);

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
      <Page
        variants={variants}
        state={activePage}
        className={["", "px-10 gap-2", "px-5 overflow-hidden"]}
      >
        <form
          onSubmit={handleSubmit}
          className="flex top-0 w-full px-4 flex-col gap-1 items-start"
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
          {currentStage > 1 && <Input value={password} setValue={validate} v />}
          {currentStage === 3 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setForgotPass(0);
              }}
              className="bg-c2/5 duration-150 active:scale-90 text-sm text-c2 px-3 rounded-r-xl rounded-bl-xl rounded-tl-sm py-1 mb-3"
            >
              forgot password?
            </button>
          )}
          <button
            disabled={disabled}
            className="bg-green-500 w-full duration-100 disabled:opacity-50 fx h-12"
          >
            {buttonText} {buttonText.slice(-3) === "ing" && <DotLoader />}
          </button>
        </form>
        <Token
          handleSubmit={handleSubmit}
          email={email}
          changeMail={changeMail}
        />
        <ForgotPassword
          active={forgotPass}
          // state={activePage}
          mail={email}
          bText={buttonText}
          goBack={() => setForgotPass(null)}
        />
      </Page>
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
    const data = await userController.resendCode();

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
    <>
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
      <div className="relative w-full fx gap-4">
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
          <div className="absolute fx z-10 bg-green-950/50 gap-2 pt-2 pb-2.5 px-5">
            <CircularLoader
              size={15}
              depth={3}
              className={"border-t-green-500"}
            />
            verifying
          </div>
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
        className="opacity-0"
        maxLength={4}
        onChange={({ target }) =>
          !isNaN(target.value) && setToken(target.value)
        }
      />
    </>
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
  text,
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
        {text ? text : v ? "Your Password" : "Your Email"}
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
          className="py-1.5 z-10 aft after:inset-0 after:backdrop-blur-3xl after:rounded-inh absolute right-2 active:scale-90 after:-z-[2] duration-150 px-3 mr-2 shadow bg-c2/5 text-c2 rounded-l-xl rounded-tr-xl rounded-br-sm"
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

const ForgotPassword = ({ goBack, active, bText, mail }) => {
  const [activePage, setActivePage] = useState(null);

  const [email, setEmail] = useState(mail || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [disabled, setDisabled] = useState(true);
  const [buttonText, setbuttonText] = useState(bText);

  const changeMail = async () => {
    let data = await userController.changeMail();

    if (data) {
      setCurrentStage(0);
      setbuttonText("verify");
      setEmailD(false);
      setDisabled(false);
      return true;
    }
    return false;
  };

  const emailValidate = (v) => {
    setEmail(v);

    v.match("@gmail.com") ? setDisabled(false) : setDisabled(true);
  };

  const handleSubmit = async (e) => {
    activePage !== 1 && e.preventDefault();
    overlayService.lay();

    if (activePage === 0) {
      setDisabled(true);
      setbuttonText("verifying");

      const data = await userController.confirmEmail({ email });

      if (data) {
        setbuttonText("Submit");
        setDisabled(true);
        alertService.success(data.message);
        setActivePage(1);
      } else {
        setDisabled(false);
        setbuttonText("verify");
      }
    } else if (activePage === 1) {
      const data = await userController.verifyEmail({
        email,
        token: e,
        type: true,
      });

      overlayService.clear();
      if (data) {
        alertService.success(data.message);
        setTimeout(() => {
          setActivePage(2);
        }, 500);
        return true;
      }
      return false;
    } else if (activePage === 2) {
      setbuttonText("Submitting");
      setDisabled(true);

      const data = await userController.changePass({
        password,
        confirmPassword,
      });

      if (data) {
        alertService.success(data.message);
        setBackdrop(false);
      } else {
        setbuttonText("Submit");
        setDisabled(false);
      }
    }
    overlayService.clear();
  };

  const variants = {
    0: ["-100%", "0%", "-100%"],
    1: ["100%", "0%", "100%"],
    2: ["-100%", "0%", "-100%"],
  };

  // useEffect(() => {
  //   if (active) {
  //     setActivePage(active);
  //     setEmail(mail);
  //     setbuttonText(bText);
  //   } else setActivePage(0);
  // }, [state]);

  useEffect(() => {
    password && password.length > 6 && password === confirmPassword
      ? setDisabled(false)
      : setDisabled(true);
  }, [password, confirmPassword]);

  return (
    <>
      <header
        onClick={goBack}
        className="text-c2 relative flex mb-4 justify-start w-full items-center gap-2 text-base"
      >
        <FaArrowLeft className="text-[10px] mt-px" />
        Forgot Password
      </header>
      <Page
        variants={variants}
        state={activePage}
        className={["bg-slate-500", "px-10 gap-2 bg-slate-500", "bg-slate-500"]}
      >
        <form
          onSubmit={handleSubmit}
          className="flex w-full px-4 flex-col gap-1 items-start"
        >
          <Input value={email} setValue={emailValidate} />
          <button
            disabled={disabled}
            className="bg-green-500 w-full duration-100 disabled:opacity-50 fx h-12"
          >
            {buttonText} {buttonText.slice(-3) === "ing" && <DotLoader />}
          </button>
        </form>
        <Token
          handleSubmit={handleSubmit}
          changeMail={changeMail}
          email={email}
        />
        <form
          onSubmit={handleSubmit}
          className="flex w-full px-4 flex-col gap-1 items-start"
        >
          <Input
            value={password}
            setValue={(v) => setPassword(v)}
            text="Enter New Password"
            v
          />
          <Input
            value={confirmPassword}
            text="Confirm Password"
            setValue={(v) => setConfirmPassword(v)}
            v
          />
          <button
            disabled={disabled}
            className="bg-green-500 w-full duration-100 disabled:opacity-50 fx h-12"
          >
            {buttonText} {buttonText.slice(-3) === "ing" && <DotLoader />}
          </button>
        </form>
      </Page>
    </>
  );
};
