"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 text-center">
      <div className="flex h-1 w-16 mb-8">
        <div className="flex-1 bg-yellow-light" />
        <div className="flex-1 bg-yellow-dark" />
        <div className="flex-1 bg-m-red" />
      </div>
      <h1 className="text-2xl font-bold uppercase text-ink mb-4">Something went wrong</h1>
      <p className="text-sm font-light text-body mb-10 max-w-sm">
        An unexpected error occurred. Please try again, or return to the login page if the problem persists.
      </p>
      <div className="flex gap-4">
        <button 
          onClick={reset} 
          className="bg-yellow-dark px-8 py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-colors"
        >
          Try Again
        </button>
        <Link href="/login" className="border border-hairline px-8 py-4 text-xs font-bold uppercase tracking-machined text-muted hover:text-ink transition-colors">
          Return Home
        </Link>
      </div>
    </div>
  );
}
