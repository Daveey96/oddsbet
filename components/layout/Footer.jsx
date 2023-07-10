export default function Footer() {
  return (
    <footer className="w-full mb-20 flex px-7 flex-col items-center relative pt-8 ">
      <hr className="mt-5 border-0 h-0.5 bg-c4 absolute -top-3 w-[93%] mx-auto" />
      <span className="text-[10px] w-full mb-2 opacity-30">
        oddsbet2023. All rights reserved
      </span>
      <span className="flex w-full justify-between pb-2 items-center">
        <span className="rounded-xl bg-red-600/10 text-red-600 py-2.5 px-3 font-mono text-lg">
          18+
        </span>
        <span className="opacity-50">|</span>
        <span className="flex flex-col items-center text-[11px]">
          <span className="text-red-600">Warning!!</span>
          <span>Sport betting is addictive and can be harmful</span>
          <span className="text-blue-700">#betresponsibly</span>
        </span>
      </span>
      <span className="flex mt-1">
        {["Privacy Policy", "Terms & conditions", "Help"].map((item, key) => (
          <button
            key={key}
            className={`mt-1 text-[11px] active:text-white/5 text-white/50 duration-150 px-3  ${
              key && "border-l-2 border-c2"
            }`}
          >
            {item}
          </button>
        ))}
      </span>
    </footer>
  );
}
