import React, { useState } from "react";

export default function Err({
  children,
  duration = 3,
  className,
  style,
  func,
}) {
  const [message, setMessage] = useState("me");

  return <div className={""}>{children}</div>;
}
