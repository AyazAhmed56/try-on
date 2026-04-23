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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 via-white to-emerald-50 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-green-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-100 rounded-full opacity-40 blur-3xl" />
      </div>

      <div className="relative bg-white border border-green-100 rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-200">
              <span className="text-4xl">⏳</span>
            </div>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full border-2 border-white animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
          Approval Pending
        </h1>

        {/* Desc */}
        <p className="text-gray-600 text-sm mb-1 leading-relaxed">
          Your seller account is currently under review by our admin team.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          You'll be notified once your account is approved.
        </p>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { label: "Registered", done: true },
            { label: "Under Review", active: true },
            { label: "Approved", done: false },
          ].map((step, i) => (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${
                    step.done
                      ? "bg-linear-to-br from-green-500 to-emerald-400 text-white shadow-md"
                      : step.active
                        ? "bg-yellow-100 border-2 border-yellow-400 text-yellow-600 animate-pulse"
                        : "bg-gray-100 border-2 border-gray-200 text-gray-400"
                  }`}
                >
                  {step.done ? "✓" : i + 1}
                </div>
                <span
                  className={`text-xs font-medium ${step.done ? "text-green-600" : step.active ? "text-yellow-600" : "text-gray-400"}`}
                >
                  {step.label}
                </span>
              </div>
              {i < 2 && (
                <div
                  className={`w-8 h-0.5 rounded-full mb-4 ${step.done ? "bg-linear-to-r from-green-400 to-emerald-400" : "bg-gray-200"}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
          >
            <span>🔄</span>
            <span>Check Status</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-600 hover:text-red-600 py-3 rounded-xl font-semibold transition-all duration-200"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>

        {/* Footer note */}
        <p className="text-xs text-gray-400 mt-6">
          Need help? Contact support at{" "}
          <a
            href="mailto:support@example.com"
            className="text-green-600 hover:underline"
          >
            support@example.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default SellerPending;
