import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Trash2, 
  Edit3,
  Eye,
  X,
  CreditCard,
  Truck,
  User,
  ShoppingBag,
  Banknote
} from "lucide-react";
import { formatCurrency, cn } from "../utils";
import { Order, OrderStatus, PaymentStatus, JerseySize } from "../types";
import { motion, AnimatePresence } from "motion/react";

export default function Orders() {
  const { orders, addItem, updateItem, deleteItem } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.jerseyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.phoneNumber.includes(searchTerm);
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = ["Customer", "Phone", "Address", "Jersey", "Team", "Size", "Qty", "Revenue", "Profit", "Status", "Date"];
    const rows = orders.map(o => [
      o.customerName,
      o.phoneNumber,
      `"${o.address}"`,
      o.jerseyName,
      o.teamName,
      o.size,
      o.quantity,
      o.sellingPrice * o.quantity,
      (o.sellingPrice - o.buyingCost) * o.quantity - o.deliveryCharge - o.otherExpense,
      o.status,
      o.date
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-slate-500 mt-1">Track history, manage statuses and verify payments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Export CSV</span>
          </button>
          <button 
            onClick={() => {
              setEditingOrder(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm">New Order</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by customer, jersey or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all text-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-10 outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all text-sm font-bold appearance-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 sticky top-0 backdrop-blur-sm border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer Details</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Jersey Info</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Order Totals</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Profit</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map((order) => {
                const revenue = order.sellingPrice * order.quantity;
                const totalCost = (order.buyingCost * order.quantity) + order.deliveryCharge + order.otherExpense;
                const profit = revenue - totalCost;

                return (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                          {order.customerName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{order.customerName}</p>
                          <p className="text-[11px] text-slate-500 font-medium">#{order.id.slice(0, 6)} • {order.phoneNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">{order.jerseyName}</p>
                      <p className="text-[11px] text-slate-500 font-medium">Size {order.size} • Qty {order.quantity}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{formatCurrency(revenue)}</p>
                      <p className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        order.paymentStatus === "Paid" ? "text-emerald-500" : "text-amber-500"
                      )}>
                        {order.paymentStatus}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <p className={cn(
                        "font-bold",
                        profit >= 0 ? "text-emerald-600" : "text-red-500"
                      )}>
                        {formatCurrency(profit)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors",
                        order.status === "Delivered" ? "bg-emerald-100 text-emerald-600" :
                        order.status === "Pending" ? "bg-orange-100 text-orange-600" :
                        order.status === "Confirmed" ? "bg-blue-100 text-blue-600" :
                        "bg-slate-100 text-slate-500"
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditingOrder(order);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                             if(confirm("Are you sure you want to delete this order?")) {
                               deleteItem("orders", order.id);
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
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200 border border-slate-100">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="text-center">
                <p className="text-slate-800 font-bold">No orders found</p>
                <p className="text-slate-400 text-xs">Try adjusting your filters or search terms.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Modal */}
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
              className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      {editingOrder ? "Edit Order Record" : "Register New Order"}
                    </h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">
                      {editingOrder ? "Order ID Reference: #" + editingOrder.id.slice(0, 8) : "Enter transaction details below"}
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                  <OrderForm 
                    initialData={editingOrder} 
                    onSubmit={async (data) => {
                      if (editingOrder) {
                        await updateItem("orders", editingOrder.id, data);
                      } else {
                        await addItem("orders", data);
                      }
                      setIsModalOpen(false);
                    }} 
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrderForm({ initialData, onSubmit }: { initialData: Order | null; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState<Partial<Order>>(initialData || {
    customerName: "",
    phoneNumber: "",
    address: "",
    jerseyName: "",
    teamName: "",
    size: "M",
    quantity: 1,
    sellingPrice: 15,
    buyingCost: 10,
    deliveryCharge: 5,
    otherExpense: 0,
    status: "Pending",
    paymentStatus: "Unpaid",
    date: new Date().toISOString().split("T")[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value
    }));
  };

  const revenue = (formData.sellingPrice || 0) * (formData.quantity || 0);
  const totalCost = ((formData.buyingCost || 0) * (formData.quantity || 0)) + (formData.deliveryCharge || 0) + (formData.otherExpense || 0);
  const profit = revenue - totalCost;

  return (
    <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {/* Customer Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800 mb-2 font-black italic uppercase tracking-widest text-[10px]">
            <User className="w-3.5 h-3.5 text-emerald-500" />
            <h3>Customer Intelligence</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Full Name</label>
              <input 
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold text-sm"
                placeholder="Ex. Sarah Jenkins"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Phone Number</label>
              <input 
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold text-sm"
                placeholder="Ex. +880 1XXX-XXXXXX"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Shipping Address</label>
              <textarea 
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold text-sm resize-none"
                placeholder="Detailed shipping coordinates..."
              />
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800 mb-2 font-black italic uppercase tracking-widest text-[10px]">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
            <h3>Inventory Details</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Jersey Variant</label>
              <input 
                name="jerseyName"
                value={formData.jerseyName}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold text-sm"
                placeholder="Ex. Arsenal Home 23/24"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Club/Team</label>
                <input 
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold text-sm"
                  placeholder="Ex. Arsenal"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Size Spec</label>
                <select 
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-sm appearance-none cursor-pointer"
                >
                  <option value="S">Small (S)</option>
                  <option value="M">Medium (M)</option>
                  <option value="L">Large (L)</option>
                  <option value="XL">Extra Large (XL)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Quantity</label>
                <input 
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Order Date</label>
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
          </div>
        </div>

        {/* Pricing & Profit */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800 mb-2 font-black italic uppercase tracking-widest text-[10px]">
            <Banknote className="w-3.5 h-3.5 text-emerald-500" />
            <h3>Financial Blueprint</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Unit Price</label>
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
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Procurement Cost</label>
              <input 
                type="number"
                name="buyingCost"
                value={formData.buyingCost}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-sm"
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Logistics Fee</label>
              <input 
                type="number"
                name="deliveryCharge"
                value={formData.deliveryCharge}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-sm"
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Overhead Cost</label>
              <input 
                type="number"
                name="otherExpense"
                value={formData.otherExpense}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-sm"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Statuses */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800 mb-2 font-black italic uppercase tracking-widest text-[10px]">
            <Truck className="w-3.5 h-3.5 text-emerald-500" />
            <h3>Execution Control</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Flow Status</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-sm appearance-none cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Financial Status</label>
              <select 
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-sm appearance-none cursor-pointer"
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          <div className="mt-8 p-6 bg-slate-900 rounded-3xl flex flex-col items-center justify-center text-center shadow-xl shadow-slate-200 border border-slate-800">
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2 leading-none">Net Transaction Surplus</p>
             <p className={cn(
               "text-4xl font-black transition-colors leading-none",
               profit >= 0 ? "text-emerald-400" : "text-red-400"
             )}>
               {formatCurrency(profit)}
             </p>
             <div className="mt-6 flex gap-8 w-full border-t border-slate-800 pt-6">
               <div className="flex-1">
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1.5">Gross Revenue</p>
                 <p className="text-white font-black text-lg leading-none">{formatCurrency(revenue)}</p>
               </div>
               <div className="flex-1">
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1.5">Cumulative Cost</p>
                 <p className="text-white font-black text-lg leading-none">{formatCurrency(totalCost)}</p>
               </div>
             </div>
          </div>
        </div>
      </div>

      <div className="pt-8 mt-8 border-t border-slate-100 flex gap-4">
        <button 
          type="button" 
          onClick={() => {}} // HANDLED BY MODAL
          className="flex-1 px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
        >
          Discard
        </button>
        <button 
          type="submit" 
          className="flex-[2] px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 text-sm"
        >
          {initialData ? "Commit Updates" : "Register Transaction"}
        </button>
      </div>
    </form>
  );
}
