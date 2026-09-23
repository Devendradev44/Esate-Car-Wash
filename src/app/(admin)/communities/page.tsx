"use client";
import { useState } from "react";
import { Plus, Search, Edit, Trash2, EyeOff, Eye, X, MapPin, Building2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CommunitiesPage() {

  const communities = useStore((state) => state.communities);
  const addCommunity = useStore((state) => state.addCommunity);
  const updateCommunityStatus = useStore((state) => state.updateCommunityStatus);
  const deleteCommunity = useStore((state) => state.deleteCommunity);
  const updateCommunity = useStore((state) => state.updateCommunity);

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [slotCapacity, setSlotCapacity] = useState("1");
  const [timeRangeStart, setTimeRangeStart] = useState("09:00");
  const [timeRangeEnd, setTimeRangeEnd] = useState("18:00");
  const [deleteId, setDeleteId] = useState<string | null>(null);


  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    const currentStatus = communities.find(c => c.id === id)?.status;
    const newStatus = currentStatus === "ACTIVE" ? "HIDDEN" : "ACTIVE";
    updateCommunityStatus(id, newStatus);
  };

  const openAddModal = () => {
    setIsEditing(false);
    setNewName(""); setNewAddress(""); setSlotCapacity("1");
    setShowModal(true);
  };

  const openEditModal = (id: string, name: string, address: string, capacity: number, timeRange?: { start: string; end: string }) => {
    setIsEditing(true);
    setCurrentId(id);
    setNewName(name); setNewAddress(address);
    setSlotCapacity(capacity.toString());
    setTimeRangeStart(timeRange?.start || "09:00");
    setTimeRangeEnd(timeRange?.end || "18:00");
    setShowModal(true);
  };

  const handleSaveCommunity = () => {
    if (!newName || !newAddress) return;
    if (isEditing) {
      updateCommunity(currentId, newName, newAddress, Number(slotCapacity), { start: timeRangeStart, end: timeRangeEnd });
    } else {
      addCommunity({ id: `c${Date.now()}`, name: newName, address: newAddress, status: "ACTIVE", slotCapacity: Number(slotCapacity), timeRange: { start: timeRangeStart, end: timeRangeEnd } });
    }
    setNewName(""); setNewAddress(""); setSlotCapacity("1");
    setTimeRangeStart("09:00"); setTimeRangeEnd("18:00");
    setShowModal(false);
  };

  const inputClasses = "h-auto w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-yellow-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="p-6 md:p-12 relative">
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent showCloseButton={false} className="w-full max-w-md sm:max-w-md border border-hairline bg-surface-soft p-8">
          <DialogHeader className="flex flex-row items-center justify-between mb-8">
            <DialogTitle className="text-xl font-bold uppercase text-ink">{isEditing ? "Edit Community" : "Add Community"}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowModal(false)} className="text-muted hover:text-ink"><X size={20} /></Button>
          </DialogHeader>
          <DialogDescription className="sr-only">
            {isEditing ? "Update the community details below." : "Add a new gated community."}
          </DialogDescription>
          <div className="mb-4">
            <Label htmlFor="community-name" className={labelClasses}>Community Name</Label>
            <Input id="community-name" type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Adarsh Palm Retreat" className={inputClasses} />
          </div>
          <div className="mb-4">
            <Label htmlFor="community-address" className={labelClasses}>Address</Label>
            <Input id="community-address" type="text" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="e.g. Bellandur, Bangalore" className={inputClasses} />
          </div>
          <div className="mb-8">
            <Label htmlFor="slot-capacity" className={labelClasses}>Slot Capacity (Max 10 cars per slot)</Label>
            <Input 
              id="slot-capacity"
              type="number" 
              min="1" 
              max="10" 
              value={slotCapacity} 
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                if (val === '') {
                  setSlotCapacity('');
                } else if (Number(val) > 10) {
                  setSlotCapacity("10");
                } else {
                  setSlotCapacity(val);
                }
              }} 
              placeholder="e.g. 2" 
              className={inputClasses} 
            />
          </div>
          <div className="mb-8">
            <Label htmlFor="start-time" className={labelClasses}>Start Time</Label>
            <Input 
              id="start-time"
              type="time" 
              value={timeRangeStart} 
              onChange={(e) => setTimeRangeStart(e.target.value)} 
              className={inputClasses} 
            />
          </div>
          <div className="mb-8">
            <Label htmlFor="end-time" className={labelClasses}>End Time</Label>
            <Input 
              id="end-time"
              type="time" 
              value={timeRangeEnd} 
              onChange={(e) => setTimeRangeEnd(e.target.value)} 
              className={inputClasses} 
            />
          </div>
          <Button onClick={handleSaveCommunity} className="flex h-auto w-full items-center justify-center gap-2 bg-yellow-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light">
            {isEditing ? "Save Changes" : "Save Community"}
          </Button>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-normal text-ink">Communities</h2>
          <p className="mt-2 text-sm font-light text-body">Manage gated communities and their visibility.</p>
        </div>
        <Button onClick={openAddModal} className="flex h-auto items-center justify-center gap-2 bg-yellow-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-colors">
          <Plus size={14} /> Add Community
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-3 border border-hairline bg-surface-card p-3">
        <Search size={16} className="text-muted" />
        <Input type="text" placeholder="Search communities..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-auto min-w-0 flex-1 border-none bg-transparent p-0 focus:outline-none" />
      </div>

      <div className="md:hidden space-y-4">
        {filteredCommunities.map(c => (
          <div key={c.id} className="border border-hairline bg-surface-card p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-yellow-dark" />
                <p className="text-lg font-bold text-ink">{c.name}</p>
              </div>
              <Badge variant="ghost" className={`text-[10px] font-bold uppercase tracking-machined px-2 py-1 ${c.status === "ACTIVE" ? "bg-success/20 text-success" : "bg-surface-elevated text-muted"}`}>
                {c.status}
              </Badge>
            </div>
            <p className="text-xs font-light text-muted mb-2 flex items-center gap-2"><MapPin size={12} /> {c.address}</p>
            <p className="text-xs font-bold text-yellow-dark mb-4">Capacity: {c.slotCapacity} cars/slot{c.timeRange ? ` · ${c.timeRange.start} - ${c.timeRange.end}` : ""}</p>
            <div className="flex items-center justify-end gap-4 border-t border-hairline pt-3">
              <Button variant="ghost" size="icon" onClick={() => openEditModal(c.id, c.name, c.address, c.slotCapacity, c.timeRange)} className="text-muted hover:text-ink transition-colors"><Edit size={16} /></Button>
              <Button variant="ghost" size="icon" onClick={() => toggleStatus(c.id)} className="text-muted hover:text-warning transition-colors">
                {c.status === "ACTIVE" ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setDeleteId(c.id)} className="text-muted hover:text-m-red transition-colors"><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block border border-hairline overflow-x-auto bg-surface-card">
        <Table className="min-w-[600px]">
          <TableHeader className="border-b border-hairline bg-surface-soft">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-auto py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Name</TableHead>
              <TableHead className="h-auto py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Address</TableHead>
              <TableHead className="h-auto py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Time Range</TableHead>
              <TableHead className="h-auto py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Capacity</TableHead>
              <TableHead className="h-auto py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Status</TableHead>
              <TableHead className="h-auto py-4 px-6 text-right text-xs font-bold uppercase tracking-machined text-muted">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCommunities.map(c => (
              <TableRow key={c.id} className="border-b border-hairline last:border-none hover:bg-surface-elevated transition-colors">
                <TableCell className="py-4 px-6 text-sm font-bold text-ink">{c.name}</TableCell>
                <TableCell className="py-4 px-6 text-sm font-light text-body">{c.address}</TableCell>
                <TableCell className="py-4 px-6 text-sm font-bold text-yellow-dark">{c.timeRange ? `${c.timeRange.start} - ${c.timeRange.end}` : "—"}</TableCell>
                <TableCell className="py-4 px-6 text-sm font-bold text-yellow-dark">{c.slotCapacity} cars/slot</TableCell>
                <TableCell className="py-4 px-6">
                  <Badge variant="ghost" className={`text-xs font-bold uppercase tracking-machined px-2 py-1 ${c.status === "ACTIVE" ? "text-success" : "text-muted"}`}>
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(c.id, c.name, c.address, c.slotCapacity, c.timeRange)} className="text-muted hover:text-ink transition-colors"><Edit size={16} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => toggleStatus(c.id)} className="text-muted hover:text-warning transition-colors">
                      {c.status === "ACTIVE" ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(c.id)} className="text-muted hover:text-m-red transition-colors"><Trash2 size={16} /></Button>
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
        title="Delete Community"
        description="Are you sure you want to delete this community? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={() => {
          if (deleteId) deleteCommunity(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}