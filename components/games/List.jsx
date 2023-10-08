import Image from "next/image";
import React, { useState } from "react";
import Svg from "../global/Svg";

function List({
  list,
  className,
  icon,
  iClass,
  v = "v",
  onClick,
  activeClass,
  inActiveClass,
  id,
}) {
  const [active, setActive] = useState(0);

  return (
    <ul
      id={id}
      className={`flex text-sm overflow-x-scroll no-bars gap-3 ${className}`}
    >
      {list.map((i, key) => (
        <li
          onClick={() => {
            setActive(key);
            onClick(list[key][v]);
          }}
          className={`fx last-of-type:mr-3 whitespace-nowrap ${iClass} ${
            active === key ? activeClass : inActiveClass
          }`}
          key={key}
        >
          {icon && <Svg className={"mt-0.5"} id={i.id} size={11} />}
          <>{i.item}</>
        </li>
      ))}
    </ul>
  );
}

export default List;
