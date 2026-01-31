import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

const BackButtonByRole = () => {
  const navigate = useNavigate();

  const handleBack = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    // 🔹 Fetch role from profiles table
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      console.error("Role fetch error:", error);
      navigate("/");
      return;
    }

    // 🔹 Role-based navigation
    if (profile.role === "seller") {
      navigate("/my-items");
    } else if (profile.role === "customer") {
      navigate("/customer/all-items");
    } else {
      navigate("/");
    }
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 cursor-pointer font-medium mb-8 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Dashboard
    </button>
  );
};

export default BackButtonByRole;
