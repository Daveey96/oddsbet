export default function Footer() {
  return (
    <footer className="w-full mb-20 flex px-4 flex-col items-center relative pt-4 ">
      <hr className="mt-5 border-0 h-0.5 bg-c4 absolute -top-3 w-[93%] mx-auto" />
      <span className="text-[10px] w-full mb-1 opacity-30">
        oddsbet2023. All rights reserved
      </span>
      <span className="flex w-full gap-2 justify-between pb-2 items-center">
        <span className="rounded-xl bg-red-600/10 text-red-600 py-2.5 px-3 font-mono text-lg">
          18+
        </span>
        <span className="opacity-50">|</span>
        <span className="flex flex-1 leading-4 flex-col items-center text-[11px]">
          <span className="text-red-600">Warning!!</span>
          <span className="text-center">
            Sport betting is addictive and can be harmful
          </span>
          <span className="text-blue-700">#betresponsibly</span>
        </span>
      </span>
    </footer>
  );
}
