"use client";

import { useState, useRef } from "react";
import {
  Search,
  X,
  XCircle,
  CheckCircle2,
  Download,
  Upload,
  MoreHorizontal,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { toCSV, downloadCSV, parseCSV } from "@/lib/csv";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type BookingStatusType = "ALL" | "BOOKED" | "COMPLETED" | "CANCELLED";

export default function BookingsPage() {
  const bookings = useStore((state) => state.bookings);
  const cancelBooking = useStore((state) => state.cancelBooking);
  const completeBooking = useStore((state) => state.completeBooking);
  const addBooking = useStore((state) => state.addBooking);

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importError, setImportError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<BookingStatusType>("ALL");

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${String(month).padStart(2, "0")}-${year}`;
  };

  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      b.customer.toLowerCase().includes(q) ||
      b.bookingCode.toLowerCase().includes(q) ||
      b.vehicle.toLowerCase().includes(q) ||
      b.regNumber.toLowerCase().includes(q) ||
      b.service.toLowerCase().includes(q) ||
      b.flat.toLowerCase().includes(q) ||
      b.community.toLowerCase().includes(q);
    const matchesFilter = activeFilter === "ALL" || b.bookingStatus === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const displayCustomerName = (name: string) => (!name || name === "Unknown" ? "Guest" : name);

  const displayAddress = (b: { flat: string; community: string }) => {
    const parts = [b.flat, b.community].filter((v) => v && v !== "Unknown");
    return parts.length > 0 ? parts.join(", ") : "Address not recorded";
  };

  const handleExport = () => {
    const csv = toCSV(bookings, [
      { key: "bookingCode", header: "Booking Code" },
      { key: "date", header: "Date" },
      { key: "time", header: "Time" },
      { key: "customer", header: "Customer" },
      { key: "flat", header: "Flat" },
      { key: "community", header: "Community" },
      { key: "vehicle", header: "Vehicle" },
      { key: "regNumber", header: "Reg Number" },
      { key: "service", header: "Service" },
      { key: "amount", header: "Amount" },
      { key: "bookingStatus", header: "Booking Status" },
      { key: "paymentStatus", header: "Payment Status" },
      { key: "paymentMethod", header: "Payment Method" },
      { key: "cancelledBy", header: "Cancelled By" },
    ]);
    downloadCSV(`bookings_${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  const handleImport = async (file: File) => {
    try {
      const rows = await parseCSV(file);
      if (rows.length < 2) { setImportError("CSV must have a header row and data."); return; }
      const header = rows[0].map((h) => h.trim().toUpperCase());
      const required = ["BOOKING CODE", "DATE", "CUSTOMER", "COMMUNITY", "VEHICLE", "AMOUNT"];
      const missing = required.filter((r) => !header.includes(r));
      if (missing.length > 0) { setImportError(`Missing columns: ${missing.join(", ")}`); return; }

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const getVal = (col: string) => row[header.indexOf(col)] || "";
        const dateVal = getVal("DATE");
        if (!dateVal) continue;
        const pm = getVal("PAYMENT METHOD");
        const cb = getVal("CANCELLED BY");
        addBooking({
          id: `b${Date.now()}_${i}`,
          bookingCode: getVal("BOOKING CODE") || `BK-${i}`,
          date: dateVal,
          time: getVal("TIME") || "10:00",
          customer: getVal("CUSTOMER") || "Unknown",
          flat: getVal("FLAT") || "",
          community: getVal("COMMUNITY") || "",
          vehicle: getVal("VEHICLE") || "",
          regNumber: getVal("REG NUMBER") || "",
          service: getVal("SERVICE") || "",
          amount: Number(getVal("AMOUNT")) || 0,
          bookingStatus: ["BOOKED", "COMPLETED", "CANCELLED"].includes(getVal("BOOKING STATUS")) ? (getVal("BOOKING STATUS") as "BOOKED" | "COMPLETED" | "CANCELLED") : "BOOKED",
          paymentStatus: ["PAID", "PENDING", "REFUNDED"].includes(getVal("PAYMENT STATUS")) ? (getVal("PAYMENT STATUS") as "PAID" | "PENDING" | "REFUNDED") : "PENDING",
          paymentMethod: pm ? (pm as "CASH" | "UPI" | "ONLINE") : undefined,
          cancelledBy: cb ? (cb as "CUSTOMER" | "STAFF" | "ADMIN") : undefined,
        });
      }
      setShowImportModal(false);
      setImportError("");
    } catch {
      setImportError("Failed to parse CSV file.");
    }
  };

  return (
    <div className="p-6 md:p-12">
      <PageHeader
        title="Booking Management"
        description="View, filter, and manage all customer reservations."
        action={
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download size={14} /> Export
            </Button>
            <Button onClick={() => setShowImportModal(true)} className="gap-2">
              <Upload size={14} /> Import
            </Button>
          </div>
        }
      />

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative min-w-0 md:flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                setSearchQuery("");
                e.currentTarget.focus();
              }
            }}
            placeholder="Search by booking code, customer, vehicle, or registration number..."
            aria-label="Search bookings"
            className="h-11 w-full rounded-lg border border-hairline bg-surface-card pl-11 pr-9 text-sm font-light text-ink transition-colors hover:border-body/50 focus-visible:border-yellow-dark/60 focus-visible:hover:border-yellow-dark/60 focus-visible:ring-2 focus-visible:ring-yellow-dark/25 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden"
          />
          {searchQuery.length > 0 ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setSearchQuery("");
                searchRef.current?.focus();
              }}
              className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-ink"
            >
              <X size={14} />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface-card p-2">
          {(["ALL", "BOOKED", "COMPLETED", "CANCELLED"] as BookingStatusType[]).map(filter => (
            <Button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              variant={activeFilter === filter ? "default" : "ghost"}
              className={`h-auto rounded-full px-4 py-2 text-xs font-bold uppercase tracking-machined transition-colors ${
                activeFilter === filter ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Bookings</CardTitle>
            <CardDescription>Showing {filteredBookings.length} of {bookings.length} bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Date / Time</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead className="text-center">Amount</TableHead>
                    <TableHead className="text-center">Booking Status</TableHead>
                    <TableHead className="text-center">Payment Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
<TableBody>
                  {filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="py-10 text-center">
                        <p className="text-sm font-semibold text-ink">No bookings found</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          No bookings match your search. Try a different booking code, customer, vehicle, or registration number.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : filteredBookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-mono text-sm font-bold text-primary">{b.bookingCode}</TableCell>
                      <TableCell>
                        <p className="text-sm font-semibold">{formatDate(b.date)}</p>
                        <p className="text-xs text-muted-foreground">{b.time}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{displayCustomerName(b.customer)}</p>
                        <p className="text-xs text-muted-foreground">{displayAddress(b)}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{b.vehicle}</p>
                        <p className="text-xs text-muted-foreground">{b.regNumber}</p>
                      </TableCell>
                      <TableCell>{b.service}</TableCell>
                      <TableCell className="text-center font-semibold">{b.amount}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={`h-auto rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                          b.bookingStatus === "BOOKED" ? "bg-warning/20 text-warning" :
                          b.bookingStatus === "COMPLETED" ? "bg-success/20 text-success" :
                          "bg-m-red/20 text-m-red"
                        }`}>
                          {b.bookingStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={
                          b.paymentStatus === "PAID" ? "default" :
                          b.paymentStatus === "PENDING" ? "secondary" :
                          "destructive"
                        }>
                          {b.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-ink">
                        <MoreHorizontal size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" side="bottom" className="w-40">
                        {b.bookingStatus === "BOOKED" && (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                setActiveBookingId(b.id);
                                setShowCompleteModal(true);
                              }}
                              className="text-emerald-600"
                            >
                              <CheckCircle2 size={14} className="mr-2" />
                              Complete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => cancelBooking(b.id, "ADMIN")}
                            >
                              <XCircle size={14} className="mr-2" />
                              Cancel
                            </DropdownMenuItem>
                          </>
                        )}
                        {b.bookingStatus !== "BOOKED" && (
                          <DropdownMenuItem disabled className="text-muted-foreground">
                            No actions available
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showCompleteModal} onOpenChange={setShowCompleteModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Complete Booking</DialogTitle>
            <DialogDescription>Select payment method to complete this booking.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button
              onClick={() => {
                completeBooking(activeBookingId, "CASH");
                setShowCompleteModal(false);
              }}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              Cash
            </Button>
            <Button
              onClick={() => {
                completeBooking(activeBookingId, "UPI");
                setShowCompleteModal(false);
              }}
            >
              UPI
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteModal(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Import Bookings</DialogTitle>
            <DialogDescription>Upload a CSV file to import multiple bookings at once.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">Upload a CSV file with columns: Booking Code, Date, Customer, Community, Vehicle, Amount (required).</p>
            <Input
              type="file"
              accept=".csv"
              ref={fileRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImport(file);
              }}
              className="h-auto w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
            />
            {importError && <p className="text-sm text-destructive">{importError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportModal(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}