"use client";

import { useState } from "react";
import { Plus, Search, Trash2, X } from "lucide-react";
import { useStore } from "@/lib/store"; // IMPORT THE GLOBAL STORE!

// Exact Enums from your Prisma Schema
const expenseCategories = ["SALARY", "RENT", "WATER", "ELECTRICITY", "MAINTENANCE", "TRAVEL", "FUEL", "EQUIPMENT", "REPAIR", "FOOD", "CLEANING_MATERIAL", "MARKETING", "MISCELLANEOUS"];
const expensePaymentMethods = ["CASH", "UPI", "CHEQUE", "ACCOUNT_TRANSFER"];

export default function ExpensesPage() {
  // --- READ FROM GLOBAL STORE ---
  const expenses = useStore((state) => state.expenses); // USE STORE!
  const addExpense = useStore((state) => state.addExpense); // USE STORE!

  // --- LOCAL UI STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [newDate, setNewDate] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState(expenseCategories[0]);
  const [newAmount, setNewAmount] = useState("");
  const [newPaymentType, setNewPaymentType] = useState(expensePaymentMethods[0]);
  const [newNotes, setNewNotes] = useState("");

  const filteredExpenses = expenses.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- WRITE TO GLOBAL STORE ---
  const handleAddExpense = () => {
    if (!newName || !newAmount || !newDate) return;
    
    // CALL THE GLOBAL STORE ACTION!
    addExpense({
      id: `e${Date.now()}`,
      date: newDate,
      name: newName,
      category: newCategory,
      amount: Number(newAmount),
      paymentType: newPaymentType,
      notes: newNotes
    });

    // Reset form
    setNewDate(""); setNewName(""); setNewAmount(""); setNewNotes(""); setNewCategory(expenseCategories[0]); setNewPaymentType(expensePaymentMethods[0]);
    setShowModal(false);
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  return (
    <div className="p-12 relative">
      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 overflow-y-auto py-10">
          <div className="w-full max-w-md border border-hairline bg-surface-soft p-8 mx-4">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold uppercase text-ink">Add Expense</h3>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-ink"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Date</label>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className={inputClasses} />
              </div>

              <div>
                <label className={labelClasses}>Expense Name</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Monthly Rent" className={inputClasses} />
              </div>

              <div>
                <label className={labelClasses}>Category</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className={inputClasses}>
                  {expenseCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClasses}>Amount (₹)</label>
                <input type="number" min="0" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder="0" className={inputClasses} />
              </div>

              <div>
                <label className={labelClasses}>Payment Type</label>
                <select value={newPaymentType} onChange={(e) => setNewPaymentType(e.target.value)} className={inputClasses}>
                  {expensePaymentMethods.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClasses}>Notes (Optional)</label>
                <input type="text" value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="Any details..." className={inputClasses} />
              </div>
            </div>

            <button onClick={handleAddExpense} className="mt-6 flex w-full items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light">
              Save Expense
            </button>
          </div>
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-normal text-ink">Expenses</h2>
          <p className="mt-2 text-sm font-light text-body">Track operational costs: salaries, rent, materials, etc.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-m-blue-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light transition-colors">
          <Plus size={14} /> Add Expense
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex items-center gap-3 border border-hairline bg-surface-card p-3">
        <Search size={16} className="text-muted" />
        <input type="text" placeholder="Search by name or category..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={inputClasses + " border-none bg-transparent p-0 focus:outline-none"} />
      </div>

      {/* Data Table */}
      <div className="border border-hairline overflow-x-auto">
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
              <tr key={e.id} className="border-b border-hairline hover:bg-surface-card transition-colors">
                <td className="py-4 px-6 text-sm font-light text-ink">{e.date}</td>
                <td className="py-4 px-6">
                  <p className="text-sm font-bold text-ink">{e.name}</p>
                  {e.notes && <p className="text-xs font-light text-muted mt-1">{e.notes}</p>}
                </td>
                <td className="py-4 px-6 text-xs font-bold uppercase tracking-machined text-body">{e.category}</td>
                <td className="py-4 px-6 text-sm font-bold text-m-red text-right">₹{e.amount.toLocaleString()}</td>
                <td className="py-4 px-6 text-xs font-bold uppercase tracking-machined text-muted">{e.paymentType}</td>
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