import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
} from "framer-motion";
import React from "react";

const Animated = ({
  state,
  className,
  style,
  children,
  variants,
  variantKey = "",
  variantType,
  mode = "sync",
  init,
  show,
  exit,
  transition,
  onClick,
  onBlur,
  onSubmit,
  tag = "div",
}) => {
  let Element = motion[tag];
  let mainv = variants;

  if (variantType) {
    let m = {};

    m[`init${variantKey}`] = {};
    m[`show${variantKey}`] = {};
    m[`exit${variantKey}`] = {};

    variantType.split(" ").forEach((v) => {
      if (v === "opacity") {
        m[`init${variantKey}`]["opacity"] = 0;
        m[`show${variantKey}`]["opacity"] = 1;
        m[`exit${variantKey}`]["opacity"] = 0;
      } else if (v === "x") {
        m[`init${variantKey}`]["x"] = "0%";
        m[`show${variantKey}`]["x"] = "100%";
        m[`exit${variantKey}`]["x"] = "0%";
      } else if (v === "y") {
        m[`init${variantKey}`]["y"] = "0%";
        m[`show${variantKey}`]["y"] = "100%";
        m[`exit${variantKey}`]["y"] = "0%";
      }
    });

    mainv = m;
  }

  return (
    <AnimatePresence mode={mode}>
      {state && (
        <Element
          style={style}
          className={className}
          variants={mainv}
          initial={mainv ? `init${variantKey}` : init}
          animate={mainv ? `show${variantKey}` : show}
          exit={mainv ? `exit${variantKey}` : exit}
          transition={transition}
          onClick={onClick}
          onSubmit={onSubmit}
          onBlur={onBlur}
        >
          {children}
        </Element>
      )}
    </AnimatePresence>
  );
};

export const Page = ({ state, className = "", children, variants }) => (
  <AnimatePresence mode="popLayout">
    {children.map(
      (child, key) =>
        key === state && (
          <motion.div
            key={key}
            initial={{ x: variants[key] === 1 ? "100%" : "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: variants[key] === 1 ? "100%" : "-100%" }}
            transition={{ duration: 0.3 }}
            className={
              "flex w-full flex-col justify-start items-center " +
              className[key]
            }
          >
            {child}
          </motion.div>
        )
    )}
  </AnimatePresence>
);

export const Curtain = ({
  id,
  className = "",
  siblingState,
  children,
  setState,
  sibling,
}) => {
  const x = useMotionValue(0);

  const dragEnded = (e, v) => {
    if (v.offset.x > 110) {
      animate(x, window.innerWidth + 50, { duration: 0.15 });
      setTimeout(setState, 200);
    } else animate(x, 0, { duration: 0.25 });
  };

  return (
    <>
      <motion.div
        id={id}
        drag="x"
        style={{ x }}
        dragElastic={0.1}
        onDragEnd={dragEnded}
        dragConstraints={{ left: 0 }}
        initial={{ x: "100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.2 }}
        className={`fixed flex-col inset-0 flex z-[23] ${className}`}
      >
        {children}
      </motion.div>
      <AnimatePresence>
        {sibling && siblingState && (
          <motion.div
            init={{ opacity: 0 }}
            show={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ x }}
            transition={{ duration: 0.15 }}
            className="top-0 fixed z-30 bg-white dark:bg-black fx w-full"
          >
            {sibling}
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
