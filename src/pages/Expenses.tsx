import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  X, 
  Receipt,
  Facebook,
  Truck,
  Box,
  MoreHorizontal
} from "lucide-react";
import { formatCurrency, cn } from "../utils";
import { Expense } from "../types";
import { motion, AnimatePresence } from "motion/react";

export default function Expenses() {
  const { expenses, addItem, updateItem, deleteItem } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Facebook Ads": return Facebook;
      case "Courier Cost": return Truck;
      case "Packaging": return Box;
      default: return MoreHorizontal;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Facebook Ads": return "bg-blue-50 text-blue-600";
      case "Courier Cost": return "bg-orange-50 text-orange-600";
      case "Packaging": return "bg-emerald-50 text-emerald-600";
      default: return "bg-slate-50 text-slate-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Financial Outgoings</h1>
          <p className="text-slate-500 mt-1">Track business expenditure, logistics and ad spend.</p>
        </div>
        <button 
          onClick={() => {
            setEditingExpense(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm">Log New Expense</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 sticky top-0 backdrop-blur-sm border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Expense Details</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((expense) => {
                    const Icon = getCategoryIcon(expense.category);
                    return (
                      <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900">{expense.title}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[200px] font-medium">{expense.notes || "No description provided"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                            getCategoryColor(expense.category)
                          )}>
                            <Icon className="w-3 h-3" />
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-black text-slate-900">{formatCurrency(expense.amount)}</p>
                        </td>
                        <td className="px-6 py-4 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                          {new Date(expense.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => {
                                setEditingExpense(expense);
                                setIsModalOpen(true);
                              }}
                              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                 if(confirm("Permanently remove this expense record?")) {
                                   deleteItem("expenses", expense.id);
                                 }
                              }}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {expenses.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-24">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200 border border-slate-100">
                            <Receipt className="w-8 h-8" />
                          </div>
                          <div className="text-center">
                            <p className="text-slate-800 font-bold">No expenses found</p>
                            <p className="text-slate-400 text-xs">Start tracking your business spend.</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Categorical Breakdown</h2>
            <div className="space-y-3">
              {["Facebook Ads", "Courier Cost", "Packaging", "Miscellaneous"].map(cat => {
                const total = expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
                const Icon = getCategoryIcon(cat);
                return (
                  <div key={cat} className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", getCategoryColor(cat))}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{cat}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{formatCurrency(total)}</span>
                  </div>
                );
              })}
              <div className="pt-6 border-t border-slate-100 mt-6 flex flex-col gap-1 items-end">
                <span className="font-black text-slate-400 uppercase tracking-widest text-[9px]">Cumulative Burn</span>
                <span className="text-3xl font-black text-slate-900 tracking-tight">
                  {formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-bottom border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {editingExpense ? "Edit Expense" : "Log New Expense"}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8">
                <ExpenseForm 
                  initialData={editingExpense} 
                  onSubmit={async (data) => {
                    if (editingExpense) {
                      await updateItem("expenses", editingExpense.id, data);
                    } else {
                      await addItem("expenses", data);
                    }
                    setIsModalOpen(false);
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExpenseForm({ initialData, onSubmit }: { initialData: Expense | null; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState<Partial<Expense>>(initialData || {
    title: "",
    amount: 0,
    category: "Miscellaneous",
    date: new Date().toISOString().split("T")[0],
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value
    }));
  };

  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Transaction Title</label>
          <input 
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold text-sm"
            placeholder="Ex. Facebook Ads for May"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Financial Value</label>
            <input 
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-sm"
              placeholder="0.00"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Log Date</label>
            <input 
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-sm"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Cost Allocation</label>
          <select 
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-sm appearance-none cursor-pointer"
          >
            <option value="Facebook Ads">Facebook Ads</option>
            <option value="Courier Cost">Courier Cost</option>
            <option value="Packaging">Packaging</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Internal Remarks</label>
          <textarea 
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold text-sm resize-none"
            placeholder="Additional context or receipts references..."
          />
        </div>
      </div>
      <div className="pt-6 mt-6 border-t border-slate-100 flex gap-4">
        <button 
          type="button" 
          onClick={() => {}} // parent logic
          className="flex-1 px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
        >
          Discard
        </button>
        <button 
          type="submit" 
          className="flex-[2] px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 text-sm"
        >
          {initialData ? "Commit Updates" : "Register Expense"}
        </button>
      </div>
    </form>
  );
}
