"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Settings,
  User,
  LogOut,
  Search as SearchIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Search as SearchIconComponent } from "lucide-react";

export function Topbar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, arr) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
      href: "/" + arr.slice(0, index + 1).join("/"),
      isLast: index === arr.length - 1,
    }));

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-screen-2xl flex h-16 items-center gap-4 px-4 md:px-6">
        <nav
          className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              <span className="text-muted-foreground/50">/</span>
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

        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-4">
          <div className="relative w-72">
            <SearchIconComponent className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search bookings, customers..."
              value=""
              onChange={() => {}}
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            />
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              3
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    AD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-medium">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-foreground">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@estatecarwash.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.location.href = "/profile"}>
                <User size={14} className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = "/settings"}>
                <Settings size={14} className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.location.href = "/logout"} className="text-destructive focus:text-destructive">
                <LogOut size={14} className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}