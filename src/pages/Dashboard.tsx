import React from "react";
import { useData } from "../context/DataContext";
import { 
  TrendingUp, 
  TrendingDown, 
  Banknote, 
  ShoppingCart, 
  Package, 
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  CreditCard,
  Target
} from "lucide-react";
import { formatCurrency, cn } from "../utils";
import { motion } from "motion/react";

const StatCard = ({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  colorClass,
  trendColorClass
}: { 
  title: string; 
  value: string | number; 
  trend?: string; 
  icon: any; 
  colorClass: string;
  trendColorClass?: string;
}) => (
  <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colorClass)}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <span className={cn("text-xs font-bold px-2 py-1 rounded-full", trendColorClass || "bg-emerald-50 text-emerald-600")}>
          {trend}
        </span>
      )}
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <p className="text-2xl font-bold mt-1 text-slate-900">{value}</p>
  </div>
);

export default function Dashboard() {
  const { orders, expenses } = useData();

  // Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.sellingPrice * o.quantity, 0);
  const buyingCost = orders.reduce((sum, o) => sum + (o.buyingCost * o.quantity), 0);
  const deliveryCharges = orders.reduce((sum, o) => sum + o.deliveryCharge, 0);
  const otherOrderExpenses = orders.reduce((sum, o) => sum + o.otherExpense, 0);
  const operationalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  const totalExpensesCount = buyingCost + operationalExpenses + deliveryCharges + otherOrderExpenses;
  const netProfit = totalRevenue - totalExpensesCount;
  
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const deliveredOrders = orders.filter(o => o.status === "Delivered").length;

  const monthlyTarget = 25000;
  const targetProgress = Math.min((totalRevenue / monthlyTarget) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(totalRevenue)} 
          trend="+12%"
          icon={Banknote}
          colorClass="bg-blue-50 text-blue-600"
          trendColorClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard 
          title="Net Profit" 
          value={formatCurrency(netProfit)} 
          trend="+8.4%"
          icon={TrendingUp}
          colorClass="bg-emerald-50 text-emerald-600"
          trendColorClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard 
          title="Pending Orders" 
          value={pendingOrders} 
          trend="14 New"
          icon={Clock}
          colorClass="bg-orange-50 text-orange-600"
          trendColorClass="bg-orange-50 text-orange-600"
        />
        <StatCard 
          title="Delivered" 
          value={deliveredOrders} 
          trend="Total"
          icon={CheckCircle2}
          colorClass="bg-purple-50 text-purple-600"
          trendColorClass="bg-slate-100 text-slate-400"
        />
      </div>

      {/* Main Visuals Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-min">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[450px]">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between shrink-0">
            <h3 className="font-bold text-slate-800">Recent Orders</h3>
            <button className="text-xs text-blue-600 font-bold hover:underline">View All</button>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 sticky top-0 backdrop-blur-sm">
                <tr>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Order ID</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Jersey</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm font-bold text-slate-900 capitalize">#{order.id.slice(0, 4)}</td>
                    <td className="p-4 text-sm text-slate-600 font-medium">{order.customerName}</td>
                    <td className="p-4 text-sm text-slate-600">{order.jerseyName}</td>
                    <td className="p-4 text-sm font-bold text-slate-800">{formatCurrency(order.sellingPrice * order.quantity)}</td>
                    <td className="p-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                        order.status === "Delivered" ? "bg-emerald-100 text-emerald-600" :
                        order.status === "Pending" ? "bg-orange-100 text-orange-600" :
                        "bg-slate-100 text-slate-500"
                      )}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 font-medium italic">No orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column Widgets */}
        <div className="flex flex-col gap-6">
          {/* Monthly Target */}
          <div className="bg-emerald-600 p-6 rounded-2xl shadow-sm text-white flex-1 min-h-[210px] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg">Monthly Target</h3>
              <Target className="w-5 h-5 opacity-60" />
            </div>
            <div className="text-center py-4">
              <p className="text-4xl font-black">{formatCurrency(monthlyTarget)}</p>
              <p className="text-emerald-200 text-xs mt-1 font-bold">Total Sales Goal</p>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between text-xs font-bold text-emerald-100">
                <span>Current: {formatCurrency(totalRevenue)}</span>
                <span>{targetProgress.toFixed(0)}%</span>
              </div>
              <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-emerald-700">
                <div 
                  style={{ width: `${targetProgress}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-white transition-all duration-1000"
                ></div>
              </div>
            </div>
          </div>
          
          {/* Quick Stats / Expense Breakdown */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex-1 min-h-[210px]">
            <h3 className="text-slate-800 font-bold mb-6 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-500" />
              Expenses Breakdown
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-semibold text-slate-500">Inventory</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{formatCurrency(buyingCost)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                  <span className="text-sm font-semibold text-slate-500">Logistics</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{formatCurrency(deliveryCharges)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-semibold text-slate-500">Operations</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{formatCurrency(operationalExpenses)}</span>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Total</span>
                <span className="text-lg font-black text-slate-900">{formatCurrency(totalExpensesCount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
