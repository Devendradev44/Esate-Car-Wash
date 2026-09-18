"use client";
import { useState, useRef } from "react";
import { Plus, Search, Trash2, X, Edit, Receipt, Tag, Download, Upload } from "lucide-react";
import { useStore } from "@/lib/store";
import { AnimatedSelect } from "@/components/ui/AnimatedSelect";
import { toCSV, downloadCSV, parseCSV } from "@/lib/csv";

const expensePaymentMethods = ["CASH", "UPI", "CHEQUE", "ACCOUNT_TRANSFER"];

export default function ExpensesPage() {

  const expenses = useStore((state) => state.expenses);
  const addExpense = useStore((state) => state.addExpense);
  const updateExpense = useStore((state) => state.updateExpense);
  const deleteExpense = useStore((state) => state.deleteExpense);
  const expenseCategories = useStore((state) => state.expenseCategories);
  const addExpenseCategory = useStore((state) => state.addExpenseCategory);
  const removeExpenseCategory = useStore((state) => state.removeExpenseCategory);

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [catError, setCatError] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importError, setImportError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState(expenseCategories[0] || "");
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState(expensePaymentMethods[0]);
  const [notes, setNotes] = useState("");

  const filteredExpenses = expenses.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    const csv = toCSV(expenses, [
      { key: "date", header: "Date" },
      { key: "name", header: "Name" },
      { key: "category", header: "Category" },
      { key: "amount", header: "Amount" },
      { key: "paymentType", header: "Payment Type" },
      { key: "notes", header: "Notes" },
    ]);
    downloadCSV(`expenses_${new Date().toISOString().slice(0, 10)}.csv`, csv);
  };

  const handleImport = async (file: File) => {
    try {
      const rows = await parseCSV(file);
      if (rows.length < 2) { setImportError("CSV must have a header row and data."); return; }
      const header = rows[0].map(h => h.trim().toUpperCase());
      const required = ["DATE", "NAME", "CATEGORY", "AMOUNT"];
      const missing = required.filter(r => !header.includes(r));
      if (missing.length > 0) { setImportError(`Missing columns: ${missing.join(", ")}`); return; }

      const dateIdx = header.indexOf("DATE");
      const nameIdx = header.indexOf("NAME");
      const catIdx = header.indexOf("CATEGORY");
      const amountIdx = header.indexOf("AMOUNT");
      const paymentIdx = header.indexOf("PAYMENT TYPE");
      const notesIdx = header.indexOf("NOTES");

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const dateVal = row[dateIdx]?.trim();
        const nameVal = row[nameIdx]?.trim();
        const catVal = row[catIdx]?.trim();
        const amountVal = row[amountIdx]?.trim();
        if (!dateVal || !nameVal || !catVal || !amountVal) continue;
        addExpense({
          id: `e${Date.now()}_${i}`,
          date: dateVal,
          name: nameVal,
          category: catVal.toUpperCase(),
          amount: Number(amountVal) || 0,
          paymentType: paymentIdx >= 0 && row[paymentIdx]?.trim()
            ? (row[paymentIdx].trim().toUpperCase() as "CASH" | "UPI" | "CHEQUE" | "ACCOUNT_TRANSFER")
            : "CASH",
          notes: notesIdx >= 0 ? row[notesIdx]?.trim() || "" : "",
        });
      }
      setShowImportModal(false);
      setImportError("");
    } catch {
      setImportError("Failed to parse CSV file.");
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setDate(""); setName(""); setAmount(""); setNotes("");
    setCategory(expenseCategories[0] || ""); setPaymentType(expensePaymentMethods[0]);
    setShowModal(true);
  };

  const openEditModal = (e: { id: string; date: string; name: string; category: string; amount: number; paymentType: string; notes: string }) => {
    setIsEditing(true);
    setCurrentId(e.id);
    setDate(e.date); setName(e.name); setAmount(e.amount.toString());
    setCategory(e.category); setPaymentType(e.paymentType); setNotes(e.notes);
    setShowModal(true);
  };

  const handleSaveExpense = () => {
    if (!name || !amount || !date || !category) return;
    if (isEditing) {
      updateExpense(currentId, date, name, Number(amount), category, paymentType, notes);
    } else {
      addExpense({ id: `e${Date.now()}`, date, name, category, amount: Number(amount), paymentType, notes });
    }
    setDate(""); setName(""); setAmount(""); setNotes("");
    setCategory(expenseCategories[0] || ""); setPaymentType(expensePaymentMethods[0]);
    setShowModal(false);
  };

  const handleAddCategory = () => {
    const trimmed = newCategory.trim().toUpperCase();
    if (!trimmed) return;
    if (expenseCategories.includes(trimmed)) {
      setCatError("Category already exists.");
      return;
    }
    addExpenseCategory(trimmed);
    setNewCategory("");
    setCatError("");
    setShowCatModal(false);
    setCategory(trimmed);
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-yellow-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="p-6 md:p-12 relative">
      {/* EXPENSE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 overflow-y-auto py-10 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">{isEditing ? "Edit Expense" : "Add Expense"}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div><label className={labelClasses}>Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClasses + " [color-scheme:dark]"} /></div>
              <div><label className={labelClasses}>Expense Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Monthly Rent" className={inputClasses} /></div>
              <div><label className={labelClasses}>Category</label>
                <AnimatedSelect
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                  placeholder="Select category"
                  options={expenseCategories.map(c => ({ value: c, label: c }))}
                  className={inputClasses}
                />
              </div>
              <div><label className={labelClasses}>Amount (₹)</label><input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className={inputClasses} /></div>
              <div><label className={labelClasses}>Payment Type</label>
                <AnimatedSelect
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  label="Payment Type"
                  placeholder="Select payment type"
                  options={expensePaymentMethods.map(p => ({ value: p, label: p }))}
                  className={inputClasses}
                />
              </div>
              <div><label className={labelClasses}>Notes (Optional)</label><input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any details..." className={inputClasses} /></div>
            </div>
            <button onClick={handleSaveExpense} className="mt-6 flex w-full items-center justify-center gap-2 bg-yellow-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light">
              {isEditing ? "Save Changes" : "Save Expense"}
            </button>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm max-h-[90vh] overflow-y-auto border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold uppercase text-ink">Add Category</h3>
              <button onClick={() => { setShowCatModal(false); setCatError(""); }} className="text-muted hover:text-ink"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Category Name</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => { setNewCategory(e.target.value); setCatError(""); }}
                  placeholder="e.g. INSURANCE"
                  className={inputClasses}
                  autoFocus
                />
              </div>
              {catError && <p className="text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 py-2 rounded-lg text-center">{catError}</p>}
              <button onClick={handleAddCategory} className="flex w-full items-center justify-center gap-2 bg-yellow-dark py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light">
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto border border-hairline bg-surface-soft p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold uppercase text-ink">Import Expenses</h3>
              <button onClick={() => { setShowImportModal(false); setImportError(""); }} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-light text-muted">Upload a CSV with columns: Date, Name, Category, Amount (required).</p>
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
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-normal text-ink">Expenses</h2>
          <p className="mt-2 text-sm font-light text-body">Track operational costs: salaries, rent, materials, etc.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="flex items-center justify-center gap-2 border border-hairline bg-surface-card px-4 py-3 text-xs font-bold uppercase tracking-machined text-body hover:text-ink hover:bg-surface-elevated transition-colors">
            <Download size={14} /> Export Expenses
          </button>
          <button onClick={() => setShowImportModal(true)} className="flex items-center justify-center gap-2 border border-hairline bg-surface-card px-4 py-3 text-xs font-bold uppercase tracking-machined text-body hover:text-ink hover:bg-surface-elevated transition-colors">
            <Upload size={14} /> Import Expenses
          </button>
          <button onClick={() => setShowCatModal(true)} className="flex items-center justify-center gap-2 border border-hairline bg-surface-card px-4 py-3 text-xs font-bold uppercase tracking-machined text-body hover:text-ink hover:bg-surface-elevated transition-colors">
            <Tag size={14} /> Manage Categories
          </button>
          <button onClick={openAddModal} className="flex items-center justify-center gap-2 bg-yellow-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-yellow-light transition-colors">
            <Plus size={14} /> Add Expense
          </button>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3 border border-hairline bg-surface-card p-3">
        <Search size={16} className="text-muted" />
        <input type="text" placeholder="Search by name or category..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={inputClasses + " border-none bg-transparent p-0 focus:outline-none"} />
      </div>

      {/* CATEGORY CHIPS */}
      <div className="mb-6 flex flex-wrap gap-2">
        {expenseCategories.map(cat => (
          <span key={cat} className="flex items-center gap-1 px-3 py-1 text-[10px] font-bold uppercase tracking-machined bg-surface-elevated text-body border border-hairline rounded-full">
            {cat}
            {expenseCategories.length > 1 && (
              <button onClick={() => removeExpenseCategory(cat)} className="hover:text-m-red ml-1">
                <X size={10} />
              </button>
            )}
          </span>
        ))}
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {filteredExpenses.length === 0 ? (
          <p className="text-center text-muted text-sm font-light py-10">No expenses found.</p>
        ) : (
          filteredExpenses.map(e => (
            <div key={e.id} className="border border-hairline bg-surface-card p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-lg font-bold text-ink flex items-center gap-2"><Receipt size={14} className="text-muted" /> {e.name}</p>
                  <p className="text-xs font-light text-muted mt-1">{e.date}</p>
                </div>
                <p className="text-lg font-bold text-m-red">₹{e.amount.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-machined bg-surface-elevated text-body px-2 py-1">{e.category}</span>
                <span className="text-[10px] font-bold uppercase tracking-machined bg-surface-elevated text-muted px-2 py-1">{e.paymentType}</span>
              </div>
              <div className="flex items-center justify-end gap-4 border-t border-hairline pt-3">
                <button onClick={() => openEditModal(e)} className="text-muted hover:text-ink transition-colors"><Edit size={16} /></button>
                <button onClick={() => deleteExpense(e.id)} className="text-muted hover:text-m-red transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block border border-hairline overflow-x-auto bg-surface-card">
        <table className="w-full min-w-[800px]">
          <thead className="border-b border-hairline bg-surface-soft">
            <tr>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Date</th>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Name</th>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Category</th>
              <th className="py-4 px-6 text-right text-xs font-bold uppercase tracking-machined text-muted">Amount</th>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Payment</th>
              <th className="py-4 px-6 text-right text-xs font-bold uppercase tracking-machined text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map(e => (
              <tr key={e.id} className="border-b border-hairline last:border-none hover:bg-surface-elevated transition-colors">
                <td className="py-4 px-6 text-sm font-light text-ink">{e.date}</td>
                <td className="py-4 px-6"><p className="text-sm font-bold text-ink">{e.name}</p>{e.notes && <p className="text-xs font-light text-muted mt-1">{e.notes}</p>}</td>
                <td className="py-4 px-6 text-xs font-bold uppercase tracking-machined text-body">{e.category}</td>
                <td className="py-4 px-6 text-sm font-bold text-m-red text-right">₹{e.amount.toLocaleString()}</td>
                <td className="py-4 px-6 text-xs font-bold uppercase tracking-machined text-muted">{e.paymentType}</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => openEditModal(e)} className="text-muted hover:text-ink transition-colors"><Edit size={16} /></button>
                    <button onClick={() => deleteExpense(e.id)} className="text-muted hover:text-m-red transition-colors"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
