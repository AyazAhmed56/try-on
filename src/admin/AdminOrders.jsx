import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase.from("orders").select("*");

      if (error) {
        console.error(error);
        setOrders([]);
        return;
      }

      setOrders(data || []);
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">All Orders</h1>

      {orders.map((o) => (
        <div key={o.id} className="p-3 bg-white mb-2 shadow">
          Order ID: {o.id} | Status: {o.status}
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
