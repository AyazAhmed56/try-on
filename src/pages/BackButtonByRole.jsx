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

    // Fetch role from profiles table
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

    // Role-based navigation
    if (profile.role === "seller") {
      navigate("/my-items");
    } else if (profile.role === "customer") {
      navigate("/customer/all-items");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <button
        onClick={handleBack}
        className="back-btn-role inline-flex items-center gap-2 font-medium mb-8 cursor-pointer transition-all group"
        style={{
          color: "#16A34A",
          background: "none",
          border: "none",
          padding: 0,
        }}
      >
        <span
          className="arrow-wrap w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200"
          style={{
            background: "#fff",
            borderColor: "#BBF7D0",
            boxShadow: "0 1px 4px rgba(22,163,74,0.10)",
          }}
        >
          <ArrowLeft style={{ width: 14, height: 14 }} />
        </span>
        Back to Dashboard
      </button>

      <style>{`
        .back-btn-role:hover { color: #15803D; }
        .back-btn-role:hover .arrow-wrap {
          background: #16A34A !important;
          border-color: #16A34A !important;
          color: white;
          box-shadow: 0 4px 12px rgba(22,163,74,0.28) !important;
        }
        .back-btn-role:active .arrow-wrap {
          transform: scale(0.94);
        }
      `}</style>
    </>
  );
};

export default BackButtonByRole;
