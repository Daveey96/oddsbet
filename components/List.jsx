import React, { useState } from "react";

function List({ v, className, iClass, onClick, activeClass, inActiveClass }) {
  const [active, setActive] = useState(0);
  return (
    <ul
      className={`flex text-sm overflow-x-scroll no-bars w-full gap-3 ${className}`}
    >
      {v.map((item, key) => (
        <li
          onClick={() => {
            onClick(item.v || item.item);
            setActive(key);
          }}
          className={`fx whitespace-nowrap ${iClass} ${
            active === key ? activeClass : inActiveClass
          }`}
          key={key}
        >
          {item.item}
        </li>
      ))}
    </ul>
  );
}

export default List;
