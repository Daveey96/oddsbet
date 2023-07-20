const Panel = ({ className, children }) => {
  return (
    <aside
      className={
        "bg-c4 md:flex hidden rounded-2xl sticky top-12 h-[calc(100vh_-_60px)] flex-1 " +
        className
      }
    >
      {children}
    </aside>
  );
};

export default Panel;
