import Image from "next/image";
import React, { useState } from "react";
import Svg from "../Svg";

function List({
  list,
  className,
  icon,
  iClass,
  v = "v",
  onClick,
  activeClass,
  inActiveClass,
  onActive,
}) {
  const [active, setActive] = useState(0);

  const clicked = (key) => {
    let a = active;
    setActive(key);
    let data = onClick(list[key][v]);

    !data && setActive(a);
  };

  return (
    <ul className={`flex text-sm overflow-x-scroll no-bars gap-3 ${className}`}>
      {list.map((i, key) => (
        <li
          onClick={() => clicked(key)}
          className={`fx last-of-type:mr-3 whitespace-nowrap ${iClass} ${
            active === key ? activeClass : inActiveClass
          }`}
          key={key}
        >
          {icon && (
            <Svg
              className={key !== active && "opacity-80"}
              id={i.id}
              size={12}
            />
          )}
          {onActive ? <>{active === key && <>{i.item}</>}</> : <>{i.item}</>}
        </li>
      ))}
    </ul>
  );
}

export default List;
