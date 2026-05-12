import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { 
  Plus, 
  Search, 
  X, 
  Shirt, 
  Package, 
  Trash2, 
  Edit3, 
  Tag,
  Dna,
  History,
  TrendingDown
} from "lucide-react";
import { formatCurrency, cn } from "../utils";
import { InventoryItem, JerseySize } from "../types";
import { motion, AnimatePresence } from "motion/react";

export default function Inventory() {
  const { inventory, addItem, updateItem, deleteItem } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inventory Control</h1>
          <p className="text-slate-500 mt-1">Manage stock levels, pricing and product specifications.</p>
        </div>
        <button 
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm">Add New Product</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative group max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
          <input 
            type="text" 
            placeholder="Search products by name or team..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredInventory.map((item) => (
          <motion.div 
            key={item.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-slate-400 transition-all duration-300"
          >
            <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden border-b border-slate-100">
              {item.image ? (
                <img referrerPolicy="no-referrer" src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                  <Shirt className="w-10 h-10" />
                  <span className="text-[10px] uppercase font-black tracking-widest opacity-50">Image Missing</span>
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border",
                  item.stockQuantity > 10 ? "bg-white/90 backdrop-blur text-slate-800 border-white" : 
                  item.stockQuantity > 0 ? "bg-orange-500 text-white border-orange-400" : "bg-red-500 text-white border-red-400"
                )}>
                  {item.stockQuantity > 0 ? `${item.stockQuantity} in stock` : "Out of stock"}
                </span>
              </div>
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                <button 
                  onClick={() => {
                    setEditingItem(item);
                    setIsModalOpen(true);
                  }}
                  className="p-2 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-100 hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-110"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                     if(confirm("Confirm deletion of this product?")) {
                       deleteItem("inventory", item.id);
                     }
                  }}
                  className="p-2 bg-white text-red-600 rounded-xl shadow-xl border border-slate-100 hover:bg-red-600 hover:text-white transition-all transform hover:scale-110"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-1">{item.team}</p>
                <h3 className="font-bold text-slate-900 mb-2 truncate group-hover:text-emerald-600 transition-colors">{item.name}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {item.size.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-black text-slate-500 border border-slate-200">{s}</span>
                  ))}
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-black text-slate-900 border border-slate-200">{item.season}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-50">
                <div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">RRP Price</p>
                  <p className="text-xl font-black text-slate-900 leading-none">{formatCurrency(item.sellingPrice)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Unit Cost</p>
                  <p className="text-sm font-bold text-slate-500 leading-none">{formatCurrency(item.buyingPrice)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredInventory.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200 border border-slate-100">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <p className="text-slate-800 font-bold">No products cataloged</p>
                <p className="text-slate-400 text-xs">Begin by adding your first jersey to the inventory.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
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
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                   <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {editingItem ? "Edit Product Archive" : "New Global Catalog Entry"}
                  </h2>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">
                    {editingItem ? "Reference ID: " + editingItem.id.slice(0, 8) : "Enter product specifications below"}
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8">
                <InventoryForm 
                  initialData={editingItem} 
                  onSubmit={async (data) => {
                    if (editingItem) {
                      await updateItem("inventory", editingItem.id, data);
                    } else {
                      await addItem("inventory", data);
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

function InventoryForm({ initialData, onSubmit }: { initialData: InventoryItem | null; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState<Partial<InventoryItem>>(initialData || {
    name: "",
    team: "",
    season: "2024/25",
    size: ["M"],
    stockQuantity: 10,
    buyingPrice: 10,
    sellingPrice: 15,
    image: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value
    }));
  };

  const handleSizeToggle = (s: JerseySize) => {
    setFormData(prev => {
      const sizes = prev.size || [];
      return {
        ...prev,
        size: sizes.includes(s) ? sizes.filter(sz => sz !== s) : [...sizes, s]
      };
    });
  };

  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        <div className="col-span-2 space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Product Designation</label>
          <input 
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold text-sm"
            placeholder="Ex. Arsenal Home Kit"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Football Club</label>
          <input 
            name="team"
            value={formData.team}
            onChange={handleChange}
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold text-sm"
            placeholder="Ex. Arsenal"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Competition Season</label>
          <input 
            name="season"
            value={formData.season}
            onChange={handleChange}
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold text-sm"
            placeholder="Ex. 2024/25"
          />
        </div>
        <div className="col-span-2 space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Size Availability</label>
          <div className="flex gap-3">
            {(["S", "M", "L", "XL"] as JerseySize[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSizeToggle(s)}
                className={cn(
                  "flex-1 py-3 px-2 rounded-xl border font-black text-xs transition-all",
                  formData.size?.includes(s) 
                    ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" 
                    : "bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Unit Acquisition Cost</label>
          <input 
            type="number"
            name="buyingPrice"
            value={formData.buyingPrice}
            onChange={handleChange}
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-sm"
            placeholder="0.00"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Projected SRP</label>
          <input 
            type="number"
            name="sellingPrice"
            value={formData.sellingPrice}
            onChange={handleChange}
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-sm"
            placeholder="0.00"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Quantity in Stock</label>
          <input 
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-sm"
            placeholder="0"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Visual Asset URL</label>
          <input 
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold text-sm"
            placeholder="https://..."
          />
        </div>
      </div>
      <div className="pt-6 mt-6 border-t border-slate-100 flex gap-4">
        <button 
          type="button"
          onClick={() => {}} // Close handled by parent
          className="flex-1 px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
        >
          Discard
        </button>
        <button 
          type="submit" 
          className="flex-[2] px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 text-sm"
        >
          {initialData ? "Commit Updates" : "Add to Catalog"}
        </button>
      </div>
    </form>
  );
}
