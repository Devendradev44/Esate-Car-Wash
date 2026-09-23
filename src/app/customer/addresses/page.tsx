"use client";
import { useState } from "react";
import { Plus, MapPin, Trash2, Edit } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "@/components/ui/toast";
import { AnimatedSelect } from "@/components/ui/AnimatedSelect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

export default function AddressesPage() {
  const addresses = useStore((state) => state.addresses);
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
      toast.add({ type: "error", title: "Missing fields", description: "Please select a community and enter a flat number." });
      return;
    }

    if (isEditing) {
      updateAddress(currentId, community, flat);
      toast.add({ type: "success", title: "Address updated", description: `${flat} in ${community} has been saved.` });
    } else {
      addAddress({
        id: `a${Date.now()}`,
        community,
        flat,
      });
      toast.add({ type: "success", title: "Address added", description: `${flat} in ${community} has been saved.` });
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
    toast.add({
      type: "success",
      title: "Address deleted",
      description: target ? `${target.flat} in ${target.community} has been removed.` : "Address removed.",
    });
  };

  const inputClasses = "w-full h-auto bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-yellow-dark focus:outline-none transition-colors appearance-none";

  return (
    <div className="flex min-h-screen flex-col bg-canvas pb-24">
      <div className="border-b border-hairline bg-surface-soft p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold uppercase text-ink">My Addresses</h1>
          <p className="mt-1 text-sm font-light text-body">Manage your saved locations.</p>
        </div>
        <Button
          onClick={openAddModal}
          className="p-3 border border-yellow-dark text-yellow-dark hover:bg-yellow-dark hover:text-ink transition-colors"
        >
          <Plus size={20} />
        </Button>
      </div>

      <div className="flex-1 p-6 space-y-4">
        {addresses.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No addresses saved"
            description="Add your first address to book services in your community."
            action={
              <Button
                onClick={openAddModal}
                className="flex items-center justify-center gap-2 bg-yellow-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-colors"
              >
                <Plus size={14} /> Add Address
              </Button>
            }
          />
        ) : (
          addresses.map(a => (
            <Card key={a.id} className="gap-0 rounded-none border border-hairline bg-surface-card p-5 ring-0">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-yellow-dark mt-1" />
                  <div>
                    <p className="text-lg font-bold text-ink">{a.flat}</p>
                    <p className="text-xs font-light text-muted mt-1">{a.community}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditModal(a.id, a.community, a.flat)}
                    className="text-muted hover:text-ink transition-colors"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(a.id)}
                    className="text-muted hover:text-m-red transition-colors"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-h-[90vh] overflow-y-auto gap-0 rounded-none border border-hairline bg-surface-soft p-8 ring-0 sm:max-w-md">
          <div className="flex items-center justify-between mb-8">
            <DialogTitle className="text-xl font-bold uppercase text-ink">
              {isEditing ? "Edit Address" : "Add Address"}
            </DialogTitle>
          </div>

            <div className="mb-4">
              <Label className="block text-xs font-bold uppercase tracking-machined text-muted mb-3">Community</Label>
              <AnimatedSelect
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                label="Community"
                placeholder="Select community"
                options={communities.map(c => ({ value: c.name, label: c.name }))}
                className={inputClasses}
              />
            </div>
            <div className="mb-8">
              <Label className="block text-xs font-bold uppercase tracking-machined text-muted mb-3">Flat Number</Label>
              <Input
                type="text"
                value={flat}
                onChange={(e) => setFlat(e.target.value)}
                placeholder="e.g. C-503"
                className={inputClasses}
              />
            </div>

            <Button
              onClick={handleSaveAddress}
              className="flex h-auto w-full items-center justify-center gap-2 rounded-none bg-yellow-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light"
            >
              {isEditing ? "Save Changes" : "Save Address"}
            </Button>
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