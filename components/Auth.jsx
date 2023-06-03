import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import * as Bi from "react-icons/bi";
import * as Bs from "react-icons/bs";
import { motion } from "framer-motion";
import { alertService } from "@/services";
import Animated from "./Animated";
import { Context } from "./layout";

const Naira = () => (
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [backdrop, setBackdrop] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const [inputdisabled, setInputDisabled] = useState(false);
  const [buttonText, setbuttonText] = useState("Submit");
  const [error, setError] = useState("No network connection");

  const handleSubmit = async (e) => {
    e.preventDefault();

    alertService.error("Invalid login credntials");
  };

  useEffect(() => {
    email.match("@gmail.com") && password.length > 5
      ? setDisabled(false)
      : setDisabled(true);
  }, [email, password]);

  return (
    <>
      {user ? (
        <button className="text-green-500 fx gap-1 backdrop-blur-sm px-4 py-2 bg-gray-700/10">
          <Naira /> <span>{user.balance}</span>
        </button>
      ) : (
        <button
          className="fx gap-1 z-30"
          onClick={() => setBackdrop(!backdrop)}
        >
          {backdrop ? (
            <>
              <Bi.BiArrowToLeft className="mt-0.5" /> back
            </>
          ) : (
            "sign in"
          )}
        </button>
      )}
      <Animated
        init={{ backdropFilter: "blur(0px)" }}
        show={{ backdropFilter: "blur(30px)" }}
        transition={{ duration: 0.3, ease: "linear" }}
        className="fixed inset-0"
        state={backdrop}
      >
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col gap-4 border-t-2 border-white/5 mx-5 items-center mt-[70px]"
        >
          {["email", "password"].map((type, key) => (
            <div
              key={key}
              className={`h-14 w-full relative aft after:h-0.5 after:top-0 after:inset-x-0 after:bg-gradient-to-r after:from-c1 after:to-c2 bef before:h-0.5 before:bottom-0 before:inset-x-0 before:bg-gradient-to-r before:from-c1 before:to-c2  border-l-2 border-r-2 border-r-c2 fx border-l-c1 flex mb-3 ${
                key ? "mt-7" : "mt-12"
              } ${inputdisabled && "opacity-50"}`}
            >
              <label className="ml-1 absolute bottom-[108%] left-0">
                Your {key ? "Password" : "Email"}
              </label>
              <label className="text-c1 text-xl px-5 fx ">
                {key ? <Bi.BiLockOpenAlt /> : <Bi.BiEnvelope />}
              </label>
              <input
                type={key ? (isVisible ? "text" : "password") : type}
                disabled={inputdisabled}
                className="h-full w-full text-md pr-2"
                value={key ? password : email}
                onChange={({ target }) =>
                  key ? setPassword(target.value) : setEmail(target.value)
                }
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsVisible(!isVisible);
                }}
                className="text-xl w-14 pl-1"
              >
                {key && password.length > 0 ? (
                  isVisible ? (
                    <Bs.BsEye />
                  ) : (
                    <Bs.BsEyeSlash />
                  )
                ) : (
                  ""
                )}
              </button>
            </div>
          ))}

          <button
            disabled={disabled}
            className="bg-green-500 w-full duration-100 disabled:opacity-50 fx h-14"
          >
            {buttonText}
          </button>
          <span className="mt-3 w-full text-c2 mb-1">
            <span className="text-white opacity-50">
              Already have an account?
            </span>{" "}
            Sign up
          </span>
        </motion.form>
      </Animated>
    </>
  );
}

function Token({ setPage, transition, num }) {
  const [token, setToken] = useState("");

  const handleSubmit = () => {};

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ x: "100%" }}
      animate={{ x: "0%" }}
      exit={{ x: "100%" }}
      transition={transition}
      className="flex flex-col px-5 gap-3 mt-20"
    >
      <div className="flex flex-col mt-10 gap-1">
        <div className="flex gap-2 justify-between">
          <span onClick={() => setPage("")} className="fx text-lg opacity-30">
            <Bi.BiLeftArrowAlt /> back
          </span>
          <span>
            Enter OTP sent to <span>+234 {num}</span>
          </span>
        </div>
        <div className="h-16 relative aft after:h-0.5 after:top-0 after:inset-x-0 after:bg-gradient-to-r after:from-c1 after:to-c2 bef before:h-0.5 before:bottom-0 before:inset-x-0 before:bg-gradient-to-r before:from-c1 before:to-c2  border-l-2 border-r-2 border-r-c2 fx border-l-c1 flex mb-5">
          <input
            type="text"
            id="number"
            maxLength={"6"}
            className="h-full fx justify-evenly text-center w-full text-xl "
            value={token}
            onChange={(v) => setToken(v.target.value)}
          />
        </div>
        <button
          disabled={true}
          className="bg-green-500 duration-100 disabled:opacity-50 fx h-16"
        >
          {"Get another code in 60s"}
        </button>
        <span></span>
      </div>
    </motion.form>
  );
}
