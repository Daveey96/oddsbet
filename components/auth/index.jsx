import React, { useState, useEffect, useContext, useMemo } from "react";
import Retry from "../services/Retry";
import Input from "./Input";
import ForgotPassword from "./ForgotPass";
import Token from "./Token";
import { BiXCircle } from "react-icons/bi";
import { CircularLoader, DotLoader } from "../services/Loaders";
import { Page } from "../global/Animated";
import { userController } from "@/controllers";
import { alertService, overlayService } from "@/services";
import { Context } from "../layout";
import Error from "../services/Error";
import Image from "next/image";

export default function Auth() {
  const { setUser } = useContext(Context);
  const { backdrop, setBackdrop } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailD, setEmailD] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const [forgotPass, setForgotPass] = useState(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [buttonText, setbuttonText] = useState("verify");

  const activePage = useMemo(() => {
    if (forgotPass !== null) return 2;
    else if (currentStage === 1) return 1;
    else if (currentStage === null && forgotPass === null) return null;
    return 0;
  }, [forgotPass, currentStage]);

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

  useEffect(() => {
    if (currentStage === 0) {
      email.match("@gmail.com") ? setDisabled(false) : setDisabled(true);
      setbuttonText(currentStage > 1 ? "Submit" : "verify");
    }

    if (currentStage > 1) {
      password.length > 6 ? setDisabled(false) : setDisabled(true);
      setbuttonText(currentStage > 1 ? "Submit" : "verify");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     backdrop && getCurrentStage();
  //   }, 1000);
  // }, [backdrop]);

  return (
    <Retry
      state={currentStage}
      loading={
        <span className="mt-12 fx gap-3">
          <CircularLoader size={18} depth={2} /> fetching forms
        </span>
      }
      error={<Error refresh={getCurrentStage} className={"mt-2"} />}
    >
      <Page variants={[0, 1, 1]} state={activePage}>
        <form
          onSubmit={handleSubmit}
          className="flex w-full px-4 flex-col gap-1 items-start overflow-hidden"
        >
          <Input
            value={email}
            disabled={emailD}
            setValue={(v) => setEmail(v)}
            setD={(v) => setDisabled(v)}
            setED={(v) => setEmailD(v)}
            currentStage={currentStage}
            changeMail={changeMail}
          />
          {currentStage > 1 && (
            <Input value={password} setValue={(v) => setPassword(v)} v />
          )}
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
            className="bg-green-500 text-white w-full duration-100 disabled:opacity-70 dark:disabled:opacity-50 fx h-12"
          >
            {buttonText} {buttonText.slice(-3) === "ing" && <DotLoader />}
          </button>
          <div className="fx w-full mt-14 gap-4">
            <span className="flex-1 h-px flex bg-white opacity-10 "></span>
            <span>OR</span>
            <span className="flex-1 h-px flex bg-white opacity-10 "></span>
          </div>
          <div className="flex gap-3 w-full">
            {["Google", "Facebook"].map((v, key) => (
              <button
                key={key}
                className={`${
                  key ? "bg-blue-700/50 gap-2" : "bg-white/10 gap-1"
                } flex-1 active:scale-90 duration-200 rounded-lg py-2.5 pl-6 flex items-center`}
              >
                <Image
                  src={`/${v.toLowerCase()}.svg`}
                  width={key ? 20 : 28}
                  className="mb-0.5"
                  height={20}
                  alt=""
                />
                <span className="text-sm">{v}</span>
              </button>
            ))}
          </div>
        </form>
        <Token
          handleSubmit={handleSubmit}
          email={email}
          changeMail={changeMail}
        />
        <ForgotPassword
          active={forgotPass}
          mail={email}
          change={(pass) => {
            setForgotPass(null);
            setPassword(pass);
          }}
          bText={buttonText}
          goBack={() => setForgotPass(null)}
        />
      </Page>
    </Retry>
  );
}
