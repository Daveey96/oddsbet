import Image from "next/image";
import React, { useState } from "react";

function List({
  list,
  className,
  icon,
  iClass,
  v = "v",
  onClick,
  activeClass,
  inActiveClass,
}) {
  const [active, setActive] = useState(0);

  return (
    <ul
      className={`flex text-sm overflow-x-scroll no-bars w-full gap-3 ${className}`}
    >
      {list.map((i, key) => (
        <li
          onClick={() => {
            onClick(list[key][v]);
            setActive(key);
          }}
          className={`fx last-of-type:mr-3 whitespace-nowrap ${iClass} ${
            active === key ? activeClass : inActiveClass
          }`}
          key={key}
        >
          {icon && (
            <Image
              width={15}
              height={15}
              src={`/sport_icons_I/sport${i.id}.svg`}
              alt={i.item}
            />
          )}
          <>{i.item}</>
        </li>
      ))}
    </ul>
  );
}

export default List;
