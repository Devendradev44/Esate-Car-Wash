"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { useStore } from "@/lib/store";

const CATEGORIES = ["SALARY", "RENT", "WATER", "ELECTRICITY", "MAINTENANCE", "TRAVEL", "FUEL", "EQUIPMENT", "REPAIR", "FOOD", "CLEANING_MATERIAL", "MARKETING", "MISCELLANEOUS"];
const PAYMENT_TYPES = ["CASH", "UPI", "CHEQUE", "ACCOUNT_TRANSFER"];

export default function ExpensesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const expenses = useStore((state) => state.expenses);
  const addExpense = useStore((state) => state.addExpense);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("SALARY");
  const [paymentType, setPaymentType] = useState("CASH");
  const [notes, setNotes] = useState("");

  if (!mounted) return null;

  const handleAddExpense = () => {
    if (!name || !amount) return;
    addExpense({
      id: `e_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      name,
      amount: Number(amount),
      category,
      paymentType,
      notes
    });
    setName(""); setAmount(""); setNotes("");
    setShowModal(false);
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="p-12 relative">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="w-full max-w-md border border-hairline bg-surface-soft p-8 mx-4">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">Log Expense</h3>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>
            
            <div className="mb-4">
              <label className={labelClasses}>Expense Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Vacuum Cleaner" className={inputClasses} />
            </div>
            <div className="mb-4">
              <label className={labelClasses}>Amount (₹)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="5000" className={inputClasses} />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClasses}>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClasses}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClasses}>Payment Type</label>
                <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} className={inputClasses}>
                  {PAYMENT_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-8">
              <label className={labelClasses}>Notes (Optional)</label>
              <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Details..." className={inputClasses} />
            </div>

            <button onClick={handleAddExpense} className="flex w-full items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light">
              Save Expense
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-normal text-ink">Expenses</h2>
          <p className="mt-2 text-sm font-light text-body">Track business expenditures.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-m-blue-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light transition-colors">
          <Plus size={14} /> Add Expense
        </button>
      </div>

      <div className="border border-hairline overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="border-b border-hairline bg-surface-soft">
            <tr>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Date</th>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Name</th>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Category</th>
              <th className="py-4 px-6 text-center text-xs font-bold uppercase tracking-machined text-muted">Amount</th>
              <th className="py-4 px-6 text-right text-xs font-bold uppercase tracking-machined text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e.id} className="border-b border-hairline hover:bg-surface-card transition-colors">
                <td className="py-4 px-6 text-sm font-light text-body">{e.date}</td>
                <td className="py-4 px-6 text-sm font-bold text-ink">{e.name}</td>
                <td className="py-4 px-6 text-sm font-light text-body">{e.category}</td>
                <td className="py-4 px-6 text-sm font-bold text-m-red text-center">₹{e.amount}</td>
                <td className="py-4 px-6 text-right">
                  <button className="text-muted hover:text-m-red transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}