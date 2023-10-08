import { motion } from "framer-motion";
import React, { useState } from "react";

function DropDown({
  a = 0,
  children,
  iClass,
  item,
  changed,
  className,
  ngClass,
}) {
  const [active, setActive] = useState(a);
  const [open, setOpen] = useState(false);

  let pVariants = {
    init: { opacity: 1 },
    show: { opacity: 1 },
    exit: { opacity: 0 },
  };

  let cVariants = {
    init: { opacity: 0, x: 10 },
    show: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 0 },
  };

  return (
    <button
      onClick={() => setOpen(!open)}
      onBlur={() => setOpen(false)}
      className={`relative ${className}`}
    >
      {children[active]} {item}
      {open && (
        <motion.span
          variants={pVariants}
          initial="init"
          animate="show"
          exit="exit"
          transition={{ staggerChildren: 0.05 }}
          className={`flex absolute z-30 top-full flex-col ${ngClass}`}
        >
          {children.map(
            (item, key) =>
              key !== active && (
                <motion.span
                  key={key}
                  variants={cVariants}
                  className={`${iClass}`}
                  onClick={() => {
                    setActive(key);
                    changed && changed(key);
                  }}
                >
                  {item}
                </motion.span>
              )
          )}
        </motion.span>
      )}
    </button>
  );
}

export default DropDown;
