"use client";

import { useState, useRef } from "react";
import {
  Search,
  CalendarDays,
  XCircle,
  CheckCircle2,
  Banknote,
  User,
  Car,
  Wrench,
  Download,
  Upload,
  X,
  FileText,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { toCSV, downloadCSV, parseCSV } from "@/lib/csv";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
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

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<BookingStatusType>("ALL");

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.regNumber.includes(searchQuery);
    const matchesFilter = activeFilter === "ALL" || b.bookingStatus === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const totalAmount = filteredBookings.reduce((s, b) => s + b.amount, 0);
  const paidCount = filteredBookings.filter((b) => b.paymentStatus === "PAID").length;
  const pendingCount = filteredBookings.filter((b) => b.paymentStatus === "PENDING").length;

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

  const statusFilters: { key: BookingStatusType; label: string }[] = [
    { key: "ALL", label: "All" },
    { key: "BOOKED", label: "Booked" },
    { key: "COMPLETED", label: "Completed" },
    { key: "CANCELLED", label: "Cancelled" },
  ];

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
        <div className="flex-1 flex items-center gap-3 border border-border bg-surface-card p-3">
          <Search size={16} className="text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by Code, Name, or Reg..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-none bg-transparent p-0 focus:outline-none"
          />
        </div>

        <div className="flex border border-border bg-surface-card overflow-x-auto">
          {(["ALL", "BOOKED", "COMPLETED", "CANCELLED"] as BookingStatusType[]).map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 px-4 py-3 text-xs font-bold uppercase tracking-machined transition-colors ${
                activeFilter === filter ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 flex gap-3">
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download size={14} /> Export Bookings
        </Button>
        <Button onClick={() => setShowImportModal(true)} className="gap-2">
          <Upload size={14} /> Import Bookings
        </Button>
      </div>

      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Import Bookings</DialogTitle>
            <DialogDescription>Upload a CSV file with columns: Booking Code, Date, Customer, Community, Vehicle, Amount (required).</DialogDescription>
          </DialogHeader>
          <input
            type="file"
            accept=".csv"
            ref={fileRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImport(file);
            }}
            className="w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
          />
          {importError && <p className="mt-4 text-sm text-destructive">{importError}</p>}
        </DialogContent>
      </Dialog>

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
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No bookings found.
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
                        <p className="font-medium">{b.customer}</p>
                        <p className="text-xs text-muted-foreground">{b.flat}, {b.community}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{b.vehicle}</p>
                        <p className="text-xs text-muted-foreground">{b.regNumber}</p>
                      </TableCell>
                      <TableCell>{b.service}</TableCell>
                      <TableCell className="text-center font-semibold">{b.amount}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={
                          b.bookingStatus === "BOOKED" ? "default" :
                          b.bookingStatus === "COMPLETED" ? "default" :
                          "secondary"
                        }>
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
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={16} className="text-muted-foreground" />
                        </Button>
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
            <input
              type="file"
              accept=".csv"
              ref={fileRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImport(file);
              }}
              className="w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
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