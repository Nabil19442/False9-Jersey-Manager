import React from "react";
import { useData } from "../context/DataContext";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area
} from "recharts";
import { formatCurrency, cn } from "../utils";
import { motion } from "motion/react";
import { Download, Filter, Calendar, TrendingUp, Wallet, ShoppingBag } from "lucide-react";

export default function Reports() {
  const { orders, expenses, inventory } = useData();

  // Financial Summaries
  const totalRevenue = orders.reduce((sum, o) => sum + o.sellingPrice * o.quantity, 0);
  const totalCostOfGoods = orders.reduce((sum, o) => sum + o.buyingCost * o.quantity, 0);
  const totalOperationalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalDeliveryCharges = orders.reduce((sum, o) => sum + o.deliveryCharge, 0);
  const totalOtherExpenses = orders.reduce((sum, o) => sum + o.otherExpense, 0);
  
  const grossProfit = totalRevenue - totalCostOfGoods;
  const netProfit = grossProfit - totalOperationalExpenses - totalDeliveryCharges - totalOtherExpenses;
  const totalExpenses = totalCostOfGoods + totalOperationalExpenses + totalDeliveryCharges + totalOtherExpenses;

  // Best Selling Jerseys
  const jerseySales = orders.reduce((acc: Record<string, number>, o) => {
    acc[o.jerseyName] = (acc[o.jerseyName] || 0) + o.quantity;
    return acc;
  }, {});
  
  const bestSellers = Object.entries(jerseySales)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a: any, b: any) => b.qty - a.qty)
    .slice(0, 5);

  // Expense Breakdown
  const expenseData = [
    { name: 'Cost of Goods', value: totalCostOfGoods },
    { name: 'Ad Spend', value: expenses.filter(e => e.category === 'Facebook Ads').reduce((s, e) => s + e.amount, 0) },
    { name: 'Logistics', value: totalDeliveryCharges + expenses.filter(e => e.category === 'Courier Cost').reduce((s, e) => s + e.amount, 0) },
    { name: 'Packaging/Misc', value: totalOtherExpenses + expenses.filter(e => e.category === 'Packaging').reduce((s, e) => s + e.amount, 0) },
  ];

  const COLORS = ['#0f172a', '#3b82f6', '#f59e0b', '#10b981'];

  // Monthly Performance (Mocking)
  const monthlyData = [
    { name: 'Jan', revenue: 4000, profit: 2400 },
    { name: 'Feb', revenue: 3000, profit: 1398 },
    { name: 'Mar', revenue: 2000, profit: 9800 },
    { name: 'Apr', revenue: 2780, profit: 3908 },
    { name: 'May', revenue: totalRevenue, profit: netProfit },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Intelligence Reports</h1>
          <p className="text-slate-500 mt-1">Deep dive into your business financial performance and trends.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors shadow-sm">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span className="text-sm">Interval Range</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95">
            <Download className="w-4 h-4" />
            <span className="text-sm">Export Intelligence</span>
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-200 overflow-hidden relative group border border-slate-800">
          <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-700" />
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2 leading-none">Net Transaction Surplus</p>
          <h3 className="text-4xl font-black mb-4 tracking-tighter tabular-nums">{formatCurrency(netProfit)}</h3>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
            Growth Index: +14.2%
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2 leading-none">Gross Asset Flow</p>
            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight tabular-nums">{formatCurrency(totalRevenue)}</h3>
          </div>
          <div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[72%]" />
            </div>
            <p className="text-[10px] text-slate-400 mt-4 font-black uppercase tracking-widest">Monthly Target Progression: 72%</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2 leading-none">Cumulative Burn Rate</p>
            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight tabular-nums">{formatCurrency(totalExpenses)}</h3>
          </div>
          <div className="flex items-center gap-2 text-orange-500 text-[10px] font-black uppercase tracking-widest border border-orange-100 bg-orange-50/50 p-3 rounded-xl">
             Noticeable Ad-Spend Variance detected
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Performance */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Asset Liquidity Over Time</h2>
          <div className="h-[350px]">
             <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={monthlyData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }} />
                 <Tooltip 
                   contentStyle={{ 
                     backgroundColor: '#1e293b', 
                     borderRadius: '12px', 
                     border: 'none', 
                     boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                     color: '#fff'
                   }} 
                   itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}
                 />
                 <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.1em' }} />
                 <Area type="monotone" dataKey="revenue" fill="#10b981" fillOpacity={0.05} stroke="none" />
                 <Bar dataKey="revenue" barSize={24} fill="#0f172a" radius={[4, 4, 0, 0]} />
                 <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
               </ComposedChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Capital Allocation Matrix</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
             <div className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={expenseData}
                     cx="50%"
                     cy="50%"
                     innerRadius={70}
                     outerRadius={90}
                     paddingAngle={8}
                     dataKey="value"
                     stroke="none"
                   >
                     {expenseData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip 
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                   />
                 </PieChart>
               </ResponsiveContainer>
             </div>
             <div className="space-y-4">
               {expenseData.map((item, index) => (
                 <div key={item.name} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0">
                   <div className="flex items-center gap-3">
                     <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                     <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">{item.name}</span>
                   </div>
                   <span className="text-sm font-black text-slate-900 tabular-nums">{formatCurrency(item.value)}</span>
                 </div>
               ))}
             </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100">
             <div className="p-4 bg-slate-900 rounded-2xl flex items-center justify-between shadow-lg shadow-slate-100 border border-slate-800">
               <div className="flex items-center gap-3">
                 <Wallet className="w-4 h-4 text-emerald-500" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Net Surplus Margin</span>
               </div>
               <span className="text-xl font-black text-emerald-400">
                 {((netProfit / (totalRevenue || 1)) * 100).toFixed(1)}%
               </span>
             </div>
          </div>
        </div>

        {/* Best Sellers */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Dominant Catalog Items</h2>
          <div className="space-y-6">
             {bestSellers.map((item: any, index) => (
               <div key={item.name} className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-[10px] text-slate-400 border border-slate-100">
                   {String(index + 1).padStart(2, '0')}
                 </div>
                 <div className="flex-1">
                   <div className="flex justify-between mb-1">
                     <span className="text-sm font-bold text-slate-800">{item.name}</span>
                     <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{item.qty} Registered</span>
                   </div>
                   <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden border border-slate-100">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${(item.qty / (bestSellers[0].qty as number)) * 100}%` }}
                       className="bg-emerald-500 h-full"
                     ></motion.div>
                   </div>
                 </div>
               </div>
             ))}
             {bestSellers.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-50">
                   <ShoppingBag className="w-12 h-12 text-slate-200" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Data processing in progress...<br/>Awaiting primary sales injection.</p>
                </div>
             )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
           <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-6 shadow-inner border border-emerald-100">
             <ShoppingBag className="w-8 h-8" />
           </div>
           <h3 className="text-lg font-black text-slate-900 mb-1 leading-tight tracking-tight uppercase">Inventory Vitality Check</h3>
           <p className="text-slate-400 text-xs font-medium mb-8 max-w-[240px]">
             Critical Notice: <span className="text-slate-900 font-bold">{inventory.filter(i => i.stockQuantity < 5).length} SKU elements</span> are currently below depletion thresholds.
           </p>
           <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 text-sm">
              Strategic Restock Protocol
           </button>
        </div>
      </div>
    </div>
  );
}
