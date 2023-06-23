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

export const SkeletonLoad = ({
  className = "",
  ngClass = "",
  iClass = "",
  children,
  opacity,
  state,
  style,
  tag = "span",
  disabled,
  onClick,
}) => (
  <>
    {!state ? (
      <span
        className={`text-white/0 bg-white/5 relative opacity-50 rounded-md ${className} ${iClass}`}
      >
        |
        <span className="fade absolute h-full w-1/3 from-transparent via-white/5 to-transparent"></span>
      </span>
    ) : (
      <>
        {React.createElement(
          tag,
          { className: `${className} ${ngClass}`, style, disabled, onClick },
          [children]
        )}
      </>
    )}
  </>
);
