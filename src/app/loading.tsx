export default function Loading() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center">
      <div className="flex h-1 w-16 mb-8 animate-pulse">
        <div className="flex-1 bg-yellow-light" />
        <div className="flex-1 bg-yellow-dark" />
        <div className="flex-1 bg-m-red" />
      </div>
      <div className="w-8 h-8 border-2 border-hairline border-t-yellow-dark rounded-full animate-spin"></div>
      <p className="mt-4 text-xs font-bold uppercase tracking-machined text-muted">Loading...</p>
    </div>
  );
}
