"use client";
import { useState } from "react";
import { Plus, Search, Edit, Trash2, X, Wrench } from "lucide-react";
import { useStore } from "@/lib/store";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

const vehicleCategories = ["Hatchback", "Sedan", "SUV", "Luxury"];

export default function ServicesPage() {

  const services = useStore((state) => state.services);
  const addService = useStore((state) => state.addService);
  const updateService = useStore((state) => state.updateService);
  const deleteService = useStore((state) => state.deleteService);

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [pricing, setPricing] = useState<Record<string, string>>({
    Hatchback: "", Sedan: "", SUV: "", Luxury: ""
  });


  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setIsEditing(false);
    setName(""); setDesc("");
    setPricing({ Hatchback: "", Sedan: "", SUV: "", Luxury: "" });
    setShowModal(true);
  };

  const openEditModal = (id: string, n: string, d: string, p: Record<string, number>) => {
    setIsEditing(true);
    setCurrentId(id);
    setName(n); setDesc(d);
    const stringPricing: Record<string, string> = {};
    vehicleCategories.forEach(cat => stringPricing[cat] = p[cat]?.toString() || "");
    setPricing(stringPricing);
    setShowModal(true);
  };

  const handlePricingChange = (category: string, value: string) => {
    setPricing(prev => ({ ...prev, [category]: value }));
  };

  const handleSaveService = () => {
    if (!name) return;
    const numericPricing: Record<string, number> = {};
    for (const [cat, priceStr] of Object.entries(pricing)) {
      numericPricing[cat] = Number(priceStr) || 0;
    }

    if (isEditing) {
      updateService(currentId, name, desc, numericPricing);
    } else {
      addService({ id: `s${Date.now()}`, name, description: desc, duration: 1, pricing: numericPricing });
    }
    setName(""); setDesc("");
    setPricing({ Hatchback: "", Sedan: "", SUV: "", Luxury: "" });
    setShowModal(false);
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-yellow-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="p-6 md:p-12 relative">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 overflow-y-auto py-10 p-4">
          <div className="w-full max-w-lg border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">{isEditing ? "Edit Service" : "Add Service & Pricing"}</h3>
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => setShowModal(false)} className="text-muted hover:text-ink" aria-label="Close service form"><X size={20} /></Button>
            </div>
            
            <div className="mb-6">
              <label className={labelClasses}>Service Name</label>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Premium Wash" className={inputClasses} />
            </div>
            <div className="mb-8">
              <label className={labelClasses}>Description</label>
              <Input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. Deep interior detailing" className={inputClasses} />
            </div>

            <label className={labelClasses}>Pricing by Vehicle Category (₹)</label>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {vehicleCategories.map(cat => (
                <Card key={cat} className="border border-hairline bg-surface-card p-4 gap-1 rounded-none ring-0 ring-transparent">
                  <p className="text-xs font-bold uppercase tracking-machined text-ink mb-2">{cat}</p>
                  <Input type="number" min="0" value={pricing[cat]} onChange={(e) => handlePricingChange(cat, e.target.value)} placeholder="0" className={inputClasses + " text-center"} />
                </Card>
              ))}
            </div>

            <Button type="button" onClick={handleSaveService} className="flex w-full items-center justify-center gap-2 bg-yellow-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light">
              {isEditing ? "Save Changes" : "Save Service"}
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-normal text-ink">Services & Pricing</h2>
          <p className="mt-2 text-sm font-light text-body">Define services and their category-specific prices.</p>
        </div>
        <Button type="button" onClick={openAddModal} className="flex items-center justify-center gap-2 bg-yellow-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-colors">
          <Plus size={14} /> Add Service
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-3 border border-hairline bg-surface-card p-3">
        <Search size={16} className="text-muted" />
        <Input type="text" placeholder="Search services..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={inputClasses + " border-none bg-transparent p-0 focus:outline-none"} />
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {filteredServices.map(s => (
          <Card key={s.id} className="border border-hairline bg-surface-card p-4 gap-3 rounded-none ring-0 ring-transparent">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-bold text-ink flex items-center gap-2"><Wrench size={14} className="text-muted" /> {s.name}</p>
                <p className="text-xs font-light text-muted mt-1">{s.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => openEditModal(s.id, s.name, s.description, s.pricing)} className="text-muted hover:text-ink transition-colors" aria-label={`Edit ${s.name}`}><Edit size={16} /></Button>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => setDeleteId(s.id)} className="text-muted hover:text-m-red transition-colors" aria-label={`Delete ${s.name}`}><Trash2 size={16} /></Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-hairline pt-3">
              {vehicleCategories.map(cat => (
                <div key={cat} className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-machined text-muted">{cat}</span>
                  <span className="text-xs font-bold text-yellow-dark">₹{s.pricing[cat] || 0}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block border border-hairline overflow-x-auto bg-surface-card">
        <Table className="w-full min-w-[800px]">
          <TableHeader className="border-b border-hairline bg-surface-soft">
            <TableRow>
              <TableHead className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Name</TableHead>
              <TableHead className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Desc</TableHead>
              {vehicleCategories.map(cat => (
                <TableHead key={cat} className="py-4 px-6 text-center text-xs font-bold uppercase tracking-machined text-muted">{cat} Price</TableHead>
              ))}
              <TableHead className="py-4 px-6 text-right text-xs font-bold uppercase tracking-machined text-muted">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map(s => (
              <TableRow key={s.id} className="border-b border-hairline last:border-none hover:bg-surface-elevated transition-colors">
                <TableCell className="py-4 px-6 text-sm font-bold text-ink">{s.name}</TableCell>
                <TableCell className="py-4 px-6 text-sm font-light text-body">{s.description}</TableCell>
                {vehicleCategories.map(cat => (
                  <TableCell key={cat} className="py-4 px-6 text-sm font-bold text-yellow-dark text-center">₹{s.pricing[cat] || 0}</TableCell>
                ))}
                <TableCell className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => openEditModal(s.id, s.name, s.description, s.pricing)} className="text-muted hover:text-ink transition-colors" aria-label={`Edit ${s.name}`}><Edit size={16} /></Button>
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => setDeleteId(s.id)} className="text-muted hover:text-m-red transition-colors" aria-label={`Delete ${s.name}`}><Trash2 size={16} /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => setDeleteId(open ? deleteId : null)}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={() => {
          if (deleteId) deleteService(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
