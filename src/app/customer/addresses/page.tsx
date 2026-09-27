"use client";
import { useState } from "react";
import { Plus, MapPin, Trash2, Edit } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

export default function AddressesPage() {
  const mockUser = useStore((state) => state.mockUser);
  const addresses = useStore((state) => state.addresses).filter((a) => a.ownerId === mockUser?.id);
  const communities = useStore((state) => state.communities);
  const addAddress = useStore((state) => state.addAddress);
  const updateAddress = useStore((state) => state.updateAddress);
  const deleteAddress = useStore((state) => state.deleteAddress);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [community, setCommunity] = useState("");
  const [flat, setFlat] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAddModal = () => {
    setIsEditing(false);
    setCommunity("");
    setFlat("");
    setShowModal(true);
  };

  const openEditModal = (id: string, c: string, f: string) => {
    setIsEditing(true);
    setCurrentId(id);
    setCommunity(c);
    setFlat(f);
    setShowModal(true);
  };

  const handleSaveAddress = () => {
    if (!community || !flat) {
      toast.error("Missing fields", { description: "Please select a community and enter a flat number." });
      return;
    }

    if (isEditing) {
      updateAddress(currentId, community, flat);
      toast.success("Address updated", { description: `${flat} in ${community} has been saved.` });
    } else {
      addAddress({
        id: `a${Date.now()}`,
        community,
        flat,
      });
      toast.success("Address added", { description: `${flat} in ${community} has been saved.` });
    }

    setCommunity("");
    setFlat("");
    setShowModal(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const target = addresses.find(a => a.id === deleteId);
    deleteAddress(deleteId);
    setDeleteId(null);
    toast.error("Address removed", {
      description: target ? `${target.flat} in ${target.community} has been removed.` : "Address removed.",
    });
  };

  const inputClasses = "w-full h-auto rounded-xl border border-hairline bg-surface-card px-4 py-4 text-sm font-light text-ink placeholder:text-muted focus:border-yellow-dark focus:outline-none focus:ring-2 focus:ring-yellow-dark/20 transition-all appearance-none";
  const labelClasses = "block text-[11px] font-bold uppercase tracking-machined text-muted mb-2.5";
  const stepClasses = "inline-flex items-center gap-1.5 rounded-full bg-yellow-dark/10 px-3 py-1 text-[10px] font-bold uppercase tracking-machined text-yellow-dark";

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <div className="border-b border-hairline bg-surface-soft p-6 md:px-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-normal text-ink">My Address</h1>
          <p className="mt-1 text-sm font-light text-body">Manage your saved locations.</p>
        </div>
        <Button onClick={openAddModal} className="flex h-auto items-center justify-center gap-2 rounded-xl bg-yellow-dark px-5 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-all hover:shadow-lg">
          <Plus size={14} /> Add Address
        </Button>
      </div>

      <div className="mx-auto w-full max-w-2xl flex-1 p-4 md:p-6 space-y-3">
        {addresses.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No addresses saved"
            description="Add your first address to book services in your community."
            action={
              <Button
                onClick={openAddModal}
                className="flex items-center justify-center gap-2 rounded-xl bg-yellow-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-all"
              >
                <Plus size={14} /> Add Address
              </Button>
            }
          />
        ) : (
          <div className="grid gap-3">
            {addresses.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-card px-4 py-3.5 transition-colors hover:border-yellow-dark/40 hover:bg-surface-elevated">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-dark/10 ring-1 ring-yellow-dark/20">
                  <MapPin size={18} className="text-yellow-dark" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-bold text-ink">{a.community}</p>
                  <p className="mt-0.5 text-sm font-light text-muted">Flat · <span className="font-semibold text-body">{a.flat}</span></p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => openEditModal(a.id, a.community, a.flat)}
                    aria-label={`Edit address ${a.flat} in ${a.community}`}
                    className="text-muted hover:bg-surface-elevated hover:text-ink transition-colors"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDeleteId(a.id)}
                    aria-label={`Delete address ${a.flat} in ${a.community}`}
                    className="text-muted hover:bg-m-red/10 hover:text-m-red transition-colors"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent showCloseButton className="max-h-[90vh] gap-0 overflow-y-auto rounded-2xl border border-hairline bg-surface-soft p-6 ring-0 sm:max-w-[520px]">
          <div className="mb-6">
            <span className={stepClasses}>{isEditing ? "Manage address" : "Add address"}</span>
            <DialogTitle className="mt-3 text-2xl font-bold tracking-normal text-ink">
              {isEditing ? "Update this address" : "Where should we come?"}
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-sm font-light text-muted">
              Saved locations are offered at checkout.
            </DialogDescription>
          </div>

          <div className="space-y-5">
            <div>
              <Label htmlFor="addr-community" className={labelClasses}>
                Community <span className="text-m-red" aria-hidden="true">*</span>
              </Label>
              <Select value={community} onValueChange={(v) => setCommunity(v || "")}>
                <SelectTrigger id="addr-community" className={`${inputClasses}h-auto!`} aria-required>
                  <SelectValue placeholder="Select community" />
                </SelectTrigger>
                <SelectContent>
                  {communities.map((c) => (
                    <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="addr-flat" className={labelClasses}>
                Flat Number <span className="text-m-red" aria-hidden="true">*</span>
              </Label>
              <Input
                id="addr-flat"
                type="text"
                value={flat}
                onChange={(e) => setFlat(e.target.value)}
                placeholder="e.g. C-503"
                aria-required
                className={inputClasses}
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
              onClick={handleSaveAddress}
              className="h-auto rounded-xl bg-yellow-dark px-6 py-3 text-sm font-bold text-ink transition-all hover:bg-yellow-light active:scale-[0.98]"
            >
              {isEditing ? "Save Changes" : "Save Address"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => setDeleteId(open ? deleteId : null)}
        title="Delete Address"
        description="Are you sure you want to delete this address? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}