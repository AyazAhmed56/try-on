import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    orders: 0,
    users: 0,
    products: 0,
    sellers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: orders } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      const { count: users } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { count: products } = await supabase
        .from("outfits")
        .select("*", { count: "exact", head: true });

      const { count: sellers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "seller");

      setStats({ orders, users, products, sellers });
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-white shadow rounded">
          Orders: {stats.orders}
        </div>
        <div className="p-4 bg-white shadow rounded">Users: {stats.users}</div>
        <div className="p-4 bg-white shadow rounded">
          Products: {stats.products}
        </div>
        <div className="p-4 bg-white shadow rounded">
          Sellers: {stats.sellers}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
