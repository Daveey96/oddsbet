import { motion, AnimatePresence } from "framer-motion";
import React from "react";

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

export const Pagged = ({
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

export default Animated;
