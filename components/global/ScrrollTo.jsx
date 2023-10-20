import React, { useRef } from "react";

function ScrrollTo({ id, clicked, className, iClass, list, children }) {
  const scroll = useRef(null);
  const activate = ({ target }, v, key) => {
    clicked(v, key);
    scroll.current.scrollTo(
      target.offsetLeft -
        scroll.current.offsetWidth / 2 +
        target.offsetWidth / 2,
      0
    );
  };

  return (
    <ul id={id} ref={scroll} className={className}>
      {list.map((v, key) => (
        <li
          className={iClass[key]}
          onClick={(e) => activate(e, v, key)}
          key={key}
        >
          {children ? children[key] : v}
        </li>
      ))}
    </ul>
  );
}

export default ScrrollTo;
