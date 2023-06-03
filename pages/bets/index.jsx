import React from "react";

function Index() {
  return (
    <div className="flex flex-col overflow-hidden items-center">
      <div className="h-32 w-full rounded-b-[2rem] bg-slate-700/30">
        <button>my betlist</button>
        <button>bet history</button>
      </div>
      <span className="bg relative bg-gray-700/20 w-4/5 mt-6 h-32 ">
        fish
        <img
          src="/ticket.svg"
          className="absolute -top-1 h-[8.5rem] left-[82.3%] w-32"
          alt=""
        />
      </span>
      <span className="bg relative bg-gray-700/20 w-4/5 mt-6 h-32 ">
        fish
        <img
          src="/ticket.svg"
          className="absolute -top-1 h-[8.5rem] left-[82.3%] w-32"
          alt=""
        />
      </span>
    </div>
  );
}

export default Index;
