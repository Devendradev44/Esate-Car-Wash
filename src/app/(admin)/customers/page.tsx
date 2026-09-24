"use client";

import { useState, useRef } from "react";
import {
  Plus,
  Search,
  X,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Clock,
  Users as UsersIcon,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "@/components/ui/toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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


type CustomerForm = {
  name: string;
  email: string;
  phone: string;
};

export default function CustomersPage() {
  const customers = useStore((state) => state.customers);
  const addCustomer = useStore((state) => state.addCustomer);
  const updateCustomer = useStore((state) => state.updateCustomer);
  const deleteCustomer = useStore((state) => state.deleteCustomer);

  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [form, setForm] = useState<CustomerForm>({
    name: "",
    email: "",
    phone: "",
  });
  const [formError, setFormError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.trim().toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.phone || "").toLowerCase().includes(q)
    );
  });

const activeCount = customers.filter((c) => c.phone).length;

  const openAddModal = () => {
    setIsEditing(false);
    setForm({ name: "", email: "", phone: "" });
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (
    id: string,
    name: string,
    email: string,
    phone?: string
  ) => {
    setIsEditing(true);
    setCurrentId(id);
    setForm({ name, email, phone: phone || "" });
    setFormError("");
    setShowModal(true);
  };

  const validate = (): string | null => {
    if (!form.name.trim()) return "Please enter the customer's full name.";
    if (!form.email.includes("@") || !form.email.includes(".")) {
      return "Please enter a valid email address.";
    }
    if (form.phone.length !== 10) {
      return "Please enter a valid 10-digit phone number.";
    }
    const duplicate = customers.find(
      (c) =>
        c.id !== currentId &&
        (c.email.toLowerCase() === form.email.toLowerCase() ||
          c.phone === form.phone)
    );
    if (duplicate) {
      return "A customer with this email or phone already exists.";
    }
    return null;
  };

  const handleSave = () => {
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }
    setLoading(true);
    setFormError("");
    try {
      if (isEditing) {
        updateCustomer(currentId, {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone,
        });
        toast.add({
          type: "success",
          title: "Customer updated",
          description: `${form.name.trim()} has been updated.`,
        });
      } else {
        addCustomer({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone,
          passwordHash: "hash_demo",
        });
        toast.add({
          type: "success",
          title: "Customer added",
          description: `${form.name.trim()} has been added successfully.`,
        });
      }
      setForm({ name: "", email: "", phone: "" });
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const target = customers.find((c) => c.id === deleteId);
    deleteCustomer(deleteId);
    setDeleteId(null);
    toast.add({
      type: "success",
      title: "Customer deleted",
      description: target
        ? `${target.name} has been removed.`
        : "Customer removed.",
    });
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const initials = (name: string) =>
    name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-8 md:py-12">
        <PageHeader
          title="Customers"
          description="Manage registered customers and their accounts."
          action={
            <Button onClick={openAddModal} className="bg-primary px-4 py-2.5 text-sm font-bold text-black hover:bg-primary/90 transition-all duration-200 hover:shadow-md hover:shadow-primary/20 rounded-lg active:scale-95">
              <Plus size={16} /> Add Customer
            </Button>
          }
        />

<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard title="Total Customers" value={customers.length} icon={UsersIcon} trend={{ value: 12, label: "vs last month" }} />
          <StatCard title="With Phone" value={activeCount} icon={User} trend={{ value: 0, label: "stable" }} />
          <StatCard title="Showing" value={filteredCustomers.length} icon={Search} trend={{ value: 0, label: "filtered" }} />
        </div>

<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 sm:flex-1">
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
              placeholder="Search by name, email, or phone..."
              aria-label="Search customers"
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
          <Button variant="outline" className="shrink-0">
            <UsersIcon size={16} /> {customers.length} total
          </Button>
        </div>

        <Card className="mt-8 rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg font-semibold">Customer Directory</CardTitle>
              <CardDescription>A list of all registered customers.</CardDescription>
            </div>
            <div className="hidden text-sm text-muted-foreground sm:block">
              {filteredCustomers.length} of {customers.length} customers
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading && customers.length === 0 ? (
              <div className="p-6">
                <TableSkeleton rows={6} cols={5} />
              </div>
            ) : null}

            {!loading && filteredCustomers.length === 0 ? (
              <div className="p-6">
                {customers.length === 0 ? (
                  <EmptyState
                    icon={UsersIcon}
                    title="No customers yet"
                    description="Add your first customer to get started."
                    action={
                      <Button onClick={openAddModal} className="bg-primary px-6 py-3 text-sm font-bold text-black hover:bg-primary/90">
                        <Plus size={16} /> Add Customer
                      </Button>
                    }
                  />
                ) : (
<EmptyState
                    icon={Search}
                    title="No customers found"
                    description="No customers match your search. Try a different name, email, or phone."
                  />
                )}
              </div>
            ) : null}

            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-12">Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((c) => (
                  <TableRow key={c.id} className="group hover:bg-muted-bg/40 transition-colors duration-200">
                    <TableCell>
                      <Avatar className="size-9">
                        <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
                          {initials(c.name)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">{c.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail size={14} /> {c.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Phone size={14} /> {c.phone || "—"}
                      </div>
                    </TableCell>
<TableCell>
                      <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/30">
                        Customer
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock size={14} /> {formatDate(c.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(c.id, c.name, c.email, c.phone)}
                          className="hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(c.id)}
                          className="hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[480px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {isEditing ? "Edit Customer" : "Add Customer"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the customer details below."
                : "Fill in the details to create a new customer account."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                maxLength={10}
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })
                }
                placeholder="9876543210"
              />
              <p className="text-xs text-muted-foreground">Enter a valid 10-digit mobile number.</p>
            </div>

            {formError && (
              <p className="text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 py-2 px-3 rounded-lg">
                {formError}
              </p>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-primary px-6 py-2.5 text-sm font-bold text-black hover:bg-primary/90 transition-all duration-200 hover:shadow-md hover:shadow-primary/20 rounded-lg active:scale-95"
            >
              {isEditing ? "Save Changes" : "Save Customer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => setDeleteId(open ? deleteId : null)}
        title="Delete Customer"
        description="Are you sure you want to delete this customer? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={handleDelete}
      />
      </div>
    </div>
  );
}





