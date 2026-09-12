import Link from "next/link";
import { Sparkles, Gauge, ShieldCheck, Car } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col font-sans">
      
      {/* 1. HEADER (Pinned to top, aligned with content) */}
      <header className="w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-lg">
              <Car size={20} className="text-black" />
            </div>
            <div className="text-left">
              <h1 className="text-base font-bold text-white leading-none">Estate Car Spa</h1>
              <p className="text-[10px] font-medium text-zinc-500 mt-1">Premium Car Care</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/login" className="text-xs font-semibold border text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-zinc-900">
              Sign in
            </Link>
            <Link href="/signup" className="bg-yellow-400 px-4 py-2 text-xs font-bold text-black rounded-lg hover:bg-yellow-300 transition-all active:scale-95">
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT (Centered below header) */}
      <main className="flex-1 flex items-center justify-center w-full">
        <div className="max-w-7xl w-full mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-10">
          
          {/* Left Side */}
          <div className="text-left animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              The wash your estate deserves.
            </h2>
            <p className="text-sm md:text-base text-zinc-400 mb-10 max-w-md">
              Estate Car Spa brings premium car care directly to your gated community. Book in seconds, track in real-time, and pay seamlessly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="bg-yellow-400 px-8 py-3 text-sm font-bold text-black rounded-lg hover:bg-yellow-300 transition-all text-center active:scale-95 hover:shadow-lg hover:shadow-yellow-400/20">
                Book your first wash
              </Link>
              <Link href="/login" className="border border-zinc-700 px-8 py-3 text-sm font-semibold text-zinc-300 rounded-lg hover:bg-zinc-900 hover:text-white transition-all text-center active:scale-95">
                I have an account
              </Link>
            </div>
          </div>

          {/* Right Side (Feature Cards) */}
          <div className="space-y-4 mt-10 md:mt-0">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex gap-4 items-start transition-all duration-300 hover:border-zinc-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50">
              <div className="bg-yellow-400/10 p-3 rounded-lg">
                <Sparkles className="text-yellow-400" size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-2">Clean Finish</h3>
                <p className="text-xs font-light text-zinc-400">Long-lasting protection and premium shine for every vehicle.</p>
              </div>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex gap-4 items-start transition-all duration-300 hover:border-zinc-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50">
              <div className="bg-yellow-400/10 p-3 rounded-lg">
                <Gauge className="text-yellow-400" size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-2">Quick Turnaround</h3>
                <p className="text-xs font-light text-zinc-400">Book and forget. We handle the rest with zero downtime.</p>
              </div>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex gap-4 items-start transition-all duration-300 hover:border-zinc-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50">
              <div className="bg-yellow-400/10 p-3 rounded-lg">
                <ShieldCheck className="text-yellow-400" size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-2">Fair Pricing Matrix</h3>
                <p className="text-xs font-light text-zinc-400">Price is set by service × vehicle category. No surprises.</p>
              </div>
            </div>
          </div>
          
        </div>
      </main>

    </div>
  );
}
