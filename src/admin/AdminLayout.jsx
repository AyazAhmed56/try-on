import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

const AdminLayout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <ul className="space-y-3">
          <li>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/products">Products</Link>
          </li>
          <li>
            <Link to="/admin/orders">Orders</Link>
          </li>
          <li>
            <Link to="/admin/customers">Customers</Link>
          </li>
          <li>
            <Link to="/admin/sellers">Sellers</Link>
          </li>
        </ul>

        <button onClick={logout} className="mt-6 bg-red-500 px-3 py-2 rounded">
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
