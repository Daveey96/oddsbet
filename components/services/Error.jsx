import React from "react";
import { BiXCircle } from "react-icons/bi";
import { BsWifiOff } from "react-icons/bs";

function Error({
  className,
  children,
  refresh,
  refreshText = "refresh",
  type,
}) {
  return (
    <div className={`fx flex-col gap-2 ${className}`}>
      {children || (
        <>
          {type ? (
            <>
              <BsWifiOff className="text-3xl opacity-40" />
              No Internet
            </>
          ) : (
            <>
              <BiXCircle className="text-3xl opacity-40" />
              Something went wrong
            </>
          )}
        </>
      )}
      <button
        className="text-c2 active:scale-[0.8] duration-150 bg-c2/5 px-3 rounded-lg pb-1.5 pt-1 "
        onClick={refresh}
      >
        {refreshText}
      </button>
    </div>
  );
}

export default Error;
