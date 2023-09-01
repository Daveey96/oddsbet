import { AnimatePresence, motion } from "framer-motion";
import React, { useContext } from "react";
import { BiX } from "react-icons/bi";
import { Context } from "../layout";
import Animated from "../Animated";

function AllGames() {
  const { open, setOpen } = useContext(Context);
  return (
    <Animated
      id="scontainer"
      state={open}
      initial={{ y: "100%", opacity: 1 }}
      animate={{ x: "0%", opacity: 1, transition: { duration: 0.3 } }}
      exit={{ x: "0%", opacity: 0, transition: { duration: 0.15 } }}
      className="fixed bg-c4 overflow-y-scroll overflow-x-hidden justify-start items-center flex-col inset-0 flex z-[23] w-full "
    >
      <button
        onClick={() => setOpen(null)}
        className="text-red-600 absolute right-4 top-9 text-3xl"
      >
        <BiX />
      </button>
    </Animated>
  );
}
//   <motion.div
//     id="ontainer"
//     initial={{ x: "100%", opacity: 1 }}
//     animate={{ x: "0%", opacity: 1, transition: { duration: 0.3 } }}
//     exit={{ x: "0%", opacity: 0, transition: { duration: 0.15 } }}
//   ></motion.div>
// </AnimatePresence>;

export default AllGames;
