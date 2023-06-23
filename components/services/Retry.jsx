import { condition } from "@/helpers";
import React from "react";

function Retry({
  children,
  loading,
  error,
  state,
  stateArr = ["loading", "error", "*"],
}) {
  return (
    <>
      {state === null ? (
        <>{loading}</>
      ) : (
        condition(state, stateArr, [
          <>{loading}</>,
          <>{error}</>,
          <>{children}</>,
        ])
      )}
    </>
  );
}

export default Retry;
