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
            animate={{ opacity: 1, y: "10%" }}
            exit={{ opacity: 0, y: "-100%" }}
            className={`rounded-xl text-white whitespace-nowrap relative fx overflow-hidden gap-2 px-6 pt-2.5 pb-2.5 ${
              alert.type === "success" ? "bg-[#022502]" : "bg-[#200202]"
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
