import React, { useState } from "react";

function List({
  list,
  v,
  className,
  jsx,
  iClass,
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
            onClick(v[key][list]);
            setActive(key);
          }}
          className={`fx last-of-type:mr-3 whitespace-nowrap ${iClass} ${
            active === key ? activeClass : inActiveClass
          }`}
          key={key}
        >
          {jsx.includes(" ") ? (
            <>
              {list[key][jsx.split(" ")[0]]} {list[key][jsx.split(" ")[1]]}
            </>
          ) : (
            <>{list[key][jsx]}</>
          )}
        </li>
      ))}
    </ul>
  );
}

export default List;
