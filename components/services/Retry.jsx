import { condition } from "@/helpers";
import React from "react";

function Retry({ children, loading, error, state, getState }) {
  useEffect(() => {
    state === null && getState();
  }, [state]);

  return (
    <>
      {state === null ? (
        <>{loading}</>
      ) : (
        condition(
          state,
          ["loading", "error", "*"],
          [<>{loading}</>, <>{error}</>, <>{children}</>]
        )
      )}
    </>
  );
}

export default Retry;
