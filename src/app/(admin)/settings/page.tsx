"use client";
import { useState } from "react";
import { Trash2, X, UserPlus, Shield, Mail, Settings, ChevronDown, ChevronUp, Check, Clock } from "lucide-react";
import { useStore, mockHash } from "@/lib/store";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ALL_PERMISSIONS = [
  { key: "bookings", label: "Bookings", icon: Shield },
  { key: "staff", label: "Staff", icon: UserPlus },
  { key: "finance", label: "Finance", icon: Mail },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "vehicles", label: "Vehicles", icon: Shield },
  { key: "services", label: "Services", icon: Shield },
  { key: "communities", label: "Communities", icon: Shield },
  { key: "expenses", label: "Expenses", icon: Shield },
] as const;

type PermissionKey = typeof ALL_PERMISSIONS[number]["key"];

export default function AdminManagement() {
  const admins = useStore((state) => state.admins);
  const addAdmin = useStore((state) => state.addAdmin);
  const updateAdmin = useStore((state) => state.updateAdmin);
  const deleteAdmin = useStore((state) => state.deleteAdmin);
  const communities = useStore((state) => state.communities);
  const updateCommunityTimeRange = useStore((state) => state.updateCommunityTimeRange);
  const currentUser = useStore((state) => state.mockUser);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<typeof admins[0] | null>(null);
  
  // Form state
  const [formEmail, setFormEmail] = useState("");
  const [formName, setFormName] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formPermissions, setFormPermissions] = useState<PermissionKey[]>([]);
  const [formStatus, setFormStatus] = useState<"ACTIVE" | "DISABLED">("ACTIVE");
  const [error, setError] = useState("");
  const [expandedAdmin, setExpandedAdmin] = useState<string | null>(null);
  const [showTimeRangeModal, setShowTimeRangeModal] = useState(false);
  const [editingCommunityId, setEditingCommunityId] = useState("");
  const [timeRangeStart, setTimeRangeStart] = useState("");
  const [timeRangeEnd, setTimeRangeEnd] = useState("");
  const [timeRangeError, setTimeRangeError] = useState("");
  const [deleteAdminId, setDeleteAdminId] = useState<string | null>(null);

  const isSuperAdmin = (admin: typeof admins[0]) => admin.id === "admin_1";
  const currentUserId = currentUser?.id;
  const isCurrentUserSuperAdmin = currentUserId === "admin_1";
  const canModify = (admin: typeof admins[0]) => currentUser?.role === "ADMIN" && (isCurrentUserSuperAdmin || admin.id === currentUserId);

  const resetForm = () => {
    setFormEmail("");
    setFormName("");
    setFormPassword("");
    setFormPermissions([]);
    setFormStatus("ACTIVE");
    setError("");
  };

  const openAddModal = () => {
    setEditMode(false);
    setEditingAdmin(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (admin: typeof admins[0]) => {
    setEditMode(true);
    setEditingAdmin(admin);
    setFormEmail(admin.email);
    setFormName(admin.name);
    setFormPassword("");
    setFormPermissions(admin.permissions);
    setFormStatus(admin.status);
    setError("");
    setShowModal(true);
  };

  const handlePermissionToggle = (perm: PermissionKey) => {
    setFormPermissions(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const validateForm = () => {
    if (!formEmail.includes("@") || !formEmail.includes(".")) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!formName.trim()) {
      setError("Please enter admin name.");
      return false;
    }
    if (!editMode && formPassword.length < 4) {
      setError("Password must be at least 4 characters.");
      return false;
    }
    if (editMode && formPassword && formPassword.length < 4) {
      setError("Password must be at least 4 characters.");
      return false;
    }
    if (formPermissions.length === 0) {
      setError("Select at least one permission.");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editMode && editingAdmin) {
      const updates: Partial<typeof admins[0]> = {
        email: formEmail,
        name: formName,
        permissions: formPermissions,
        status: formStatus,
      };
      if (formPassword) {
        updates.passwordHash = mockHash(formPassword);
      }
      updateAdmin(editingAdmin.id, updates);
    } else {
      const passwordHash = mockHash(formPassword);
      addAdmin({
        email: formEmail,
        name: formName,
        passwordHash,
        permissions: formPermissions,
        status: formStatus,
        invitedBy: currentUser?.id || "System",
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (id === "admin_1") {
      setError("Cannot delete super admin.");
      return;
    }
    setDeleteAdminId(id);
  };

  const toggleExpand = (id: string) => {
    setExpandedAdmin(prev => prev === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const timeToMinutes = (value: string) => {
    const [hours, minutes] = value.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    return hours * 60 + minutes;
  };

  // Community Time Range Functions
  const openTimeRangeModal = (communityId: string) => {
    const community = communities.find(c => c.id === communityId);
    setEditingCommunityId(communityId);
    setTimeRangeStart(community?.timeRange?.start || "09:00");
    setTimeRangeEnd(community?.timeRange?.end || "18:00");
    setTimeRangeError("");
    setShowTimeRangeModal(true);
  };

  const validateTimeRange = () => {
    const startM = timeToMinutes(timeRangeStart);
    const endM = timeToMinutes(timeRangeEnd);
    if (startM === null || endM === null) {
      setTimeRangeError("Please enter valid start and end times.");
      return false;
    }
    if (startM >= endM) {
      setTimeRangeError("Start time must be before end time.");
      return false;
    }
    if (startM < 9 * 60 || startM > 21 * 60) {
      setTimeRangeError("Start time must be between 09:00 and 21:00.");
      return false;
    }
    if (endM <= startM || endM > 21 * 60 + 30) {
      setTimeRangeError("End time must be between 09:30 and 21:30.");
      return false;
    }
    return true;
  };

  const handleTimeRangeSave = () => {
    if (!validateTimeRange()) return;
    updateCommunityTimeRange(editingCommunityId, timeRangeStart, timeRangeEnd);
    setShowTimeRangeModal(false);
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-yellow-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="p-6 md:p-12">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">{editMode ? "Edit Admin" : "Invite New Admin"}</h3>
              <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="text-muted hover:text-ink" aria-label="Close admin form"><X size={20} /></button>
            </div>

            {error && (
              <div className="mb-6 text-center text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 py-2 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div>
                <label className={labelClasses}>Email Address</label>
                <Input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="admin@company.com"
                  className={inputClasses}
                  disabled={editMode}
                />
                {editMode && <p className="mt-1 text-[10px] text-muted">Email cannot be changed</p>}
              </div>

              <div>
                <label className={labelClasses}>Full Name</label>
                <Input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Full name"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>{editMode ? "New Password" : "Password"}</label>
                <Input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder={editMode ? "Leave blank to keep current" : "Minimum 4 characters"}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>Status</label>
                <Select value={formStatus} onValueChange={(v) => setFormStatus(v as "ACTIVE" | "DISABLED")}>
                  <SelectTrigger className={inputClasses}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="DISABLED">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className={labelClasses}>Permissions</label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_PERMISSIONS.map(({ key, label, icon: Icon }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer p-3 border border-hairline bg-surface-card rounded-lg hover:bg-surface-elevated transition-colors">
                      <Checkbox
                        checked={formPermissions.includes(key)}
                        onCheckedChange={() => handlePermissionToggle(key)}
                      />
                      <Icon size={14} className="text-muted" />
                      <span className="text-sm font-medium text-ink">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleSave}
              className="flex w-full items-center justify-center gap-2 bg-yellow-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-colors"
            >
              {editMode ? "Save Changes" : "Invite Admin"}
            </Button>
          </div>
        </div>
      )}

      {/* ADMIN MANAGEMENT SECTION */}
      <div className="mb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-normal text-ink">Admin Management</h2>
            <p className="mt-2 text-sm font-light text-body">Manage administrator accounts and permissions.</p>
          </div>
          <Button onClick={openAddModal} className="flex items-center justify-center gap-2 bg-yellow-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-colors">
            <UserPlus size={14} /> Invite Admin
          </Button>
        </div>

        {admins.length === 0 ? (
          <div className="text-center text-muted text-sm font-light mt-20 py-12">
            No administrators found.
          </div>
        ) : (
          <div className="space-y-4">
            {admins.map(admin => (
              <Card 
                key={admin.id} 
                className={`border border-hairline bg-surface-card gap-0 rounded-none py-0 ring-0 ring-transparent transition-all ${expandedAdmin === admin.id ? "bg-surface-elevated" : ""}`}
              >
                <div className="flex items-center justify-between p-6 cursor-pointer" onClick={() => toggleExpand(admin.id)}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center">
                      <Mail size={20} className="text-yellow-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-bold text-ink">{admin.name}</p>
                        {isSuperAdmin(admin) && (
                          <Badge className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-machined bg-yellow-400/20 text-yellow-400 rounded-full">
                            Super Admin
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-light text-muted">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={`px-3 py-1 text-[10px] font-bold uppercase tracking-machined rounded-full ${
                      admin.status === "ACTIVE" 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {admin.status}
                    </Badge>
                    <p className="text-xs font-light text-muted hidden sm:block">Last: {admin.lastLogin ? formatDate(admin.lastLogin) : "Never"}</p>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon-sm"
                      onClick={(e) => { e.stopPropagation(); openEditModal(admin); }} 
                      className="text-muted hover:text-ink transition-colors p-1"
                      aria-label={`Edit ${admin.name}`}
                    >
                      <Settings size={18} />
                    </Button>
                    {admin.id !== "admin_1" && canModify(admin) && (
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon-sm"
                        onClick={(e) => { e.stopPropagation(); handleDelete(admin.id); }} 
                        className="text-muted hover:text-m-red transition-colors p-1"
                        aria-label={`Delete ${admin.name}`}
                      >
                        <Trash2 size={18} />
                      </Button>
                    )}
                    <div className="w-8 flex justify-center">
                      {expandedAdmin === admin.id ? <ChevronUp size={18} className="text-ink" /> : <ChevronDown size={18} className="text-muted" />}
                    </div>
                  </div>
                </div>

                {expandedAdmin === admin.id && (
                  <div className="border-t border-hairline bg-surface-soft p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="p-3 bg-surface-card rounded-lg">
                        <p className="text-xs font-bold uppercase tracking-machined text-muted mb-1">ID</p>
                        <p className="font-mono text-ink">{admin.id}</p>
                      </div>
                      <div className="p-3 bg-surface-card rounded-lg">
                        <p className="text-xs font-bold uppercase tracking-machined text-muted mb-1">Created</p>
                        <p className="font-mono text-ink">{formatDate(admin.createdAt)}</p>
                      </div>
                      <div className="p-3 bg-surface-card rounded-lg">
                        <p className="text-xs font-bold uppercase tracking-machined text-muted mb-1">Last Login</p>
                        <p className="font-mono text-ink">{admin.lastLogin ? formatDate(admin.lastLogin) : "Never"}</p>
                      </div>
                      <div className="p-3 bg-surface-card rounded-lg">
                        <p className="text-xs font-bold uppercase tracking-machined text-muted mb-1">Invited By</p>
                        <p className="font-mono text-ink">{admin.invitedBy || "System"}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-machined text-muted mb-3">Permissions</p>
                      <div className="flex flex-wrap gap-2">
                        {ALL_PERMISSIONS.map(({ key, label, icon: Icon }) => (
                          <Badge 
                            key={key} 
                            variant="outline"
                            className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
                              admin.permissions.includes(key)
                                ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                                : "bg-surface-card text-muted border border-hairline"
                            }`}
                          >
                            <Icon size={10} />
                            {label}
                            {admin.permissions.includes(key) && <Check size={10} />}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* COMMUNITY TIME RANGES SECTION */}
      <div className="mt-16 pt-16 border-t border-hairline">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-normal text-ink">Community Time Ranges</h2>
            <p className="mt-2 text-sm font-light text-body">Manage booking time ranges per community.</p>
          </div>
        </div>

        {communities.length === 0 ? (
          <div className="text-center text-muted text-sm font-light mt-20 py-12">
            No communities configured.
          </div>
        ) : (
          <div className="space-y-4">
            {communities.map(c => (
              <Card key={c.id} className="border border-hairline bg-surface-card p-6 gap-0 rounded-none ring-0 ring-transparent transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center">
                      <Clock size={20} className="text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-ink">{c.name}</p>
                      <p className="text-sm font-light text-muted">{c.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-bold text-yellow-dark">
                      {c.timeRange?.start ? `${c.timeRange.start} - ${c.timeRange.end}` : "Not set"}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openTimeRangeModal(c.id)}
                      className="text-muted hover:text-ink transition-colors p-1"
                      aria-label={`Edit time range for ${c.name}`}
                    >
                      <Settings size={18} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* EDIT TIME RANGE MODAL */}
        {showTimeRangeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto border border-hairline bg-surface-soft p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold uppercase text-ink">Edit Time Range</h3>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => setShowTimeRangeModal(false)} className="text-muted hover:text-ink" aria-label="Close time range form"><X size={20} /></Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-machined text-muted mb-2">Start Time</label>
                  <Input
                    type="time"
                    value={timeRangeStart}
                    onChange={(e) => setTimeRangeStart(e.target.value)}
                    className="w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-yellow-dark focus:outline-none rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-machined text-muted mb-2">End Time</label>
                  <Input
                    type="time"
                    value={timeRangeEnd}
                    onChange={(e) => setTimeRangeEnd(e.target.value)}
                    className="w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-yellow-dark focus:outline-none rounded-lg"
                  />
                </div>
                {timeRangeError && (
                  <p className="text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 py-2 rounded-lg text-center">
                    {timeRangeError}
                  </p>
                )}
                <div className="flex gap-3 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowTimeRangeModal(false)}
                    className="flex-1 border border-hairline py-3 text-sm font-bold text-body hover:bg-surface-elevated transition-colors rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleTimeRangeSave}
                    className="flex-1 bg-yellow-dark py-3 text-sm font-bold text-black hover:bg-yellow-light transition-colors rounded-lg"
                  >
                    Save Time Range
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteAdminId !== null}
        onOpenChange={(open) => setDeleteAdminId(open ? deleteAdminId : null)}
        title="Delete Admin"
        description="Are you sure you want to delete this admin account? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={() => {
          if (deleteAdminId) deleteAdmin(deleteAdminId);
          setDeleteAdminId(null);
        }}
      />
    </div>
  );
}