import { useState, useEffect } from "react";
import { BiCheck, BiX } from "react-icons/bi";
import { promptService } from "services";
import { motion } from "framer-motion";
import { CircularLoader } from "./Loaders";
import { overlayService } from "@/services";

const variants = {
  initChild: { opacity: 0, y: 50 },
  showChild: { opacity: 1, y: 0 },
  exitChild: { opacity: 0, y: 50 },
};

export default function Prompt() {
  const [prompt, setPrompt] = useState(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const subscription = promptService.init.subscribe((prompt) =>
      setPrompt(prompt)
    );

    return () => subscription.unsubscribe();
  }, []);

  const clicked = async (key) => {
    setLoad(true);
    overlayService.lay();
    await prompt.clicked(key);
    overlayService.clear();
    setLoad(false);
  };

  if (!prompt) return null;
  return (
    <div
      onClick={promptService.clear}
      className="fixed text-sm inset-0 fx backdrop-blur-lg bg-black/60 z-[55] fx w-full"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        variants={variants}
        initial={"initChild"}
        animate={"showChild"}
        exit={"exitChild"}
        className="w-5/6 flex h-32 flex-col rounded-3xl bg-c3 dark:bg-c4"
      >
        <span className="z-10 flex-1 fx w-full">{prompt?.message}</span>
        <div className="flex w-full justify-center gap-4">
          {prompt &&
            prompt.choices.map((text, key) => (
              <motion.button
                whileTap={{ scale: 0.8 }}
                key={key}
                className={`py-2 fx gap-1 relative mb-2 rounded-xl px-8 ${
                  prompt?.type
                    ? "bg-c2 text-white"
                    : key
                    ? "dark:text-red-500 text-white dark:bg-red-500/5 bg-red-500"
                    : `dark:bg-green-500/5 bg-green-500 ${
                        load
                          ? "text-green-500/0"
                          : "dark:text-green-500 text-white"
                      }`
                }`}
                onClick={() =>
                  prompt?.type
                    ? promptService.clear()
                    : key
                    ? promptService.clear()
                    : clicked(key)
                }
              >
                {!key && load && (
                  <CircularLoader
                    size={12}
                    depth={2}
                    className={`absolute ${
                      prompt.type
                        ? "border-white"
                        : "dark:border-green-500 border-white"
                    }`}
                  />
                )}
                {!prompt.type && (
                  <>
                    {key ? (
                      <BiX />
                    ) : (
                      <BiCheck className={!key && load && "opacity-0"} />
                    )}
                  </>
                )}
                {text}
              </motion.button>
            ))}
        </div>
      </motion.div>
    </div>
  );
}
