import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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

export const CircularLoader = ({ size = 14, className }) => {
  return (
    <motion.span
      animate={{
        rotate: [0, 360],
        transition: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 0.4,
          ease: "easeInOut",
        },
      }}
      className={
        "border-t-4 border-t-c1 border-b-4 rounded-md border-b-c2 " + className
      }
      style={{ width: `${size}px`, height: `${size}px` }}
    ></motion.span>
  );
};
