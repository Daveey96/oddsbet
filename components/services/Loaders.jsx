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

export const CircularLoader = ({ size = 14, className, depth = 4, color }) => {
  return (
    <span
      className={
        `${
          color ? "loaderColor" : "loader"
        } border-r-transparent inline-block rounded-[50%] ${
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

export const SkeletonLoad = ({
  className = "",
  ngClass = "",
  iClass = "",
  children,
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
          className={`text-white/0 before:content-["load"] fade2 aft after:translate-x-[-200%] overflow-hidden rounded-md after:left-0 after:top-0 after:h-full after:w-4/5 after:from-transparent dark:after:via-white/5 after:via-white/70 after:to-transparent after:bg-gradient-to-r ${
            className.includes("absolute") ? "absolute" : "relative"
          } ${className} ${iClass} ${!transparent && "bg-slate-600/20"}`}
        ></span>
      )}
    </>
  );
};
