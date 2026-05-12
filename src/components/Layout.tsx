import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Receipt, 
  BarChart3, 
  Settings, 
  LogOut, 
  User,
  Menu,
  X,
  Shirt,
  Search,
  Bell
} from "lucide-react";
import { useData } from "../context/DataContext";
import { cn } from "../utils";
import { motion, AnimatePresence } from "motion/react";

const SidebarItem = ({ 
  to, 
  icon: Icon, 
  label, 
  isActive, 
  onClick 
}: { 
  to: string; 
  icon: any; 
  label: string; 
  isActive: boolean;
  onClick: () => void;
  key?: React.Key;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      isActive 
        ? "bg-emerald-500/10 text-emerald-400" 
        : "text-slate-400 hover:text-white hover:bg-slate-800"
    )}
  >
    <Icon className={cn("w-5 h-5", isActive ? "text-emerald-400" : "group-hover:text-white")} />
    <span className="font-medium">{label}</span>
  </Link>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout, user, inventory } = useData();

  const menuItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/orders", icon: ShoppingCart, label: "Orders" },
    { to: "/inventory", icon: Package, label: "Inventory" },
    { to: "/expenses", icon: Receipt, label: "Expenses" },
    { to: "/reports", icon: BarChart3, label: "Analytics" },
  ];

  const totalStock = inventory.reduce((sum, item) => sum + item.stockQuantity, 0);

  if (!user) return <>{children}</>;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-slate-900 text-white h-16 fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-2 rounded-lg text-white">
            <Shirt className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">JerseyFlow</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-slate-800 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside className={cn(
        "fixed lg:static top-0 left-0 bottom-0 w-64 bg-slate-900 flex flex-col shrink-0 z-50 transition-transform duration-300 transform lg:translate-x-0 outline-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
              <Shirt className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">JerseyFlow</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.to}
              onClick={() => setIsSidebarOpen(false)}
            />
          ))}
        </nav>

        <div className="p-4 space-y-6">
          <div className="bg-slate-800 p-4 rounded-2xl">
            <p className="text-xs text-slate-400 mb-1">Available Stock</p>
            <p className="text-lg font-bold text-white mb-2">{totalStock.toLocaleString()} Units</p>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${Math.min((totalStock / 2000) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <button 
            onClick={() => {
              logout();
              setIsSidebarOpen(false);
            }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-8 shrink-0 bg-white hidden lg:flex">
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 focus-within:border-slate-900 transition-colors">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search orders, products..." 
              className="bg-transparent outline-none text-sm w-64 font-medium"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200 hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5 text-slate-500" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">Admin Panel</p>
                <p className="text-xs text-slate-500 font-medium">{user.email}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center border border-emerald-200 text-emerald-600 font-black">
                {user.email[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-auto bg-slate-50/50">
          <div className="p-4 md:p-8 max-w-7xl mx-auto pt-20 lg:pt-8">
            {children}
          </div>
        </div>

        {/* Status Bar Footer */}
        <footer className="h-10 border-t border-slate-100 px-8 flex items-center justify-between text-[10px] text-slate-400 shrink-0 bg-white">
          <div className="flex gap-6 uppercase tracking-widest font-bold">
            <span>System Status: <span className="text-emerald-500">Operational</span></span>
            <span>Last Sync: Just now</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="font-bold uppercase tracking-wider text-slate-500">Active Admin Session</span>
          </div>
        </footer>
      </main>
    </div>
  );
};
