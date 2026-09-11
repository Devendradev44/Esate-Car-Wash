import Link from "next/link";
import Image from "next/image";
import { Sparkles, Gauge, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative font-sans">
      {/* Nav Bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 p-1.5 rounded-lg">
            <Image src="/logo.svg" alt="Estate Car Spa" width={24} height={24} className="object-contain" />
          </div>
          <div className="text-left">
            <h1 className="text-lg font-bold tracking-tight text-white leading-none">ESTATE CAR SPA</h1>
            <p className="text-[9px] font-medium uppercase tracking-widest text-zinc-500 mt-1">Premium Car Care</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-xs font-bold uppercase tracking-wide text-zinc-400 hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-zinc-900">
            Sign in
          </Link>
          <Link href="/signup" className="bg-yellow-400 px-4 py-2 text-xs font-bold uppercase tracking-wide text-black hover:bg-yellow-300 transition-all duration-200 rounded-lg active:scale-95 hover:shadow-lg hover:shadow-yellow-400/20">
            Get started
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl w-full z-10 mt-24 md:mt-0 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left Side */}
        <div className="text-left animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            The wash your estate deserves.
          </h2>
          <p className="text-sm md:text-base font-light text-zinc-400 mb-10 max-w-md">
            Estate Car Spa brings premium car care directly to your gated community. Book in seconds, track in real-time, and pay seamlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup" className="bg-yellow-400 px-8 py-4 text-xs font-bold uppercase tracking-wide text-black hover:bg-yellow-300 transition-all duration-200 text-center rounded-xl active:scale-95 hover:shadow-lg hover:shadow-yellow-400/20">
              Book your first wash
            </Link>
            <Link href="/login" className="border border-zinc-700 px-8 py-4 text-xs font-bold uppercase tracking-wide text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all duration-200 text-center rounded-xl active:scale-95 hover:border-zinc-500">
              I have an account
            </Link>
          </div>
        </div>

        {/* Right Side (Feature Cards) */}
        <div className="space-y-4">
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex gap-4 items-start transition-all duration-300 hover:border-zinc-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50">
            <div className="bg-yellow-400/10 p-3 rounded-lg">
              <Sparkles className="text-yellow-400" size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-white mb-2">Clean Finish</h3>
              <p className="text-xs font-light text-zinc-400">Long-lasting protection and premium shine for every vehicle.</p>
            </div>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex gap-4 items-start transition-all duration-300 hover:border-zinc-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50">
            <div className="bg-yellow-400/10 p-3 rounded-lg">
              <Gauge className="text-yellow-400" size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-white mb-2">Quick Turnaround</h3>
              <p className="text-xs font-light text-zinc-400">Book and forget. We handle the rest with zero downtime.</p>
            </div>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex gap-4 items-start transition-all duration-300 hover:border-zinc-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50">
            <div className="bg-yellow-400/10 p-3 rounded-lg">
              <ShieldCheck className="text-yellow-400" size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-white mb-2">Fair Pricing Matrix</h3>
              <p className="text-xs font-light text-zinc-400">Price is set by service × vehicle category. No surprises.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}