"use client";
import { useState, useEffect } from "react";
import { Plus, Search, Trash2, X, Edit } from "lucide-react";
import { useStore } from "@/lib/store";

const expenseCategories = ["SALARY", "RENT", "WATER", "ELECTRICITY", "MAINTENANCE", "TRAVEL", "FUEL", "EQUIPMENT", "REPAIR", "FOOD", "CLEANING_MATERIAL", "MARKETING", "MISCELLANEOUS"];
const expensePaymentMethods = ["CASH", "UPI", "CHEQUE", "ACCOUNT_TRANSFER"];

export default function ExpensesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const expenses = useStore((state) => state.expenses);
  const addExpense = useStore((state) => state.addExpense);
  const updateExpense = useStore((state) => state.updateExpense);
  const deleteExpense = useStore((state) => state.deleteExpense);

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState(expenseCategories[0]);
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState(expensePaymentMethods[0]);
  const [notes, setNotes] = useState("");

  if (!mounted) return null;

  const filteredExpenses = expenses.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setIsEditing(false);
    setDate(""); setName(""); setAmount(""); setNotes("");
    setCategory(expenseCategories[0]); setPaymentType(expensePaymentMethods[0]);
    setShowModal(true);
  };

  const openEditModal = (e: any) => {
    setIsEditing(true);
    setCurrentId(e.id);
    setDate(e.date); setName(e.name); setAmount(e.amount.toString());
    setCategory(e.category); setPaymentType(e.paymentType); setNotes(e.notes);
    setShowModal(true);
  };

  const handleSaveExpense = () => {
    if (!name || !amount || !date) return;
    
    if (isEditing) {
      updateExpense(currentId, date, name, Number(amount), category, paymentType, notes);
    } else {
      addExpense({
        id: `e${Date.now()}`,
        date,
        name,
        category,
        amount: Number(amount),
        paymentType,
        notes
      });
    }

    setDate(""); setName(""); setAmount(""); setNotes("");
    setCategory(expenseCategories[0]); setPaymentType(expensePaymentMethods[0]);
    setShowModal(false);
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="p-12 relative">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 overflow-y-auto py-10">
          <div className="w-full max-w-md border border-hairline bg-surface-soft p-8 mx-4">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">{isEditing ? "Edit Expense" : "Add Expense"}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Expense Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Monthly Rent" className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClasses}>
                  {expenseCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClasses}>Amount (₹)</label>
                <input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Payment Type</label>
                <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} className={inputClasses}>
                  {expensePaymentMethods.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClasses}>Notes (Optional)</label>
                <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any details..." className={inputClasses} />
              </div>
            </div>

            <button onClick={handleSaveExpense} className="mt-6 flex w-full items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light">
              {isEditing ? "Save Changes" : "Save Expense"}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-normal text-ink">Expenses</h2>
          <p className="mt-2 text-sm font-light text-body">Track operational costs: salaries, rent, materials, etc.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center justify-center gap-2 bg-m-blue-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light transition-colors">
          <Plus size={14} /> Add Expense
        </button>
      </div>

      <div className="mb-6 flex items-center gap-3 border border-hairline bg-surface-card p-3">
        <Search size={16} className="text-muted" />
        <input type="text" placeholder="Search by name or category..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={inputClasses + " border-none bg-transparent p-0 focus:outline-none"} />
      </div>

      <div className="border border-hairline overflow-x-auto bg-surface-card">
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
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-sm font-light text-muted">No expenses added yet.</td>
              </tr>
            ) : (
              filteredExpenses.map(e => (
                <tr key={e.id} className="border-b border-hairline last:border-none hover:bg-surface-elevated transition-colors">
                  <td className="py-4 px-6 text-sm font-light text-ink">{e.date}</td>
                  <td className="py-4 px-6">
                    <p className="text-sm font-bold text-ink">{e.name}</p>
                    {e.notes && <p className="text-xs font-light text-muted mt-1">{e.notes}</p>}
                  </td>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}