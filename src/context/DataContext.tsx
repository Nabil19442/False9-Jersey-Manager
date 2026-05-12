import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Order, Expense, InventoryItem, User } from "../types";
import toast from "react-hot-toast";

interface DataContextType {
  orders: Order[];
  inventory: InventoryItem[];
  expenses: Expense[];
  loading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addItem: (collection: string, item: any) => Promise<void>;
  updateItem: (collection: string, id: string, item: any) => Promise<void>;
  deleteItem: (collection: string, id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("jerseypro_user");
    return saved ? JSON.parse(saved) : null;
  });

  const refreshData = async () => {
    try {
      const res = await fetch("/api/db");
      const data = await res.json();
      setOrders(data.orders || []);
      setInventory(data.inventory || []);
      setExpenses(data.expenses || []);
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast.error("Failed to load business data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("jerseypro_user", JSON.stringify(data.user));
        toast.success("Welcome back, Admin!");
        return true;
      }
      toast.error(data.message || "Login failed");
      return false;
    } catch (error) {
      toast.error("An error occurred during login");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("jerseypro_user");
    toast.success("Logged out successfully");
  };

  const addItem = async (collection: string, item: any) => {
    try {
      const res = await fetch(`/api/${collection}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        await refreshData();
        toast.success(`Item added to ${collection}`);
      }
    } catch (error) {
      toast.error("Failed to add item");
    }
  };

  const updateItem = async (collection: string, id: string, item: any) => {
    try {
      const res = await fetch(`/api/${collection}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        await refreshData();
        toast.success("Updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update item");
    }
  };

  const deleteItem = async (collection: string, id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    try {
      const res = await fetch(`/api/${collection}/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await refreshData();
        toast.success("Deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  return (
    <DataContext.Provider
      value={{
        orders,
        inventory,
        expenses,
        loading,
        user,
        login,
        logout,
        addItem,
        updateItem,
        deleteItem,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
