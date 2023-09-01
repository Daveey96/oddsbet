export default function Footer() {
  return (
    <footer className="w-full pb-16 flex px-4 flex-col justify-start bg-c3 dark:bg-c4/30 rounded-t-3xl items-center relative pt-4 ">
      <span className="text-[10px] w-full pl-2 mb-1 dark:opacity-30">
        oddsbet2023. All rights reserved
      </span>
      <span className="flex w-full gap-2 justify-between pb-2 items-center">
        <span className="rounded-xl bg-red-600/0 font-bold dark:font-normal dark:bg-red-600/10 text-red-600 py-2.5 px-3 font-mono text-lg">
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
