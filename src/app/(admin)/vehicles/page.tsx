"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, ChevronDown, ChevronRight, Trash2, Edit, X, Car, Sparkles, Download, Upload } from "lucide-react";
import { useStore } from "@/lib/store";
import { Disclosure, Accordion } from "@/components/ui/Disclosure";
import { StaggerContainer, StaggerItem } from "@/components/animations/PageTransition";
import { AnimatedSelect } from "@/components/ui/AnimatedSelect";
import { toCSV, downloadCSV, parseCSV } from "@/lib/csv";

const POPULAR_BRANDS = [
  "Maruti Suzuki", "Hyundai", "Tata", "Mahindra", "Toyota", "Honda", "Kia",
  "Volkswagen", "Skoda", "Nissan", "BMW", "Mercedes-Benz", "Audi", "Renault", "Porsche"
];

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

  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({});
  const [showImportModal, setShowImportModal] = useState(false);
  const [importError, setImportError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLevel, setAddLevel] = useState("CATEGORY");
  const [newName, setNewName] = useState("");
  const [selectedParentCat, setSelectedParentCat] = useState("");
  const [selectedParentBrand, setSelectedParentBrand] = useState("");

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLevel, setEditLevel] = useState<"CATEGORY" | "BRAND" | "MODEL">("CATEGORY");
  const [editName, setEditName] = useState("");
  const [editIds, setEditIds] = useState<{ catId?: string, brandId?: string, modelId?: string }>({});

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

  const handleAddItem = () => {
    if (!newName.trim()) return;
    if (addLevel === "CATEGORY") {
      addVehicleCategory({ id: `cat_${Date.now()}`, name: newName, brands: [] });
    } else if (addLevel === "BRAND" && selectedParentCat) {
      addVehicleBrand(selectedParentCat, { id: `brand_${Date.now()}`, name: newName, models: [] });
    } else if (addLevel === "MODEL" && selectedParentCat && selectedParentBrand) {
      addVehicleModel(selectedParentCat, selectedParentBrand, { id: `model_${Date.now()}`, name: newName });
    }
    setNewName(""); setSelectedParentCat(""); setSelectedParentBrand(""); setShowAddModal(false);
  };

  const openEditModal = (level: "CATEGORY" | "BRAND" | "MODEL", name: string, ids: { catId?: string, brandId?: string, modelId?: string }) => {
    setEditLevel(level);
    setEditName(name);
    setEditIds(ids);
    setShowEditModal(true);
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

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-yellow-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="p-6 md:p-12 relative">
      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">Add Vehicle Item</h3>
              <button onClick={() => setShowAddModal(false)} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>
            <div className="mb-4">
              <label className={labelClasses}>What are you adding?</label>
              <AnimatedSelect
                value={addLevel}
                onChange={(e) => { setAddLevel(e.target.value); setNewName(""); setSelectedParentCat(""); setSelectedParentBrand(""); }}
                label="What are you adding?"
                placeholder="Select level"
                options={[
                  { value: "CATEGORY", label: "Category (e.g. SUV)" },
                  { value: "BRAND", label: "Brand (e.g. Toyota)" },
                  { value: "MODEL", label: "Model (e.g. Fortuner)" }
                ]}
                className={inputClasses}
              />
            </div>

            {addLevel === "BRAND" && (
              <div className="mb-4">
                <label className={labelClasses}>Under which Category?</label>
                <AnimatedSelect
                  value={selectedParentCat}
                  onChange={(e) => setSelectedParentCat(e.target.value)}
                  label="Under which Category?"
                  placeholder="Select category"
                  options={hierarchy.map(c => ({ value: c.id, label: c.name }))}
                  className={inputClasses}
                />
              </div>
            )}

            {addLevel === "MODEL" && (
              <>
                <div className="mb-4">
                  <label className={labelClasses}>Under which Category?</label>
                  <AnimatedSelect
                    value={selectedParentCat}
                    onChange={(e) => { setSelectedParentCat(e.target.value); setSelectedParentBrand(""); }}
                    label="Under which Category?"
                    placeholder="Select category"
                    options={hierarchy.map(c => ({ value: c.id, label: c.name }))}
                    className={inputClasses}
                  />
                </div>
                {selectedParentCat && (
                  <div className="mb-4">
                    <label className={labelClasses}>Under which Brand?</label>
                    <AnimatedSelect
                      value={selectedParentBrand}
                      onChange={(e) => setSelectedParentBrand(e.target.value)}
                      label="Under which Brand?"
                      placeholder="Select brand"
                      options={[...new Set([...POPULAR_BRANDS, ...hierarchy.find(c => c.id === selectedParentCat)?.brands.map(b => b.name) || []])].sort().map(b => ({ value: b, label: b }))}
                      className={inputClasses}
                    />
                  </div>
                )}
              </>
            )}

            <div className="mb-8">
              <label className={labelClasses}>Name</label>
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Fortuner" className={inputClasses} />
            </div>
            <button onClick={handleAddItem} className="flex w-full items-center justify-center gap-2 bg-yellow-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light">Save Item</button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">Edit {editLevel}</h3>
              <button onClick={() => setShowEditModal(false)} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>
            <div className="mb-8">
              <label className={labelClasses}>Name</label>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className={inputClasses} />
            </div>
            <button onClick={handleEditSave} className="flex w-full items-center justify-center gap-2 bg-yellow-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light">Save Changes</button>
          </div>
        </div>
      )}

      {/* IMPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold uppercase text-ink">Import Vehicles</h3>
              <button onClick={() => { setShowImportModal(false); setImportError(""); }} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-light text-muted">Upload a CSV with columns: Category, Brand, Model.</p>
              <input
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
        <div className="flex gap-3">
          <button onClick={handleExport} className="flex items-center justify-center gap-2 border border-hairline bg-surface-card px-4 py-3 text-xs font-bold uppercase tracking-machined text-body hover:text-ink hover:bg-surface-elevated transition-colors">
            <Download size={14} /> Export Vehicles
          </button>
          <button onClick={() => setShowImportModal(true)} className="flex items-center justify-center gap-2 border border-hairline bg-surface-card px-4 py-3 text-xs font-bold uppercase tracking-machined text-body hover:text-ink hover:bg-surface-elevated transition-colors">
            <Upload size={14} /> Import Vehicles
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center justify-center gap-2 bg-yellow-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-colors">
            <Plus size={14} /> Add Item
          </button>
        </div>
      </div>

      {/* MOBILE ACCORDION CARDS */}
      <div className="md:hidden space-y-4">
        <AnimatePresence mode="popLayout">
          {hierarchy.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border border-hairline bg-surface-card"
            >
              <div className="flex items-center justify-between p-4 w-full hover:bg-surface-elevated transition-colors">
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  aria-expanded={isOpen[cat.id] ? "true" : "false"}
                  onClick={() => setIsOpen(prev => ({ ...prev, [cat.id]: !prev[cat.id] }))}
                >
                  <Car size={18} className="text-yellow-400 shrink-0" />
                  <p className="text-lg font-bold uppercase text-ink">{cat.name}</p>
                  <motion.div
                    animate={{ rotate: isOpen[cat.id] ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                  >
                    {isOpen[cat.id] ? <ChevronDown size={16} className="text-ink" /> : <ChevronRight size={16} className="text-muted" />}
                  </motion.div>
                </button>
                <div className="flex shrink-0 gap-3">
                  <button type="button" onClick={() => openEditModal("CATEGORY", cat.name, { catId: cat.id })} className="text-muted hover:text-ink" aria-label={`Edit ${cat.name}`}><Edit size={16} /></button>
                  <button type="button" onClick={() => deleteVehicleCategory(cat.id)} className="text-muted hover:text-m-red" aria-label={`Delete ${cat.name}`}><Trash2 size={16} /></button>
                </div>
              </div>

              <AnimatePresence>
                {isOpen[cat.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{ overflow: "hidden" }}
                    className="border-t border-hairline bg-surface-soft p-4 space-y-3"
                  >
                    {cat.brands.length === 0 ? (
                      <p className="text-xs font-light text-muted text-center py-4">No brands added yet.</p>
                    ) : (
                      <StaggerContainer stagger={0.05} className="space-y-3">
                        {cat.brands.map(brand => (
                          <StaggerItem key={brand.id}>
                            <motion.div
                              layout
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.2 }}
                              className="border border-hairline bg-surface-card p-3"
                            >
                              <Disclosure
                                trigger={
                                  <div className="flex min-w-0 items-center gap-2">
                                    <Sparkles size={14} className="text-yellow-400/50 shrink-0" />
                                    <p className="text-sm font-bold text-ink">{brand.name}</p>
                                  </div>
                                }
                                actions={
                                  <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => openEditModal("BRAND", brand.name, { catId: cat.id, brandId: brand.id })} className="text-muted hover:text-ink" aria-label={`Edit ${brand.name}`}><Edit size={14} /></button>
                                    <button type="button" onClick={() => deleteVehicleBrand(cat.id, brand.id)} className="text-muted hover:text-m-red" aria-label={`Delete ${brand.name}`}><Trash2 size={14} /></button>
                                  </div>
                                }
                                content={
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                                    style={{ overflow: "hidden" }}
                                  >
                                    <div className="px-4 pb-3 space-y-2">
                                      {brand.models.map((model, modelIndex) => (
                                        <motion.div
                                          key={model.id}
                                          initial={{ opacity: 0, x: 20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          exit={{ opacity: 0, x: -20 }}
                                          transition={{ duration: 0.2, delay: modelIndex * 0.03 }}
                                          className="border-t border-hairline bg-surface-soft pl-8"
                                        >
                                          <div className="flex items-center justify-between p-2">
                                            <p className="text-xs font-light text-body">{model.name}</p>
                                            <div className="flex gap-3">
                                              <button onClick={() => openEditModal("MODEL", model.name, { catId: cat.id, brandId: brand.id, modelId: model.id })} className="text-muted hover:text-ink"><Edit size={12} /></button>
                                              <button onClick={() => deleteVehicleModel(cat.id, brand.id, model.id)} className="text-muted hover:text-m-red"><Trash2 size={12} /></button>
                                            </div>
                                          </div>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </motion.div>
                                }
                              />
                            </motion.div>
                          </StaggerItem>
                        ))}
                      </StaggerContainer>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* DESKTOP TREE TABLE */}
      <div className="hidden md:block border border-hairline bg-surface-card">
        <AnimatePresence mode="popLayout">
          <Accordion
            items={hierarchy.map((cat, index) => ({
              key: cat.id,
              title: (
                <motion.div
                  layout
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Car size={18} className="text-yellow-400" />
                  <span className="text-lg font-bold uppercase text-ink">{cat.name}</span>
                </motion.div>
              ),
              actions: (
                <div className="flex gap-3">
                  <button type="button" onClick={() => openEditModal("CATEGORY", cat.name, { catId: cat.id })} className="text-muted hover:text-ink transition-colors" aria-label={`Edit ${cat.name}`}><Edit size={16} /></button>
                  <button type="button" onClick={() => deleteVehicleCategory(cat.id)} className="text-muted hover:text-m-red transition-colors" aria-label={`Delete ${cat.name}`}><Trash2 size={16} /></button>
                </div>
              ),
              content: (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="pl-4 space-y-3"
                >
                  {cat.brands.length === 0 ? (
                    <p className="text-xs font-light text-muted py-4">No brands added yet.</p>
                  ) : (
                    <StaggerContainer stagger={0.05} delay={0.05}>
                      {cat.brands.map(brand => (
                        <StaggerItem key={brand.id} delay={0.02}>
                          <div key={brand.id} className="border-t border-hairline bg-surface-soft first:border-none">
                            <Disclosure
                              trigger={
                                <div className="flex min-w-0 items-center gap-2">
                                  <Sparkles size={14} className="text-yellow-400/50 shrink-0" />
                                  <span className="text-sm font-bold text-ink">{brand.name}</span>
                                </div>
                              }
                              actions={
                                <div className="flex items-center gap-2">
                                  <button type="button" onClick={() => openEditModal("BRAND", brand.name, { catId: cat.id, brandId: brand.id })} className="text-muted hover:text-ink transition-colors" aria-label={`Edit ${brand.name}`}><Edit size={14} /></button>
                                  <button type="button" onClick={() => deleteVehicleBrand(cat.id, brand.id)} className="text-muted hover:text-m-red transition-colors" aria-label={`Delete ${brand.name}`}><Trash2 size={14} /></button>
                                </div>
                              }
                              content={
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                                  style={{ overflow: "hidden" }}
                                >
                                  <div className="px-4 pb-3 space-y-2">
                                    {brand.models.map((model, modelIndex) => (
                                      <motion.div
                                        key={model.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2, delay: modelIndex * 0.03 }}
                                        className="border-t border-hairline bg-surface-soft pl-8"
                                      >
                                        <div className="flex items-center justify-between p-2">
                                          <p className="text-xs font-light text-body">{model.name}</p>
                                          <div className="flex gap-3">
                                            <button onClick={() => openEditModal("MODEL", model.name, { catId: cat.id, brandId: brand.id, modelId: model.id })} className="text-muted hover:text-ink transition-colors"><Edit size={12} /></button>
                                            <button onClick={() => deleteVehicleModel(cat.id, brand.id, model.id)} className="text-muted hover:text-m-red transition-colors"><Trash2 size={12} /></button>
                                          </div>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                </motion.div>
                              }
                            />
                          </div>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  )}
                </motion.div>
              ),
            }))}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

