import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

function Index() {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    setTimeout(() => mounted && setMounted(false), 2000);
  }, [mounted]);

  return (
    <AnimatePresence>
      {mounted && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-white dark:bg-c4 fixed inset-0 fx z-[1000]"
        >
          <Image src={"/favicon.svg"} width={90} height={30} alt="logo" />
          <Image
            className="dark:blur-3xl blur-2xl absolute scale-150"
            src={"/favicon.svg"}
            width={100}
            height={30}
            alt="logo"
          />
          <span className="absolute bottom-3 fx gap-3 text-c1">
            <span className="text-red-500">18+</span> Bet Responsibly
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Index;
