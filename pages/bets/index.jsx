import React from "react";

const BetSlip = () => {
  return <div>slip</div>;
};

function Index() {
  return (
    <div className="flex flex-col overflow-hidden items-center">
      <div className="w-full flex items-end gap-12 justify-center pb-1.5 pt-16 bg-slate-700/20">
        <button className="relative aft after:bottom-0 after:w">
          my betlist
        </button>
        <button>bet history</button>
      </div>
      <div className="">
        {Array(4)
          .fill("")
          .map((i, key) => (
            <BetSlip key={key} />
          ))}
      </div>
    </div>
  );
}

export default Index;
