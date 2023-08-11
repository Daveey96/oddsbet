import React, { useState, useEffect } from "react";
import { alertService, overlayService } from "@/services";
import { FaArrowLeft } from "react-icons/fa";
import { DotLoader } from "../services/Loaders";
import { userController } from "@/controllers";
import { Page } from "../Animated";
import Input from "./Input";
import Token from "./Token";

export default function ForgotPassword({ goBack, active, mail, change }) {
  const [activePage, setActivePage] = useState(active);

  const [email, setEmail] = useState(mail || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [disabled, setDisabled] = useState(true);
  const [buttonText, setbuttonText] = useState(
    active === 2 ? "Submit" : "verify"
  );

  const changeMail = async () => {
    let data = await userController.changeMail();

    if (data) {
      setActivePage(0);
      setbuttonText("verify");
      setDisabled(true);
      return true;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    activePage !== 1 && e.preventDefault();
    overlayService.lay();

    if (activePage === 0) {
      setDisabled(true);
      setbuttonText("verifying");

      const data = await userController.confirmEmail({ email });

      if (data) {
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
        setbuttonText("Submit");
        setDisabled(true);
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
        change(data.password);
      } else {
        setbuttonText("Submit");
        setDisabled(false);
      }
    }
    overlayService.clear();
  };

  useEffect(() => {
    if (activePage === 2) {
      password && password.length > 6 && password === confirmPassword
        ? setDisabled(false)
        : setDisabled(true);
    }
    if (activePage === 0)
      email.match("@gmail.com") ? setDisabled(false) : setDisabled(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password, confirmPassword]);

  return (
    <>
      <header
        onClick={goBack}
        className="text-c2 active:scale-90 duration-150 px-[3vw] relative flex mb-4 justify-start w-full items-center gap-2 text-base"
      >
        <FaArrowLeft className="text-[10px] mt-px" />
        Forgot Password
      </header>
      <div className="w-full flex-1 overflow-y-scroll overflow-x-hidden">
        <Page
          variants={[0, 1]}
          state={activePage === 2 ? 0 : activePage}
          className={["", "", ""]}
        >
          <form
            onSubmit={handleSubmit}
            className="flex w-full px-[4vw] flex-col gap-1 items-start"
          >
            {activePage === 2 ? (
              <>
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
              </>
            ) : (
              <Input value={email} setValue={(v) => setEmail(v)} />
            )}
            <button
              disabled={disabled}
              className="bg-green-500 text-white w-full duration-100 disabled:opacity-70 dark:disabled:opacity-50 fx h-12"
            >
              {buttonText} {buttonText.slice(-3) === "ing" && <DotLoader />}
            </button>
          </form>
          <Token
            handleSubmit={handleSubmit}
            changeMail={changeMail}
            email={email}
          />
        </Page>
      </div>
    </>
  );
}
