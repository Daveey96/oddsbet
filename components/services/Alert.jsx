import { useState, useEffect } from "react";
import { alertService } from "services";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";
import { motion } from "framer-motion";

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

  if (!alert) return null;

  return (
    <div className="fixed top-0 z-50 fx w-full">
      <motion.span
        initial={{ opacity: 0, y: "-100%" }}
        animate={{ opacity: 1, y: "0%" }}
        exit={{ opacity: 0, y: "-100%" }}
        key={38373}
        className={`rounded-b-xl whitespace-nowrap relative fx overflow-hidden gap-2 px-7 py-2.5 ${
          alert.type === "success" ? "bg-[#022502]" : "bg-[#200202]"
        } `}
      >
        {alert.type === "success" ? (
          <BiCheckCircle className="absolute text-5xl left-2 text-green-700/50" />
        ) : (
          <BiXCircle className="absolute text-5xl left-2 text-red-700/20      " />
        )}
        <span className="z-10">{alert.message}</span>
      </motion.span>
    </div>
  );
}
