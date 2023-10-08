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

export const Skeleton = ({
  className = "",
  loadClass = "",
  componentClass = "",
  children,
  state = false,
  style,
  tag = "span",
  disabled,
  onClick,
}) =>
  state ? (
    React.createElement(
      tag,
      { className: `${className} ${componentClass}`, style, disabled, onClick },
      [children]
    )
  ) : (
    <span
      className={`text-white/0 before:content-["load"] overflow-hidden ${
        !className.includes("absolute") && "relative"
      } ${
        !className.includes("dl") && "dark:bg-slate-600/20 bg-c5"
      } ${className} ${loadClass}`}
    ></span>
  );
