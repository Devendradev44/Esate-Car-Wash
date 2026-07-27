"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, EyeOff } from "lucide-react";

// Mock Data for Admin View
const initialCommunities = [
  { id: "c1", name: "Prestige Shantiniketan", address: "Whitefield Main Rd, Bangalore", status: "ACTIVE" },
  { id: "c2", name: "Sobha Halcyon", address: "Jalahalli, Bangalore", status: "ACTIVE" },
  { id: "c3", name: "Brigade Gateway", address: "Malleshwaram, Bangalore", status: "HIDDEN" },
];

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState(initialCommunities);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setCommunities(communities.map(c => 
      c.id === id ? { ...c, status: c.status === "ACTIVE" ? "HIDDEN" : "ACTIVE" } : c
    ));
  };

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-3 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";

  return (
    <div className="p-12">
      {/* Header & Actions */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-normal text-ink">Communities</h2>
          <p className="mt-2 text-sm font-light text-body">Manage gated communities and their visibility.</p>
        </div>
        <button className="flex items-center gap-2 bg-m-blue-dark px-6 py-3 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light transition-colors">
          <Plus size={14} /> Add Community
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex items-center gap-3 border border-hairline bg-surface-card p-3">
        <Search size={16} className="text-muted" />
        <input 
          type="text" 
          placeholder="Search communities..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={inputClasses + " border-none bg-transparent p-0 focus:outline-none"}
        />
      </div>

      {/* Data Table */}
      <div className="border border-hairline overflow-x-auto">
        <table className="w-full min-w-[600px]">
          {/* Table Head - BMW M Style (Uppercase, Machined) */}
          <thead className="border-b border-hairline bg-surface-soft">
            <tr>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Name</th>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Address</th>
              <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-machined text-muted">Status</th>
              <th className="py-4 px-6 text-right text-xs font-bold uppercase tracking-machined text-muted">Actions</th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody>
            {filteredCommunities.map(c => (
              <tr key={c.id} className="border-b border-hairline hover:bg-surface-card transition-colors">
                <td className="py-4 px-6 text-sm font-bold text-ink">{c.name}</td>
                <td className="py-4 px-6 text-sm font-light text-body">{c.address}</td>
                <td className="py-4 px-6">
                  <span className={`text-xs font-bold uppercase tracking-machined px-2 py-1 ${c.status === "ACTIVE" ? "text-success" : "text-muted"}`}>
                    {c.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-muted hover:text-ink transition-colors"><Edit size={16} /></button>
                    <button onClick={() => toggleStatus(c.id)} className="text-muted hover:text-warning transition-colors"><EyeOff size={16} /></button>
                    <button className="text-muted hover:text-m-red transition-colors"><Trash2 size={16} /></button>
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