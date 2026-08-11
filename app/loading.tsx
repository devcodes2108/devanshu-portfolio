export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f7f7f3] px-6 py-20 text-[#121212]">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-5 w-32 rounded-full bg-black/5" />
        <div className="mt-8 h-20 w-full max-w-3xl rounded-[2rem] bg-black/5" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-64 rounded-[2rem] bg-black/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
