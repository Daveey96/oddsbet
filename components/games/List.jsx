import React, { useState } from "react";
import Svg from "../global/Svg";
import ScrrollTo from "../global/ScrrollTo";

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
    <ScrrollTo
      id={id}
      list={list}
      className={`flex text-sm overflow-x-scroll no-bars gap-3 ${className}`}
      clicked={(i, key) => {
        setActive(key);
        onClick(list[key][v]);
      }}
      iClass={list.map(
        (i, key) =>
          `fx last-of-type:mr-3 whitespace-nowrap ${iClass} ${
            active === key ? activeClass : inActiveClass
          }`
      )}
    >
      {list.map((i, key) => (
        <React.Fragment key={key}>
          {icon && <Svg className={"mt-0.5"} id={i.id} size={11} />}
          <>{i.item}</>
        </React.Fragment>
      ))}
    </ScrrollTo>
  );
}

export default List;
