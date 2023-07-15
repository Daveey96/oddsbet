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

export const Page = ({
  className,
  style,
  children,
  variants,
  transition,
  onClick,
  tag = "div",
}) => {
  let Element = motion[tag];
  return (
    <Element
      style={style}
      initial={variants.init}
      animate={variants.show}
      exit={variants.exit}
      transition={transition}
      onClick={onClick}
      className={"absolute " + className}
    >
      {children}
    </Element>
  );
};

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
