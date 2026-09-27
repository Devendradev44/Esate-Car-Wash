"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Users, Trash2, Edit, Phone } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

export default function DriversPage() {
  const mockUser = useStore((state) => state.mockUser);
  const drivers = useStore((state) => state.drivers).filter((d) => d.ownerId === mockUser?.id);
  const addDriver = useStore((state) => state.addDriver);
  const updateDriver = useStore((state) => state.updateDriver);
  const deleteDriver = useStore((state) => state.deleteDriver);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAddModal = () => {
    setIsEditing(false);
    setName("");
    setPhone("");
    setShowModal(true);
  };

  const openEditModal = (id: string, n: string, p: string) => {
    setIsEditing(true);
    setCurrentId(id);
    setName(n);
    setPhone(p);
    setShowModal(true);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
  };

  const handleSaveDriver = () => {
    const cleanName = name.trim();
    if (!cleanName || cleanName.length < 2) {
      toast.error("Missing fields", { description: "Please enter the driver's name." });
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Invalid phone number", { description: "Please enter a valid 10-digit mobile number." });
      return;
    }

    if (isEditing) {
      updateDriver(currentId, cleanName, phone);
      toast.success("Driver updated", { description: `${cleanName} has been saved.` });
    } else {
      addDriver({ id: `d${Date.now()}`, name: cleanName, phone });
      toast.success("Driver added", { description: `${cleanName} has been saved.` });
    }

    setName("");
    setPhone("");
    setShowModal(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const target = drivers.find(d => d.id === deleteId);
    deleteDriver(deleteId);
    setDeleteId(null);
    toast.error("Driver removed", {
      description: target ? `${target.name} has been removed.` : "Driver removed.",
    });
  };

  const inputClasses = "w-full h-auto rounded-xl border border-hairline bg-surface-card px-4 py-4 text-sm font-light text-ink placeholder:text-muted focus:border-yellow-dark focus:outline-none focus:ring-2 focus:ring-yellow-dark/20 transition-all appearance-none";
  const labelClasses = "block text-[11px] font-bold uppercase tracking-machined text-muted mb-2.5";
  const stepClasses = "inline-flex items-center gap-1.5 rounded-full bg-yellow-dark/10 px-3 py-1 text-[10px] font-bold uppercase tracking-machined text-yellow-dark";

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <div className="border-b border-hairline bg-surface-soft p-6 md:px-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-normal text-ink">My Drivers</h1>
          <p className="mt-1 text-sm font-light text-body">People who bring your car for service.</p>
        </div>
        <Button onClick={openAddModal} className="flex h-auto items-center justify-center gap-2 rounded-xl bg-yellow-dark px-5 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-all hover:shadow-lg">
          <Plus size={14} /> Add Driver
        </Button>
      </div>

      <div className="mx-auto w-full max-w-2xl flex-1 p-4 md:p-6 space-y-3">
        {drivers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No drivers saved"
            description="Add the name and number of drivers who drop off or pick up your car, then pick them at checkout."
            action={
              <Button
                onClick={openAddModal}
                className="flex items-center justify-center gap-2 rounded-xl bg-yellow-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-all"
              >
                <Plus size={14} /> Add Driver
              </Button>
            }
          />
        ) : (
          <div className="grid gap-3">
            {drivers.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: i * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="group flex items-center gap-3 rounded-xl border border-hairline bg-surface-card px-4 py-3.5 transition-colors hover:border-yellow-dark/40 hover:bg-surface-elevated">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-dark/10 ring-1 ring-yellow-dark/20">
                    <Users size={18} className="text-yellow-dark" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-bold text-ink">{d.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-sm font-light text-muted"><Phone size={12} className="shrink-0" /> <span className="font-semibold text-body">{d.phone}</span></p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEditModal(d.id, d.name, d.phone)}
                      aria-label={`Edit driver ${d.name}`}
                      className="text-muted hover:bg-surface-elevated hover:text-ink transition-colors"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setDeleteId(d.id)}
                      aria-label={`Delete driver ${d.name}`}
                      className="text-muted hover:bg-m-red/10 hover:text-m-red transition-colors"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent showCloseButton className="max-h-[90vh] gap-0 overflow-y-auto rounded-2xl border border-hairline bg-surface-soft p-6 ring-0 sm:max-w-[480px]">
          <div className="mb-6">
            <span className={stepClasses}>{isEditing ? "Manage driver" : "Add driver"}</span>
            <DialogTitle className="mt-3 text-2xl font-bold tracking-normal text-ink">
              {isEditing ? "Update driver details" : "Who brings your car?"}
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-sm font-light text-muted">
              Your driver&apos;s name and number your crew can call at pickup and drop-off.
            </DialogDescription>
          </div>

          <div className="space-y-5">
            <div>
              <Label htmlFor="driver-name" className={labelClasses}>
                Driver&apos;s Name <span className="text-m-red" aria-hidden="true">*</span>
              </Label>
              <Input
                id="driver-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh"
                aria-required
                className={inputClasses}
              />
            </div>
            <div>
              <Label htmlFor="driver-phone" className={labelClasses}>
                Mobile Number <span className="text-m-red" aria-hidden="true">*</span>
              </Label>
              <Input
                id="driver-phone"
                type="text"
                inputMode="numeric"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="e.g. 9876543210"
                aria-required
                className={`${inputClasses} font-mono tracking-wider`}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              className="h-auto rounded-xl border border-hairline px-5 py-3 text-sm font-bold text-body hover:bg-surface-elevated hover:text-body"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveDriver}
              className="h-auto rounded-xl bg-yellow-dark px-6 py-3 text-sm font-bold text-ink transition-all hover:bg-yellow-light active:scale-[0.98]"
            >
              {isEditing ? "Save Changes" : "Save Driver"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => setDeleteId(open ? deleteId : null)}
        title="Delete Driver"
        description="Are you sure you want to delete this driver? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}