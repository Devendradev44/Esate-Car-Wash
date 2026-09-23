"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface BreadcrumbsProps {
  className?: string;
  homeLabel?: string;
  homeHref?: string;
}

export function Breadcrumbs({
  className,
  homeLabel = "Dashboard",
  homeHref = "/dashboard",
}: BreadcrumbsProps) {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, arr) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
      href: "/" + arr.slice(0, index + 1).join("/"),
      isLast: index === arr.length - 1,
    }));

  if (segments.length === 0) return null;

  return (
    <nav
      className={cn("flex items-center gap-1.5 text-sm text-muted-foreground", className)}
      aria-label="Breadcrumb"
    >
      <Link href={homeHref} className="hover:text-foreground transition-colors">
        {homeLabel}
      </Link>
      {segments.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <ChevronRight size={12} className="text-muted-foreground" />
          {crumb.isLast ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}