"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Trash2, Edit, Car } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/EmptyState";

export default function GaragePage() {
  const formatRegNumber = (value: string) => {
    return value.toUpperCase().replace(/[^A-Z0-9 ]/g, '');
  };

  const mockUser = useStore((state) => state.mockUser);
  const customerGarage = useStore((state) => state.customerGarage).filter((v) => v.ownerId === mockUser?.id);
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

  const brandsForNewCat = vehicleHierarchy.find(c => c.name === newCat)?.brands || [];
  const modelsForNewBrand = brandsForNewCat.find(b => b.name === newBrand)?.models || [];

  const handleSaveVehicle = () => {
    if (!newCat || !newBrand || !newModel || !newReg) {
      toast.error("Missing fields", { description: "Please select category, brand, model and enter a registration number." });
      return;
    }

    const regRegex = /^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{1,3}\s?\d{1,4}$/;
    if (!regRegex.test(newReg)) {
      toast.error("Invalid registration", { description: "Use format: AP 12 SM 1234" });
      return;
    }

    const catName = newCat;
    const brandName = newBrand;
    const modelName = newModel;

    addCustomerVehicle({
      id: `v${crypto.randomUUID()}`,
      category: catName,
      brand: brandName,
      model: modelName,
      reg: newReg,
      isDefault: customerGarage.length === 0,
    });

    setNewCat("");
    setNewBrand("");
    setNewModel("");
    setNewReg("");
    setShowAddModal(false);
    toast.success("Vehicle added", { description: `${brandName} ${modelName} (${newReg}) saved to your garage.` });
  };

  const openEditModal = (id: string, reg: string) => {
    setEditId(id);
    setEditReg(reg);
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    const regRegex = /^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{1,3}\s?\d{1,4}$/;
    if (!regRegex.test(editReg)) {
      toast.error("Invalid registration", { description: "Use format: AP 12 SM 1234" });
      return;
    }
    updateCustomerVehicle(editId, editReg);
    setShowEditModal(false);
    toast.success("Vehicle updated", { description: `Registration changed to ${editReg}.` });
  };

  const inputClasses = "w-full h-auto rounded-xl border border-hairline bg-surface-card px-4 py-4 text-sm font-light text-ink placeholder:text-muted focus:border-yellow-dark focus:outline-none focus:ring-2 focus:ring-yellow-dark/20 transition-all appearance-none";
  const labelClasses = "block text-[11px] font-bold uppercase tracking-machined text-muted mb-2.5";
  const stepClasses = "inline-flex items-center gap-1.5 rounded-full bg-yellow-dark/10 px-3 py-1 text-[10px] font-bold uppercase tracking-machined text-yellow-dark";

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <div className="border-b border-hairline bg-surface-soft p-6 md:px-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-normal text-ink">My Garage</h1>
          <p className="mt-1 text-sm font-light text-body">Your vehicles, ready for their next wash.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="flex h-auto items-center justify-center gap-2 rounded-xl bg-yellow-dark px-5 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-all hover:shadow-lg">
          <Plus size={14} /> Add Vehicle
        </Button>
      </div>

      <div className="mx-auto w-full max-w-2xl flex-1 p-4 md:p-6 space-y-3">
        {customerGarage.length === 0 ? (
          <EmptyState
            icon={Car}
            title="No vehicles in your garage"
            description="Add your first vehicle to get accurate pricing and a faster booking experience."
            action={
              <Button
                onClick={() => setShowAddModal(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-yellow-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-all"
              >
                <Plus size={14} /> Add Vehicle
              </Button>
            }
          />
        ) : (
          <div className="grid gap-3">
            {customerGarage.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: i * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="group flex items-center gap-3 rounded-xl border border-hairline bg-surface-card px-4 py-3 transition-all duration-200 hover:border-yellow-dark/50 hover:bg-surface-elevated">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-dark/10 ring-1 ring-yellow-dark/20">
                    <Car size={18} className="text-yellow-dark" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-bold text-ink">{v.brand} {v.model}</p>
                      {v.isDefault && (
                        <Badge variant="secondary" className="rounded-full bg-yellow-dark/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-machined text-yellow-dark">Primary</Badge>
                      )}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <p className="font-mono text-[11px] tracking-wider text-body">{v.reg}</p>
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">· {v.category}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEditModal(v.id, v.reg)} className="text-muted hover:text-ink transition-colors" aria-label={`Edit ${v.brand} ${v.model}`}>
                      <Edit size={15} />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(v.id)} className="text-muted hover:text-m-red transition-colors" aria-label={`Remove ${v.brand} ${v.model}`}>
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ============ ADD VEHICLE (onboarding-style dialog) ============ */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent showCloseButton className="max-h-[92vh] overflow-y-auto gap-0 rounded-2xl border border-hairline bg-surface-soft p-8 ring-0 sm:max-w-[520px]">
          <span className={stepClasses}><Plus size={11} /> Add vehicle</span>
          <div className="mt-3 mb-8">
            <DialogTitle className="text-2xl font-bold tracking-normal text-ink">Tell us what you drive</DialogTitle>
            <DialogDescription className="mt-1.5 text-sm font-light text-muted">
              Pick your vehicle details and registration number. Pricing adapts automatically.
            </DialogDescription>
          </div>

          <div className="space-y-6">
            <div>
              <Label className={labelClasses}>Vehicle Category <span className="text-m-red" aria-hidden="true">*</span></Label>
              <Select value={newCat} onValueChange={(v) => { setNewCat(v || ""); setNewBrand(""); setNewModel(""); }}>
                <SelectTrigger className={inputClasses}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleHierarchy.map(c => (
                    <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className={labelClasses}>Brand <span className="text-m-red" aria-hidden="true">*</span></Label>
              <Select value={newBrand} onValueChange={(v) => { setNewBrand(v || ""); setNewModel(""); }}>
                <SelectTrigger className={inputClasses}>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brandsForNewCat.map(b => (
                    <SelectItem key={b.name} value={b.name}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className={labelClasses}>Model <span className="text-m-red" aria-hidden="true">*</span></Label>
              <Select value={newModel} onValueChange={(v) => setNewModel(v || "")}>
                <SelectTrigger className={inputClasses}>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {modelsForNewBrand.map(m => (
                    <SelectItem key={m.name} value={m.name}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className={labelClasses}>Registration Number <span className="text-m-red" aria-hidden="true">*</span></Label>
              <Input
                type="text"
                value={newReg}
                onChange={(e) => setNewReg(formatRegNumber(e.target.value))}
                maxLength={14}
                placeholder="AP 12 SM 1234"
                aria-required
                aria-describedby="reg-helper"
                className={`${inputClasses} font-mono tracking-wider`}
              />
              <p id="reg-helper" className="mt-2 text-xs font-light text-muted">Format: &quot;AP 12 SM 1234&quot; — upper case letters and numbers only.</p>
            </div>
          </div>

          <Button
            onClick={handleSaveVehicle}
            className="mt-8 flex h-auto w-full items-center justify-center gap-2 rounded-xl bg-yellow-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-all"
          >
            Save Vehicle
          </Button>
        </DialogContent>
      </Dialog>

      {/* ============ EDIT REGISTRATION ============ */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent showCloseButton className="max-h-[92vh] overflow-y-auto gap-0 rounded-2xl border border-hairline bg-surface-soft p-8 ring-0 sm:max-w-[480px]">
          <span className={stepClasses}><Edit size={11} /> Edit vehicle</span>
          <div className="mt-3 mb-8">
            <DialogTitle className="text-2xl font-bold tracking-normal text-ink">Update registration</DialogTitle>
            <DialogDescription className="mt-1.5 text-sm font-light text-muted">
              Fix a typo or update your plate details.
            </DialogDescription>
          </div>
          <div>
            <Label className={labelClasses}>Registration Number <span className="text-m-red" aria-hidden="true">*</span></Label>
            <Input
              type="text"
              value={editReg}
              onChange={(e) => setEditReg(formatRegNumber(e.target.value))}
              maxLength={14}
              aria-required
              className={`${inputClasses} font-mono tracking-wider`}
            />
          </div>
          <Button onClick={handleEditSave} className="mt-8 flex h-auto w-full items-center justify-center gap-2 rounded-xl bg-yellow-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-all">
            Save Changes
          </Button>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => setDeleteId(open ? deleteId : null)}
        title="Remove Vehicle"
        description="Are you sure you want to remove this vehicle from your garage? This action cannot be undone."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={() => {
          if (deleteId) {
            const target = customerGarage.find((item) => item.id === deleteId);
            deleteCustomerVehicle(deleteId);
            toast.error("Vehicle removed", {
              description: target ? `${target.brand} ${target.model} has been removed from your garage.` : "Vehicle removed.",
            });
          }
          setDeleteId(null);
        }}
      />
    </div>
  );
}