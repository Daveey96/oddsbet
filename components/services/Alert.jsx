import { useState, useEffect } from "react";
import { alertService } from "services";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";

export default function Alert({ onAlert }) {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    // subscribe to new alert notifications
    const subscription = alertService.alert.subscribe((alert) =>
      setAlert(alert)
    );

    // unsubscribe when the component unmounts
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (alert) {
      onAlert(alert);
      setTimeout(() => {
        alertService.clear();
      }, 3000);
    }
  }, [alert]);

  return (
    <div className="fixed top-0 z-[60] fx w-full">
      <AnimatePresence>
        {alert && (
          <motion.span
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "-100%" }}
            key={38373}
            className={`rounded-b-xl whitespace-nowrap relative fx overflow-hidden gap-2 px-7 py-2 ${
              alert.type === "success"
                ? " bg-white text-green-500 dark:text-white font-bold dark:font-normal dark:bg-[#022502]"
                : "bg-white text-red-600 dark:text-white font-bold dark:font-normal dark:bg-[#200202]"
            } `}
          >
            {alert.type === "success" ? (
              <BiCheckCircle className="absolute text-3xl left-2 text-green-700/10 dark:text-green-700/50 " />
            ) : (
              <BiXCircle className="absolute text-3xl left-2 text-red-700/20" />
            )}
            <span className="z-10 text-sm">{alert.message}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
