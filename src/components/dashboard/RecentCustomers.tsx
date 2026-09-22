"use client";

import { CalendarDays, Car, Building2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  communities: string[];
  totalBookings: number;
  lastBookingDate: string;
}

interface RecentCustomerProps {
  customer: CustomerData;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function RecentCustomer({ customer, className }: RecentCustomerProps) {
  const lastBookingDate = new Date(customer.lastBookingDate);
  const daysAgo = Math.floor((Date.now() - lastBookingDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="flex items-center justify-between py-3.5 transition-colors hover:bg-muted/40 border-b last:border-b-0">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="text-xs font-medium">
            {getInitials(customer.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {customer.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {customer.email}
          </p>
        </div>
      </div>
      <div className="ml-4 text-right hidden sm:block">
        <p className="text-xs text-muted-foreground mb-1">
          {daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`}
        </p>
        <div className="flex items-center gap-1 justify-end">
          <CalendarDays size={12} className="text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">
            {customer.totalBookings} bookings
          </span>
        </div>
      </div>
      <div className="ml-4 hidden md:block">
        <div className="flex flex-wrap gap-1 justify-end">
          {customer.communities.map((community, index) => (
            <Badge key={index} variant="secondary" className="text-[10px]">
              {community}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RecentCustomers({ 
  customers, 
  className 
}: { 
  customers: CustomerData[]; 
  className?: string; 
}) {
  return (
    <div className={className}>
      <div className="divide-y divide-border">
        {customers.map((customer) => (
          <RecentCustomer key={customer.id} customer={customer} />
        ))}
      </div>
    </div>
  );
}
