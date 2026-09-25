"use client";
import { useState, useRef } from "react";
import { Tag, Layers, Boxes, Trash2, Edit, X, Download, Upload } from "lucide-react";
import { useStore } from "@/lib/store";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toCSV, downloadCSV, parseCSV } from "@/lib/csv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const POPULAR_BRANDS = [
  "Maruti Suzuki", "Hyundai", "Tata", "Mahindra", "Toyota", "Honda", "Kia",
  "Volkswagen", "Skoda", "Nissan", "BMW", "Mercedes-Benz", "Audi", "Renault", "Porsche"
];

type AddLevel = "CATEGORY" | "BRAND" | "MODEL";

type FlatRow = {
  key: string;
  catId: string;
  brandId?: string;
  modelId?: string;
  category: string;
  brand: string;
  model: string;
  dim: AddLevel;
};

export default function VehiclesPage() {

  const hierarchy = useStore((state) => state.vehicles);
  const addVehicleCategory = useStore((state) => state.addVehicleCategory);
  const addVehicleBrand = useStore((state) => state.addVehicleBrand);
  const addVehicleModel = useStore((state) => state.addVehicleModel);
  const deleteVehicleCategory = useStore((state) => state.deleteVehicleCategory);
  const deleteVehicleBrand = useStore((state) => state.deleteVehicleBrand);
  const deleteVehicleModel = useStore((state) => state.deleteVehicleModel);
  const updateVehicleCategory = useStore((state) => state.updateVehicleCategory);
  const updateVehicleBrand = useStore((state) => state.updateVehicleBrand);
  const updateVehicleModel = useStore((state) => state.updateVehicleModel);

  const [showImportModal, setShowImportModal] = useState(false);
  const [importError, setImportError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLevel, setAddLevel] = useState<AddLevel>("CATEGORY");
  const [newName, setNewName] = useState("");
  const [selectedParentCat, setSelectedParentCat] = useState("");
  const [selectedParentBrand, setSelectedParentBrand] = useState("");

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLevel, setEditLevel] = useState<AddLevel>("CATEGORY");
  const [editName, setEditName] = useState("");
  const [editIds, setEditIds] = useState<{ catId?: string, brandId?: string, modelId?: string }>({});

  const [pendingDelete, setPendingDelete] = useState<{ title: string; description: string; run: () => void } | null>(null);

  const rows: FlatRow[] = [];
  hierarchy.forEach(cat => {
    if (cat.brands.length === 0) {
      rows.push({ key: cat.id, catId: cat.id, category: cat.name, brand: "—", model: "—", dim: "CATEGORY" });
    } else {
      cat.brands.forEach(brand => {
        if (brand.models.length === 0) {
          rows.push({ key: brand.id, catId: cat.id, brandId: brand.id, category: cat.name, brand: brand.name, model: "—", dim: "BRAND" });
        } else {
          brand.models.forEach(model => {
            rows.push({ key: model.id, catId: cat.id, brandId: brand.id, modelId: model.id, category: cat.name, brand: brand.name, model: model.name, dim: "MODEL" });
          });
        }
      });
    }
  });

  const brandCount = hierarchy.reduce((n, c) => n + c.brands.length, 0);
  const modelCount = hierarchy.reduce((n, c) => n + c.brands.reduce((m, b) => m + b.models.length, 0), 0);

  const handleExport = () => {
    const flat: Array<{ Category: string; Brand: string; Model: string }> = [];
    hierarchy.forEach(cat => {
      if (cat.brands.length === 0) {
        flat.push({ Category: cat.name, Brand: "", Model: "" });
      } else {
        cat.brands.forEach(brand => {
          if (brand.models.length === 0) {
            flat.push({ Category: cat.name, Brand: brand.name, Model: "" });
          } else {
            brand.models.forEach(model => {
              flat.push({ Category: cat.name, Brand: brand.name, Model: model.name });
            });
          }
        });
      }
    });
    const csv = toCSV(flat, [
      { key: "Category", header: "Category" },
      { key: "Brand", header: "Brand" },
      { key: "Model", header: "Model" },
    ]);
    downloadCSV(`vehicles_${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  const handleImport = async (file: File) => {
    try {
      const rows = await parseCSV(file);
      if (rows.length < 2) { setImportError("CSV must have a header row and data."); return; }
      const header = rows[0].map(h => h.trim().toUpperCase());
      if (!header.includes("CATEGORY") || !header.includes("BRAND") || !header.includes("MODEL")) {
        setImportError("Missing columns: Category, Brand, Model");
        return;
      }
      const catIdx = header.indexOf("CATEGORY");
      const brandIdx = header.indexOf("BRAND");
      const modelIdx = header.indexOf("MODEL");

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const catName = row[catIdx]?.trim();
        const brandName = row[brandIdx]?.trim();
        const modelName = row[modelIdx]?.trim();
        if (!catName) continue;

        const existingCat = hierarchy.find(c => c.name === catName);
        if (existingCat) {
          if (brandName) {
            const existingBrand = existingCat.brands.find(b => b.name === brandName);
            if (existingBrand) {
              if (modelName) {
                if (!existingBrand.models.find(m => m.name === modelName)) {
                  addVehicleModel(existingCat.id, existingBrand.name, { id: `model_${Date.now()}_${i}`, name: modelName });
                }
              }
            } else {
              addVehicleBrand(existingCat.id, { id: `brand_${Date.now()}_${i}`, name: brandName, models: modelName ? [{ id: `model_${Date.now()}_${i}`, name: modelName }] : [] });
            }
          }
        } else {
          const newCat: { id: string; name: string; brands: Array<{ id: string; name: string; models: Array<{ id: string; name: string }> }> } = { id: `cat_${Date.now()}_${i}`, name: catName, brands: [] };
          if (brandName) {
            newCat.brands.push({ id: `brand_${Date.now()}_${i}`, name: brandName, models: modelName ? [{ id: `model_${Date.now()}_${i}`, name: modelName }] : [] });
          }
          addVehicleCategory(newCat);
        }
      }
      setShowImportModal(false);
      setImportError("");
    } catch {
      setImportError("Failed to parse CSV file.");
    }
  };

  const openAddModal = (level: AddLevel) => {
    setAddLevel(level);
    setNewName("");
    setSelectedParentCat("");
    setSelectedParentBrand("");
    setShowAddModal(true);
  };

  const handleAddItem = () => {
    if (!newName.trim()) return;
    if (addLevel === "CATEGORY") {
      addVehicleCategory({ id: `cat_${Date.now()}`, name: newName, brands: [] });
    } else if (addLevel === "BRAND" && selectedParentCat) {
      const parentCat = hierarchy.find(c => c.name === selectedParentCat);
      if (parentCat) addVehicleBrand(parentCat.id, { id: `brand_${Date.now()}`, name: newName, models: [] });
    } else if (addLevel === "MODEL" && selectedParentCat && selectedParentBrand) {
      const parentCat = hierarchy.find(c => c.name === selectedParentCat);
      if (parentCat) addVehicleModel(parentCat.id, selectedParentBrand, { id: `model_${Date.now()}`, name: newName });
    }
    setNewName(""); setSelectedParentCat(""); setSelectedParentBrand(""); setShowAddModal(false);
  };

  const openEditRow = (row: FlatRow) => {
    setEditLevel(row.dim);
    setEditName(row.dim === "MODEL" ? row.model : row.dim === "BRAND" ? row.brand : row.category);
    setEditIds({ catId: row.catId, brandId: row.brandId, modelId: row.modelId });
    setShowEditModal(true);
  };

  const confirmDeleteRow = (row: FlatRow) => {
    if (row.dim === "MODEL") {
      setPendingDelete({
        title: "Delete Model",
        description: `Delete "${row.model}"? This action cannot be undone.`,
        run: () => { if (row.brandId && row.modelId) deleteVehicleModel(row.catId, row.brandId, row.modelId); }
      });
    } else if (row.dim === "BRAND") {
      setPendingDelete({
        title: "Delete Brand",
        description: `Delete "${row.brand}" and all its models? This action cannot be undone.`,
        run: () => { if (row.brandId) deleteVehicleBrand(row.catId, row.brandId); }
      });
    } else {
      setPendingDelete({
        title: "Delete Category",
        description: `Delete "${row.category}" along with all its brands and models? This action cannot be undone.`,
        run: () => deleteVehicleCategory(row.catId)
      });
    }
  };

  const handleEditSave = () => {
    if (!editName.trim()) return;
    if (editLevel === "CATEGORY" && editIds.catId) {
      updateVehicleCategory(editIds.catId, editName);
    } else if (editLevel === "BRAND" && editIds.catId && editIds.brandId) {
      updateVehicleBrand(editIds.catId, editIds.brandId, editName);
    } else if (editLevel === "MODEL" && editIds.catId && editIds.brandId && editIds.modelId) {
      updateVehicleModel(editIds.catId, editIds.brandId, editIds.modelId, editName);
    }
    setShowEditModal(false);
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-yellow-dark focus:outline-none transition-colors appearance-none rounded-lg";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";
  const levelLabel = addLevel === "CATEGORY" ? "Category" : addLevel === "BRAND" ? "Brand" : "Model";

  return (
    <div className="p-6 md:p-12 relative">
      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">Add {levelLabel}</h3>
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => setShowAddModal(false)} className="text-muted hover:text-ink" aria-label="Close add form"><X size={20} /></Button>
            </div>

            {addLevel === "BRAND" && (
              <div className="mb-4">
                <label className={labelClasses}>Under which Category?</label>
                <Select value={selectedParentCat} onValueChange={(v) => setSelectedParentCat(v || "")}>
                  <SelectTrigger className={inputClasses}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {hierarchy.map(c => (
                      <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {addLevel === "MODEL" && (
              <>
                <div className="mb-4">
                  <label className={labelClasses}>Under which Category?</label>
                  <Select value={selectedParentCat} onValueChange={(v) => { setSelectedParentCat(v || ""); setSelectedParentBrand(""); }}>
                    <SelectTrigger className={inputClasses}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {hierarchy.map(c => (
                        <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedParentCat && (
                  <div className="mb-4">
                    <label className={labelClasses}>Under which Brand?</label>
                    <Select value={selectedParentBrand} onValueChange={(v) => setSelectedParentBrand(v || "")}>
                      <SelectTrigger className={inputClasses}>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...new Set([...POPULAR_BRANDS, ...hierarchy.find(c => c.name === selectedParentCat)?.brands.map(b => b.name) || []])].sort().map(b => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}

            <div className="mb-8">
              <label className={labelClasses}>Name</label>
              <Input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={addLevel === "CATEGORY" ? "e.g. SUV" : addLevel === "BRAND" ? "e.g. Toyota" : "e.g. Fortuner"} className={inputClasses} />
            </div>
            <Button type="button" onClick={handleAddItem} className="flex w-full items-center justify-center gap-2 bg-yellow-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light">Save {levelLabel}</Button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">Edit {editLevel === "CATEGORY" ? "Category" : editLevel === "BRAND" ? "Brand" : "Model"}</h3>
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => setShowEditModal(false)} className="text-muted hover:text-ink" aria-label="Close edit form"><X size={20} /></Button>
            </div>
            <div className="mb-8">
              <label className={labelClasses}>Name</label>
              <Input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className={inputClasses} />
            </div>
            <Button type="button" onClick={handleEditSave} className="flex w-full items-center justify-center gap-2 bg-yellow-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light">Save Changes</Button>
          </div>
        </div>
      )}

      {/* IMPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold uppercase text-ink">Import Vehicles</h3>
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => { setShowImportModal(false); setImportError(""); }} className="text-muted hover:text-ink" aria-label="Close import form"><X size={20} /></Button>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-light text-muted">Upload a CSV with columns: Category, Brand, Model.</p>
              <Input
                type="file"
                accept=".csv"
                ref={fileRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImport(file);
                }}
                className={inputClasses + " border-none bg-transparent p-0"}
              />
              {importError && <p className="text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 py-2 rounded-lg text-center">{importError}</p>}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-normal text-ink">Vehicle Master</h2>
          <p className="mt-2 text-sm font-light text-body">Manage the 3-tier Category → Brand → Model hierarchy.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={handleExport} className="flex items-center justify-center gap-2 border border-hairline bg-surface-card px-4 py-3 text-xs font-bold uppercase tracking-machined text-body hover:text-ink hover:bg-surface-elevated transition-colors">
            <Download size={14} /> Export
          </Button>
          <Button type="button" variant="outline" onClick={() => setShowImportModal(true)} className="flex items-center justify-center gap-2 border border-hairline bg-surface-card px-4 py-3 text-xs font-bold uppercase tracking-machined text-body hover:text-ink hover:bg-surface-elevated transition-colors">
            <Upload size={14} /> Import
          </Button>
          <Button type="button" onClick={() => openAddModal("CATEGORY")} className="flex items-center justify-center gap-2 bg-yellow-dark px-4 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-colors">
            <Tag size={14} /> Add Category
          </Button>
          <Button type="button" onClick={() => openAddModal("BRAND")} className="flex items-center justify-center gap-2 bg-yellow-dark px-4 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-colors">
            <Layers size={14} /> Add Brand
          </Button>
          <Button type="button" onClick={() => openAddModal("MODEL")} className="flex items-center justify-center gap-2 bg-yellow-dark px-4 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-colors">
            <Boxes size={14} /> Add Model
          </Button>
        </div>
      </div>

      <Card className="rounded-lg border border-hairline bg-surface-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg font-semibold">Vehicle Master</CardTitle>
            <CardDescription>{hierarchy.length} categories · {brandCount} brands · {modelCount} models</CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">{rows.length} rows</Badge>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center">
                      <p className="text-sm font-semibold text-ink">No vehicles added yet</p>
                      <p className="mt-1 text-xs text-muted-foreground">Use Add Category, Add Brand, or Add Model to build the hierarchy.</p>
                    </TableCell>
                  </TableRow>
                ) : rows.map((row) => (
                  <TableRow key={row.key}>
                    <TableCell className="font-semibold text-ink">{row.category}</TableCell>
                    <TableCell className={row.brand === "—" ? "text-muted-foreground" : "text-ink"}>{row.brand}</TableCell>
                    <TableCell className={row.model === "—" ? "text-muted-foreground" : "text-ink"}>{row.model}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button type="button" variant="ghost" size="icon-sm" onClick={() => openEditRow(row)} className="text-muted hover:text-ink" aria-label={`Edit ${row.dim === "MODEL" ? row.model : row.dim === "BRAND" ? row.brand : row.category}`}>
                          <Edit size={14} />
                        </Button>
                        <Button type="button" variant="ghost" size="icon-sm" onClick={() => confirmDeleteRow(row)} className="text-muted hover:text-m-red" aria-label={`Delete ${row.dim === "MODEL" ? row.model : row.dim === "BRAND" ? row.brand : row.category}`}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => setPendingDelete(open ? pendingDelete : null)}
        title={pendingDelete?.title ?? "Delete"}
        description={pendingDelete?.description ?? ""}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={() => {
          pendingDelete?.run();
          setPendingDelete(null);
        }}
      />
    </div>
  );
}