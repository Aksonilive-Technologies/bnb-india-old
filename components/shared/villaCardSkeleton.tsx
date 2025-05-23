export default function VillaCardSkeleton() {
  return (
    <div className={`relative h-[420px] flex flex-col gap-4 mx-1 p-1 animate-pulse`}>
      <div
        className={`h-[75%] bg-gray-300 overflow-hidden relative rounded-3xl`}
      >
      </div>

      <div className="w-full flex flex-col gap-3 justify-between items-start">
        <div className="h-4 rounded-full w-[80%] bg-gray-300"></div>
        <div className="h-4 rounded-full w-[70%] bg-gray-300"></div>
      </div>
    </div>
  );
}
