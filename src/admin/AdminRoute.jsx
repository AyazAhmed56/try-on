import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../services/supabase";

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      setIsAdmin(profile?.role === "admin");
      setLoading(false);
    };
    checkAdmin();
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;
