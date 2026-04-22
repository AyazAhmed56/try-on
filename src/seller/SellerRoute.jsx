import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../services/supabase";

const SellerRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkSeller = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      // 🔥 THIS IS YOUR CODE (CORRECT PLACE)
      const { data: seller } = await supabase
        .from("seller_profiles")
        .select("*")
        .eq("user_id", data.user.id)
        .single();

      if (seller?.approved) {
        setAllowed(true);
      } else {
        setAllowed(false);
      }

      setLoading(false);
    };

    checkSeller();
  }, []);

  if (loading) return <div>Loading...</div>;

  return allowed ? children : <Navigate to="/seller/pending" />;
};

export default SellerRoute;
