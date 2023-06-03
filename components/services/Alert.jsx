import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { alertService } from "services";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";
import Animated, { Variants } from "../Animated";

export { Alert };

function Alert() {
  const router = useRouter();
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
    // clear alert on location change
    if (alert) {
      setTimeout(() => {
        alertService.clear();
      }, 3000);
    }
  }, [alert]);

  if (!alert) return null;

  return (
    <div className="fixed top-1 z-50 fx w-full">
      <Animated
        state={alert}
        init={{ y: -100, opacity: 0 }}
        show={{ y: 0, opacity: 1 }}
        className={`rounded-xl relative fx shadow gap-2 px-7 py-3 ${
          alert.type === "success"
            ? "bg-[#022502] shadow-[#022502]"
            : "bg-[#200202] shadow-[#200202]"
        } `}
      >
        {alert.type === "success" ? (
          <BiCheckCircle className="absolute scale-[2.5] left-4 text-green-700/50" />
        ) : (
          <BiXCircle className="absolute scale-[2.5] left-4 text-red-700/20      " />
        )}
        <span className="z-10">{alert.message}</span>
      </Animated>
    </div>
  );
}
