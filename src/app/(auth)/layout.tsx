export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4">
      {/* The M Stripe at the absolute top of the screen */}
      <div className="fixed top-0 left-0 right-0 flex h-1">
        <div className="flex-1 bg-m-blue-light" />
        <div className="flex-1 bg-m-blue-dark" />
        <div className="flex-1 bg-m-red" />
      </div>
      
      {children}
    </div>
  );
}