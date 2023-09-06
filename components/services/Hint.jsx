import React, { useEffect, useState } from "react";
import { hintService } from "@/services";
import { FaLongArrowAltLeft } from "react-icons/fa";

export default function Hint() {
  const [hint, setHint] = useState(null);

  useEffect(() => {
    const subscription = hintService.init.subscribe((hint) => setHint(hint));
    return () => subscription.unsubscribe();
  }, []);

  if (!hint) return null;

  return (
    <div
      onClick={() => hintService.clear()}
      className="z-[100] fixed inset-0 bg-c4/80"
    >
      <span
        className={`absolute rounded-lg fx text-center flex-col bg-c4/30 text-white ${hint.className}`}
      >
        {hint.message}
      </span>
    </div>
  );
}
