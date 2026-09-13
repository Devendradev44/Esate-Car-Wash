"use client";
import { useState } from "react";
import { Trash2, X, UserPlus, Shield, Mail, Settings, ChevronDown, ChevronUp, Check } from "lucide-react";
import { useStore, mockHash } from "@/lib/store";
import { PasswordInput } from "@/components/ui/PasswordInput";

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
    // Check duplicate email
    const existing = admins.find(a => a.email === formEmail && a.id !== editingAdmin?.id);
    if (existing) {
      setError("An admin with this email already exists.");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const passwordHash = formPassword ? mockHash(formPassword) : editingAdmin?.passwordHash || "";

    if (editMode && editingAdmin) {
      updateAdmin(editingAdmin.id, {
        name: formName,
        permissions: formPermissions,
        status: formStatus,
        ...(formPassword ? { passwordHash } : {}),
      });
    } else {
      addAdmin({
        email: formEmail,
        passwordHash,
        name: formName,
        permissions: formPermissions,
        status: formStatus,
        invitedBy: currentUser?.id || null,
      });
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (adminId: string) => {
    if (!confirm("Delete this admin? This cannot be undone.")) return;
    if (adminId === "admin_1") {
      alert("Cannot delete the super admin.");
      return;
    }
    deleteAdmin(adminId);
  };

  const toggleExpand = (id: string) => {
    setExpandedAdmin(prev => prev === id ? null : id);
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return "Never";
    return new Date(iso).toLocaleDateString("en-IN", { 
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" 
    });
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-yellow-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="p-6 md:p-12 relative">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">{editMode ? "Edit Admin" : "Invite New Admin"}</h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>

            {error && (
              <div className="mb-6 text-center text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 py-2 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div>
                <label className={labelClasses}>Email Address</label>
                <input 
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
                <input 
                  type="text" 
                  value={formName} 
                  onChange={(e) => setFormName(e.target.value)} 
                  placeholder="John Doe" 
                  className={inputClasses} 
                />
              </div>

              <div>
                <PasswordInput
                  value={formPassword}
                  onChange={setFormPassword}
                  placeholder={editMode ? "••••••••" : "min 4 characters"}
                  label={editMode ? "New Password (leave blank to keep current)" : "Password"}
                  className="w-full"
                />
              </div>

              <div>
                <label className={labelClasses}>Status</label>
                <select value={formStatus} onChange={(e) => setFormStatus(e.target.value as "ACTIVE" | "DISABLED")} className={inputClasses}>
                  <option value="ACTIVE">Active</option>
                  <option value="DISABLED">Disabled</option>
                </select>
              </div>

              <div>
                <label className={labelClasses}>Permissions</label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_PERMISSIONS.map(({ key, label, icon: Icon }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer p-3 border border-hairline bg-surface-card rounded-lg hover:bg-surface-elevated transition-colors">
                      <input
                        type="checkbox"
                        checked={formPermissions.includes(key)}
                        onChange={() => handlePermissionToggle(key)}
                        className="w-4 h-4 accent-yellow-400 border-zinc-700 rounded focus:ring-yellow-400"
                      />
                      <Icon size={14} className="text-muted" />
                      <span className="text-sm font-medium text-ink">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleSave} 
              className="flex w-full items-center justify-center gap-2 bg-yellow-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-colors"
            >
              {editMode ? "Save Changes" : "Invite Admin"}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-normal text-ink">Admin Management</h2>
          <p className="mt-2 text-sm font-light text-body">Manage administrator accounts and permissions.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center justify-center gap-2 bg-yellow-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-colors">
          <UserPlus size={14} /> Invite Admin
        </button>
      </div>

      {admins.length === 0 ? (
        <div className="text-center text-muted text-sm font-light mt-20 py-12">
          No administrators found.
        </div>
      ) : (
        <div className="space-y-4">
          {admins.map(admin => (
            <div 
              key={admin.id} 
              className={`border border-hairline bg-surface-card transition-all ${expandedAdmin === admin.id ? "bg-surface-elevated" : ""}`}
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
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-machined bg-yellow-400/20 text-yellow-400 rounded">
                          Super Admin
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-light text-muted">{admin.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-machined rounded-full ${
                    admin.status === "ACTIVE" 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-red-500/20 text-red-400"
                  }`}>
                    {admin.status}
                  </span>
                  <p className="text-xs font-light text-muted hidden sm:block">Last: {formatDate(admin.lastLogin)}</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); openEditModal(admin); }} 
                    className="text-muted hover:text-ink transition-colors p-1"
                  >
                    <Settings size={18} />
                  </button>
                  {admin.id !== "admin_1" && canModify(admin) && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(admin.id); }} 
                      className="text-muted hover:text-m-red transition-colors p-1"
                    >
                      <Trash2 size={18} />
                    </button>
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
                      <p className="font-mono text-ink">{formatDate(admin.lastLogin)}</p>
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
                        <span 
                          key={key} 
                          className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
                            admin.permissions.includes(key)
                              ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
                              : "bg-surface-card text-muted border border-hairline"
                          }`}
                        >
                          <Icon size={10} />
                          {label}
                          {admin.permissions.includes(key) && <Check size={10} />}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}