import React, { useState, useRef } from "react";
import { BiEnvelope, BiLockOpenAlt } from "react-icons/bi";
import { BsEye, BsEyeSlash } from "react-icons/bs";

export default function Input({
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
