import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

const SellerPending = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md w-full">
        <h1 className="text-2xl font-bold mb-3 text-gray-800">
          Approval Pending ⏳
        </h1>

        <p className="text-gray-600 mb-2">
          Your seller account is under review.
        </p>

        <p className="text-gray-500 text-sm mb-6">
          Please wait until admin approves your account.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            Check Status
          </button>

          <button
            onClick={logout}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerPending;
