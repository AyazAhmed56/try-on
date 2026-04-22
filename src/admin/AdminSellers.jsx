import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const fetchSellers = async () => {
    const { data: sellersData, error } = await supabase
      .from("seller_profiles")
      .select("*");

    if (error) {
      console.error(error);
      setSellers([]);
      return;
    }

    // fetch emails separately
    const users = await Promise.all(
      (sellersData || []).map(async (s) => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", s.user_id)
          .single();

        return {
          ...s,
          email: profile?.email,
        };
      }),
    );

    setSellers(users);
  };
  useEffect(() => {
    fetchSellers();
  }, []);

  const approveSeller = async (id) => {
    await supabase
      .from("seller_profiles")
      .update({ approved: true })
      .eq("user_id", id);
    fetchSellers();
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Seller Approval</h1>

      {sellers.map((s) => (
        <div
          key={s.user_id}
          className="p-3 bg-white mb-2 shadow flex justify-between"
        >
          <span>{s.email}</span>

          {!s.approved && (
            <button
              onClick={() => approveSeller(s.user_id)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminSellers;
