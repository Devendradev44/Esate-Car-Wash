"use client";
import Link from "next/link";
import { Car, Sparkles, Gauge, ShieldCheck } from "lucide-react";
import { PageTransition, StaggerContainer, StaggerItem, SlideIn, FadeIn } from "@/components/animations/PageTransition";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <PageTransition className="min-h-screen bg-black flex flex-col font-sans">
      
      {/* 1. HEADER (Pinned to top, aligned with content) */}
      <header className="w-full">
        <SlideIn direction="down" className="max-w-7xl mx-auto px-6 md:px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-lg">
              <Car size={24} className="text-black" />
            </div>
            <div className="text-left">
              <h1 className="text-base font-bold leading-none">
                <span className="text-yellow-400">Estate</span> Car Spa
              </h1>
              <p className="text-[10px] font-medium text-ink mt-1">Premium Car Care</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              render={<Link href="/login" />}
              className="h-auto rounded-lg border border-current px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-zinc-900 hover:text-white"
            >
              Sign in
            </Button>
            <Button
              render={<Link href="/signup" />}
              className="h-auto rounded-lg bg-yellow-400 px-4 py-2 text-xs font-bold text-black transition-all hover:bg-yellow-300 active:scale-95"
            >
              Get started
            </Button>
          </div>
        </SlideIn>
      </header>

      {/* 2. MAIN CONTENT (Centered below header) */}
      <main className="flex-1 flex items-center justify-center w-full">
        <StaggerContainer delay={0.2} className="max-w-7xl w-full mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-10">
          
          {/* Left Side */}
          <SlideIn direction="left" className="text-left">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              The wash your <span className="text-yellow-400">estate</span> deserves.
            </h2>
            <p className="text-sm md:text-base text-ink mb-10 max-w-md">
              Estate Car Spa brings premium car care directly to your gated community. Book in seconds, track in real-time, and pay seamlessly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                render={<Link href="/signup" />}
                className="h-auto rounded-lg bg-yellow-400 px-8 py-3 text-center text-sm font-bold text-black transition-all hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/20 active:scale-95"
              >
                Book your first wash
              </Button>
              <Button
                variant="ghost"
                render={<Link href="/login" />}
                className="h-auto rounded-lg border border-zinc-700 px-8 py-3 text-center text-sm font-semibold text-ink transition-all hover:bg-zinc-900 hover:text-white active:scale-95"
              >
                I have an account
              </Button>
            </div>
          </SlideIn>

          {/* Right Side (Feature Cards) */}
          <StaggerContainer delay={0.1} className="space-y-4 mt-10 md:mt-0">
            <StaggerItem delay={0.05}>
              <FadeIn>
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex gap-4 items-start transition-all duration-300 hover:border-zinc-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50">
                  <div className="bg-yellow-400/10 p-3 rounded-lg">
                    <Sparkles className="text-yellow-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-2">Clean Finish</h3>
                    <p className="text-xs font-light text-ink">Long-lasting protection and premium shine for every vehicle.</p>
                  </div>
                </div>
              </FadeIn>
            </StaggerItem>
            
            <StaggerItem delay={0.1}>
              <FadeIn>
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex gap-4 items-start transition-all duration-300 hover:border-zinc-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50">
                  <div className="bg-yellow-400/10 p-3 rounded-lg">
                    <Gauge className="text-yellow-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-2">Quick Turnaround</h3>
                    <p className="text-xs font-light text-ink">Book and forget. We handle the rest with zero downtime.</p>
                  </div>
                </div>
              </FadeIn>
            </StaggerItem>
            
            <StaggerItem delay={0.15}>
              <FadeIn>
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex gap-4 items-start transition-all duration-300 hover:border-zinc-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50">
                  <div className="bg-yellow-400/10 p-3 rounded-lg">
                    <ShieldCheck className="text-yellow-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-2">Fair Pricing Matrix</h3>
                    <p className="text-xs font-light text-ink">Price is set by service × vehicle category. No surprises.</p>
                  </div>
                </div>
              </FadeIn>
            </StaggerItem>
          </StaggerContainer>
          
        </StaggerContainer>
      </main>

    </PageTransition>
  );
}
