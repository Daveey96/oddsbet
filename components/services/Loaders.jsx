import React, { useEffect, useState } from "react";

export const DotLoader = () => {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setDots(dots === 3 ? 0 : dots + 1);
    }, 300);
  }, [dots]);

  return (
    <>
      {Array(dots)
        .fill(".")
        .map((dot, key) => (
          <span key={key}>{dot}</span>
        ))}
    </>
  );
};

export const CircularLoader = ({ size = 14, className, depth = 4 }) => {
  return (
    <span
      className={
        `loader border-r-transparent inline-block rounded-[50%] ${
          !className && "border-t-c2"
        } ` + className
      }
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderWidth: `${depth}px ${depth}px 0 0`,
      }}
    ></span>
  );
};

export const CircularLoader2 = () => (
  <span className="loader2 inline-block relative w-12 h-12 border-[3px] after:border-solid after:border-[3px] before:border-solid before:border-[3px] border-solid bef aft before:m-auto after:m-auto before:w-8 before:h-8 after:h-10 after:w-10 after:inset-0 before:inset-0 before:rounded-inh after:rounded-inh after:origin-center before:origin-center rounded-[50%] "></span>
);

export const SkeletonLoad = ({
  className = "",
  ngClass = "",
  iClass = "",
  children,
  vertical = undefined,
  state = false,
  style,
  tag = "span",
  disabled,
  onClick,
  transparent = undefined,
}) => {
  return (
    <>
      {state ? (
        <>
          {React.createElement(
            tag,
            { className: `${className} ${ngClass}`, style, disabled, onClick },
            [children]
          )}
        </>
      ) : (
        <span
          className={`text-white/0 overflow-hidden rounded-md ${
            className.includes("absolute") ? "absolute" : "relative"
          } ${className} ${iClass} ${!transparent && "bg-slate-600/20"}`}
        >
          <span className="absolute fade translate-x-[-200%] left-0 top-0 h-full w-4/5 from-transparent via-white/5 to-transparent bg-gradient-to-r"></span>
          |
        </span>
      )}
    </>
  );
};
