import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Load the Inter font with the weights we need for the BMW M design
const inter = Inter({ 
  subsets: ["latin"],
  weight: ['300', '400', '700'],
});


export const metadata: Metadata = {
  title: "Estate Car Wash | Premium Car Wash & Detailing SaaS",
  description: "Estate Car Wash is a premium, gated-community car wash management platform. Book washes, manage staff, and track revenue.",
  keywords: ["car wash", "car wash saas", "gated community car wash", "auto detailing", "car wash booking"],
  authors: [{ name: "Estate Car Wash" }],
  openGraph: {
    title: "Estate Car Wash | Premium Car Wash & Detailing",
    description: "Book premium car wash services for your gated community.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}