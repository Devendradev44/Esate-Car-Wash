import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

// Use system fonts to avoid network issues during build
const fontClass = "font-sans";

export const metadata: Metadata = {
  title: "Estate Car Spa | Premium Car Wash & Detailing SaaS",
  description: "Estate Car Spa is a premium, gated-community car wash management platform. Book washes, manage staff, and track revenue.",
  keywords: ["car wash", "car wash saas", "gated community car wash", "auto detailing", "car wash booking"],
  authors: [{ name: "Estate Car Spa" }],
  openGraph: {
    title: "Estate Car Spa | Premium Car Wash & Detailing",
    description: "Book premium car wash services for your gated community.",
    type: "website",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans")}>
      <body className={`${fontClass} antialiased text-white`}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
