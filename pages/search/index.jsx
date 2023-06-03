import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GameList from "@/components/Games";
import { useRouter } from "next/router";
import { BiArrowToRight } from "react-icons/bi";
import Animated from "@/components/Animated";
import games from "@/helpers/games";

function Index() {
  const [value, setValue] = useState("");
  const router = useRouter();
  const input = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    input.current.focus();
  }, [router]);

  return (
    <motion.div className="fx flex-col">
      <form
        onSubmit={handleSubmit}
        className="mt-14 z-20 rounded-b-[35px] sticky top-14 pt-2 bg-black/50 w-full pb-2 px-10 justify-center mb-3 flex items-end"
      >
        <div className="w-full relative rounded-2xl">
          <input
            type="text"
            ref={input}
            value={value}
            onChange={(v) => setValue(v.target.value)}
            placeholder="Search games, matches"
            className="py-2.5 shadow-md shadow-black pr-12 bg-black rounded-inh border-b-0 px-6 focus:border-c2/50 capitalize border-4 border-c2/25 duration-200 w-full"
          />
          <Animated
            state={value.length > 0}
            tag="button"
            init={{ opacity: 0 }}
            show={{ opacity: 1 }}
            className="absolute bg-gray-800/20 rounded-lg right-2 top-[15%] h-[70%] px-3"
          >
            <BiArrowToRight />
          </Animated>
        </div>
      </form>
      <div className="w-full">
        <GameList title={"Live"} className={"rounded-[40px]"} games={games} />
        <GameList
          title={"Today"}
          className={"rounded-[40px] mt-5"}
          games={games}
        />
        <GameList
          title={"Friday"}
          className={"rounded-[40px] mt-5"}
          games={games}
        />
      </div>
    </motion.div>
  );
}

export default Index;
