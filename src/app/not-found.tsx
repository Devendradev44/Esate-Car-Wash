import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className="flex-1 bg-zinc-800" />
        <div className="flex-1 bg-zinc-500" />
        <div className="flex-1 bg-yellow-400" />
      </div>

      <div className="z-10">
        <h1 className="text-[120px] md:text-[200px] font-bold uppercase tracking-machined text-white leading-none mb-4">
          404
        </h1>
        <div className="h-px w-24 bg-yellow-400 mx-auto mb-8"></div>
        <h2 className="text-xl font-bold uppercase tracking-machined text-ink mb-6">
          Page Not Found
        </h2>
        <p className="text-sm font-light text-ink mb-10 max-w-sm mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link href="/" className="bg-yellow-400 px-8 py-4 text-xs font-bold uppercase tracking-machined text-black hover:bg-yellow-300 transition-colors">
          Return Home
        </Link>
      </div>
    </div>
  );
}
