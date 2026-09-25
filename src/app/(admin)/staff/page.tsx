"use client";
import { useState } from "react";
import { Plus, Trash2, X, User, Phone, KeyRound, Edit } from "lucide-react";
import { useStore } from "@/lib/store";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

export default function StaffPage() {

  const staff = useStore((state) => state.staff);
  const communities = useStore((state) => state.communities);
  const addStaff = useStore((state) => state.addStaff);
  const updateStaff = useStore((state) => state.updateStaff);
  const deleteStaff = useStore((state) => state.deleteStaff);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [community, setCommunity] = useState("");
  const [pin, setPin] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [sharedPin, setSharedPin] = useState("");
  const [sharedName, setSharedName] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copy PIN");
  const [formError, setFormError] = useState("");

  const genPin = () => String(Math.floor(100000 + Math.random() * 900000));
  const genUniquePin = () => {
    const used = new Set(staff.map(s => s.pin));
    let candidate = genPin();
    let guard = 0;
    while (used.has(candidate) && guard < 1000) {
      candidate = genPin();
      guard += 1;
    }
    return candidate;
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormError("");
    setName(""); setPhone(""); setCommunity("");
    setPin(genUniquePin());
    setShowModal(true);
  };

  const openEditModal = (id: string, n: string, p: string, c: string) => {
    setIsEditing(true);
    setFormError("");
    setCurrentId(id);
    setName(n); setPhone(p); setCommunity(c);
    setShowModal(true);
  };

  const handleSaveStaff = () => {
    setFormError("");
    if (!name.trim()) { setFormError("Full name is required."); return; }
    if (phone.length !== 10) { setFormError("Enter a valid 10-digit phone number."); return; }
    if (!community) { setFormError("Assign the staff member to a community."); return; }
    if (staff.some(s => s.phone === phone && s.id !== currentId)) { setFormError("Another staff member already uses this phone number."); return; }
    if (isEditing) {
      updateStaff(currentId, { name: name.trim(), phone, community });
      setName(""); setPhone(""); setCommunity("");
      setShowModal(false);
      return;
    }
    addStaff({ id: `st_${Date.now()}`, name: name.trim(), phone, community, pin, status: "ACTIVE", role: "STAFF" });
    setSharedPin(pin);
    setSharedName(name.trim());
    setName(""); setPhone(""); setCommunity(""); setPin("");
    setShowModal(false);
    setShowShare(true);
  };

  const copyPin = async () => {
    try {
      await navigator.clipboard.writeText(sharedPin);
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy PIN"), 1500);
    } catch {
      setCopyLabel("Copy failed — select the PIN manually");
    }
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-yellow-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="p-6 md:p-12 relative">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">{isEditing ? "Edit Staff Member" : "Add Staff Member"}</h3>
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => setShowModal(false)} className="text-muted hover:text-ink" aria-label="Close staff form"><X size={20} /></Button>
            </div>
            <div className="mb-4">
              <label className={labelClasses}>Full Name</label>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ramesh Kumar" className={inputClasses} />
            </div>
            <div className="mb-4">
              <label className={labelClasses}>Phone Number</label>
              <Input type="tel" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="9876543210" className={inputClasses} />
            </div>
            <div className="mb-8">
              <label className={labelClasses}>Assign Community</label>
              <Select value={community} onValueChange={(v) => setCommunity(v || "")}>
                <SelectTrigger className={inputClasses}>
                  <SelectValue placeholder="Select community" />
                </SelectTrigger>
                <SelectContent>
                  {communities.map(c => (
                    <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!isEditing && (
              <div className="mb-8">
                <label className={labelClasses}>Generated PIN</label>
                <div className="flex items-center gap-3">
                  <span className="flex h-12 flex-1 items-center justify-center rounded-lg border border-dashed border-yellow-dark bg-yellow-dark/10 px-4 text-xl font-bold tracking-[0.4em] text-yellow-dark">
                    {pin}
                  </span>
                  <Button type="button" variant="outline" onClick={() => setPin(genUniquePin())} className="h-12 rounded-lg border border-hairline bg-surface-card px-4 text-xs font-bold uppercase tracking-machined text-ink hover:border-yellow-dark hover:bg-surface-elevated transition-colors">
                    Regenerate
                  </Button>
                </div>
                <p className="mt-2 text-[10px] font-light text-muted">This is a unique 6-digit PIN. Share it with the staff member — they use it to sign in on the staff portal.</p>
              </div>
            )}
            {formError && <p className="mb-6 text-xs font-semibold text-m-red bg-m-red/10 border border-m-red/20 py-2 rounded-lg text-center">{formError}</p>}
            <Button type="button" onClick={handleSaveStaff} className="flex w-full items-center justify-center gap-2 bg-yellow-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light">
              {isEditing ? "Save Changes" : "Generate PIN & Save"}
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-normal text-ink">Staff Management</h2>
          <p className="mt-2 text-sm font-light text-body">Create staff accounts and assign communities.</p>
        </div>
        <Button type="button" onClick={openAddModal} className="flex items-center justify-center gap-2 bg-yellow-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-colors">
          <Plus size={14} /> Add Staff
        </Button>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {staff.map(s => (
          <Card key={s.id} className="border border-hairline bg-surface-card p-4 gap-3 rounded-lg ring-0 ring-transparent">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-bold text-ink flex items-center gap-2"><User size={14} className="text-muted" /> {s.name}</p>
                <p className="text-xs font-light text-muted mt-1 flex items-center gap-2"><Phone size={12} /> {s.phone}</p>
              </div>
              <span className="text-xs font-bold text-yellow-dark flex items-center gap-1"><KeyRound size={12} /> {s.pin}</span>
            </div>
            <p className="text-xs font-light text-body">Community: {s.community}</p>
            <div className="flex items-center justify-between border-t border-hairline pt-3">
              <Badge variant="ghost" className={`text-[10px] font-bold uppercase tracking-machined px-2 py-1 ${s.status === "ACTIVE" ? "text-success" : "text-muted"}`}>
                {s.status}
              </Badge>
              <div className="flex items-center justify-end gap-4">
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => openEditModal(s.id, s.name, s.phone, s.community)} className="text-muted hover:text-ink transition-colors" aria-label={`Edit ${s.name}`}><Edit size={16} /></Button>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => setDeleteId(s.id)} className="text-muted hover:text-m-red transition-colors" aria-label={`Delete ${s.name}`}><Trash2 size={16} /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block border border-hairline overflow-x-auto rounded-lg bg-surface-card">
        <Table className="w-full min-w-[800px]">
          <TableHeader className="border-b border-hairline bg-surface-soft">
            <TableRow>
              <TableHead className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Name</TableHead>
              <TableHead className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Phone</TableHead>
              <TableHead className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Community</TableHead>
              <TableHead className="py-4 px-6 text-center text-xs font-bold uppercase tracking-machined text-muted">PIN</TableHead>
              <TableHead className="py-4 px-6 text-center text-xs font-bold uppercase tracking-machined text-muted">Status</TableHead>
              <TableHead className="py-4 px-6 text-right text-xs font-bold uppercase tracking-machined text-muted">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map(s => (
              <TableRow key={s.id} className="border-b border-hairline last:border-none hover:bg-surface-elevated transition-colors">
                <TableCell className="py-4 px-6 text-sm font-bold text-ink"><div className="flex items-center gap-2"><User size={14} className="text-muted"/> {s.name}</div></TableCell>
                <TableCell className="py-4 px-6 text-sm font-light text-body"><div className="flex items-center gap-2"><Phone size={14} className="text-muted"/> {s.phone}</div></TableCell>
                <TableCell className="py-4 px-6 text-sm font-light text-body">{s.community}</TableCell>
                <TableCell className="py-4 px-6 text-sm font-bold text-yellow-dark text-center"><div className="flex items-center justify-center gap-1"><KeyRound size={12} /> {s.pin}</div></TableCell>
                <TableCell className="py-4 px-6 text-center">
                  <Badge variant="ghost" className={`text-xs font-bold uppercase tracking-machined px-2 py-1 ${s.status === "ACTIVE" ? "text-success" : "text-muted"}`}>
                    {s.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => openEditModal(s.id, s.name, s.phone, s.community)} className="text-muted hover:text-ink transition-colors" aria-label={`Edit ${s.name}`}><Edit size={16} /></Button>
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => setDeleteId(s.id)} className="text-muted hover:text-m-red transition-colors" aria-label={`Delete ${s.name}`}><Trash2 size={16} /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showShare && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm rounded-lg border border-hairline bg-surface-soft p-8 text-center">
            <div className="mb-4">
              <h3 className="text-xl font-bold uppercase text-ink">Staff added</h3>
              <p className="mt-1 text-sm font-light text-body">{sharedName || "Staff member"} can now sign in on the staff portal.</p>
            </div>
            <div className="mb-6">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-machined text-muted">Sign-in PIN</p>
              <p className="rounded-lg border border-dashed border-yellow-dark bg-yellow-dark/10 py-3 text-2xl font-bold tracking-[0.4em] text-yellow-dark" data-testid="generated-pin">{sharedPin}</p>
            </div>
            <div className="flex gap-3">
              <Button type="button" onClick={copyPin} className="flex flex-1 items-center justify-center gap-2 bg-yellow-dark py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-colors">
                {copyLabel}
              </Button>
              <Button type="button" variant="outline" onClick={() => { setShowShare(false); setCopyLabel("Copy PIN"); }} className="flex flex-1 items-center justify-center gap-2 border border-hairline bg-surface-card py-3 text-xs font-bold uppercase tracking-machined text-body hover:text-ink transition-colors">
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => setDeleteId(open ? deleteId : null)}
        title="Delete Staff Member"
        description="Are you sure you want to delete this staff member? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={() => {
          if (deleteId) deleteStaff(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
