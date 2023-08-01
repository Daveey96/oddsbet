import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { useKeenSlider } from "keen-slider/react";
import React, { useEffect, useRef, useState } from "react";

const Animated = ({
  state,
  className,
  style,
  children,
  variants,
  variantKey = "",
  mode = "sync",
  init,
  show,
  exit,
  transition,
  onClick,
  onSubmit,
  tag = "div",
}) => {
  let Element = motion[tag];

  return (
    <AnimatePresence mode={mode}>
      {state && (
        <Element
          style={style}
          className={className}
          variants={variants}
          initial={variants ? `init${variantKey}` : init}
          animate={variants ? `show${variantKey}` : show}
          exit={variants ? `exit${variantKey}` : exit || init}
          transition={transition}
          onClick={onClick}
          onSubmit={onSubmit}
        >
          {children}
        </Element>
      )}
    </AnimatePresence>
  );
};

export const Page = ({
  state,
  className = "",
  children,
  variants,
  transition,
}) => (
  <AnimatePresence mode="popLayout">
    {children.map(
      (child, key) =>
        key === state && (
          <motion.div
            key={Math.floor(Math.random() * 1000000)}
            initial={{ x: variants[key][0] }}
            animate={{ x: variants[key][1] }}
            exit={{ x: variants[key][2] }}
            transition={transition || { duration: 0.3 }}
            className={
              "absolute flex top-0 left-0 w-full flex-col justify-start items-center " +
                className[key] || className
            }
          >
            {child}
          </motion.div>
        )
    )}
  </AnimatePresence>
);

export const BlurredModal = ({
  children,
  onClick,
  variants,
  className,
  iClass,
  state,
  type,
}) => {
  const variant = {
    init: { opacity: 0 },
    show: { opacity: 1 },
    exit: { opacity: 0 },
  };

  let childVariants = {
    init: { ...(variants?.init || { opacity: 0 }) },
    show: {
      ...(variants?.show || { opacity: 1 }),
      transition: { ease: "anticipate" },
    },
    exit: {
      ...(variants?.exit || { opacity: 0 }),
      transition: { ease: "easeInOut" },
    },
  };

  return (
    <Animated
      state={state}
      variants={variant}
      className={`fixed inset-0 ${className}`}
      onClick={onClick}
    >
      {type === "allChidren" ? (
        <>
          {children.map((child, key) => (
            <motion.div
              key={key}
              variants={childVariants}
              className={iClass[key]}
            >
              {child}
            </motion.div>
          ))}
        </>
      ) : (
        <>
          <motion.div variants={childVariants} className={iClass}>
            {children?.length ? children[0] : children}
          </motion.div>
          {children?.length && children[1]}
        </>
      )}
    </Animated>
  );
};

export default Animated;
