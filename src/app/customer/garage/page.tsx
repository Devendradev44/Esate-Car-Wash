"use client";
import { useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { AnimatedSelect } from "@/components/ui/AnimatedSelect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/EmptyState";

export default function GaragePage() {

  const formatRegNumber = (value: string) => {
    return value.toUpperCase().replace(/[^A-Z0-9 ]/g, '');
  };

  const customerGarage = useStore((state) => state.customerGarage);
  const addCustomerVehicle = useStore((state) => state.addCustomerVehicle);
  const updateCustomerVehicle = useStore((state) => state.updateCustomerVehicle);
  const deleteCustomerVehicle = useStore((state) => state.deleteCustomerVehicle);
  const vehicleHierarchy = useStore((state) => state.vehicles);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Add State
  const [newCat, setNewCat] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newReg, setNewReg] = useState("");

// Edit State
  const [editId, setEditId] = useState("");
  const [editReg, setEditReg] = useState("");

  const brandsForNewCat = vehicleHierarchy.find(c => c.id === newCat)?.brands || [];
  const modelsForNewBrand = brandsForNewCat.find(b => b.id === newBrand)?.models || [];

  const handleSaveVehicle = () => {
    if (!newCat || !newBrand || !newModel || !newReg) {
      toast.add({ type: "error", title: "Missing fields", description: "Please select category, brand, model and enter a registration number." });
      return;
    }

    const regRegex = /^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{1,3}\s?\d{1,4}$/;
    if (!regRegex.test(newReg)) {
      toast.add({ type: "error", title: "Invalid registration", description: "Use format: AP 12 SM 1234" });
      return;
    }

    const catName = vehicleHierarchy.find(c => c.id === newCat)?.name || "";
    const brandName = brandsForNewCat.find(b => b.id === newBrand)?.name || "";
    const modelName = modelsForNewBrand.find(m => m.id === newModel)?.name || "";

    addCustomerVehicle({
      id: `v${crypto.randomUUID()}`,
      category: catName,
      brand: brandName,
      model: modelName,
      reg: newReg,
      isDefault: false
    });

    setNewCat("");
    setNewBrand("");
    setNewModel("");
    setNewReg("");
    setShowAddModal(false);
    toast.add({ type: "success", title: "Vehicle added", description: `${brandName} ${modelName} (${newReg}) saved to your garage.` });
  };

  const openEditModal = (id: string, reg: string) => {
    setEditId(id);
    setEditReg(reg);
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    const regRegex = /^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{1,3}\s?\d{1,4}$/;
    if (!regRegex.test(editReg)) {
      toast.add({ type: "error", title: "Invalid registration", description: "Use format: AP 12 SM 1234" });
      return;
    }
    updateCustomerVehicle(editId, editReg);
    setShowEditModal(false);
    toast.add({ type: "success", title: "Registration updated", description: `Registration changed to ${editReg}.` });
  };

  const inputClasses = "w-full h-auto bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-yellow-dark focus:outline-none transition-colors appearance-none";

  return (
    <div className="flex min-h-screen flex-col bg-canvas pb-24">
      <div className="border-b border-hairline bg-surface-soft p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold uppercase text-ink">My Garage</h1>
          <p className="mt-1 text-sm font-light text-body">Manage your saved vehicles.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="p-3 border border-yellow-dark text-yellow-dark hover:bg-yellow-dark hover:text-ink transition-colors">
          <Plus size={20} />
        </Button>
      </div>

      <div className="flex-1 p-6 space-y-4">
        {customerGarage.length === 0 ? (
          <EmptyState
            icon={Plus}
            title="No vehicles saved"
            description="Add your first vehicle to get accurate pricing for your bookings."
            action={
              <Button
                onClick={() => setShowAddModal(true)}
                className="flex items-center justify-center gap-2 bg-yellow-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-colors"
              >
                <Plus size={14} /> Add Vehicle
              </Button>
            }
          />
        ) : (
          customerGarage.map(v => (
            <Card key={v.id} className="gap-0 rounded-none border border-hairline bg-surface-card p-5 ring-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-bold text-ink">{v.brand} {v.model}</p>
                  <p className="text-xs font-light text-muted mt-1">{v.reg} · {v.category}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" size="icon" onClick={() => openEditModal(v.id, v.reg)} className="text-muted hover:text-ink transition-colors"><Edit size={16} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(v.id)} className="text-muted hover:text-m-red transition-colors"><Trash2 size={16} /></Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-h-[90vh] overflow-y-auto gap-0 rounded-none border border-hairline bg-surface-soft p-8 ring-0 sm:max-w-md">
          <div className="flex items-center justify-between mb-8">
            <DialogTitle className="text-xl font-bold uppercase text-ink">Add Vehicle</DialogTitle>
          </div>
          
          <div className="space-y-4 mb-8">
            <AnimatedSelect
              value={newCat}
              onChange={(e) => { setNewCat(e.target.value); setNewBrand(""); setNewModel(""); }}
              label="Category"
              placeholder="Category"
              options={vehicleHierarchy.map(c => ({ value: c.id, label: c.name }))}
              className={inputClasses}
            />
            
            {newCat && (
              <AnimatedSelect
                value={newBrand}
                onChange={(e) => { setNewBrand(e.target.value); setNewModel(""); }}
                label="Brand"
                placeholder="Brand"
                options={brandsForNewCat.map(b => ({ value: b.id, label: b.name }))}
                className={inputClasses}
              />
            )}

            {newBrand && (
              <AnimatedSelect
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
                label="Model"
                placeholder="Model"
                options={modelsForNewBrand.map(m => ({ value: m.id, label: m.name }))}
                className={inputClasses}
              />
            )}

            {newModel && (
              <Input
                type="text"
                value={newReg}
                onChange={(e) => setNewReg(formatRegNumber(e.target.value))}
                maxLength={14}
                placeholder="AP 12 SM 1234"
                className={inputClasses}
              />
            )}
          </div>

          <Button
            onClick={() => {
              const regRegex = /^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{1,3}\s?\d{1,4}$/;
              if (!regRegex.test(newReg)) {
                toast.add({ type: "error", title: "Invalid registration", description: "Use format: AP 12 SM 1234" });
                return;
              }
              handleSaveVehicle();
            }}
            disabled={!newModel || !newReg}
            className="flex h-auto w-full items-center justify-center gap-2 rounded-none bg-yellow-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light disabled:opacity-50"
          >
            Save Vehicle
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-h-[90vh] overflow-y-auto gap-0 rounded-none border border-hairline bg-surface-soft p-8 ring-0 sm:max-w-md">
          <div className="flex items-center justify-between mb-8">
            <DialogTitle className="text-xl font-bold uppercase text-ink">Edit Registration</DialogTitle>
          </div>
          <div className="mb-8">
            <Label className="block text-xs font-bold uppercase tracking-machined text-muted mb-3">Registration Number</Label>
            <Input
              type="text"
              value={editReg}
              onChange={(e) => setEditReg(formatRegNumber(e.target.value))}
              maxLength={14}
              className={inputClasses}
            />
         </div>
          <Button onClick={handleEditSave} className="flex h-auto w-full items-center justify-center gap-2 rounded-none bg-yellow-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light">
            Save Changes
          </Button>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => setDeleteId(open ? deleteId : null)}
        title="Delete Vehicle"
        description="Are you sure you want to remove this vehicle from your garage? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={() => {
          if (deleteId) {
            const target = customerGarage.find((item) => item.id === deleteId);
            deleteCustomerVehicle(deleteId);
            toast.add({
              type: "success",
              title: "Vehicle deleted",
              description: target ? `${target.brand} ${target.model} has been removed.` : "Vehicle removed.",
            });
          }
          setDeleteId(null);
        }}
      />
    </div>
  );
}
