import React from "react";
import { BiXCircle } from "react-icons/bi";

function Error({ className, children, refresh, refreshText = "refresh" }) {
  return (
    <div className={`fx flex-col gap-2 ${className}`}>
      {children || (
        <>
          <BiXCircle className="text-3xl opacity-40" />
          Something went wrong
        </>
      )}
      <button
        className="text-c2 bg-c2/5 px-3 rounded-lg pb-1.5 pt-1 "
        onClick={refresh}
      >
        {refreshText}
      </button>
    </div>
  );
}

export default Error;
