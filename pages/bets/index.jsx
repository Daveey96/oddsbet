import React, { useState } from "react";
import { motion } from "framer-motion";

const BetSlip = () => {
  return <div>slip</div>;
};

function Index() {
  let buttons = ["my betlist", "bet history"];
  const [active, setActive] = useState(0);
  return (
    <div className="flex min-h-screen flex-col overflow-hidden items-center">
      <div className="w-full flex items-end gap-12 justify-center pt-16 bg-c3">
        {buttons.map((b, key) => (
          <motion.button
            className={`${
              key === active ? "after:w-1/2 " : "after:w-0 "
            } aft after:top-full after:duration-200 after:h-1 after:bg-gradient-to-br after:rounded-xl after:from-c1 after:to-c2 relative flex pb-1.5 justify-center`}
            key={key}
            whileTap={{ opacity: 0.2 }}
            onClick={() => setActive(key)}
          >
            {b}
          </motion.button>
        ))}
      </div>
      <div className="">
        {Array(4)
          .fill("")
          .map((i, key) => (
            <BetSlip key={key} />
          ))}
      </div>
    </div>
  );
}

export default Index;
