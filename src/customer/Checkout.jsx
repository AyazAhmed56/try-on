import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  ArrowLeft,
  Package,
  Tag,
  Truck,
  CheckCircle,
  Leaf,
  ChevronDown,
} from "lucide-react";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { product, quantity, size } = location.state || {};

  const [profile, setProfile] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placing, setPlacing] = useState(false);
  //   const [focusedPay, setFocusedPay] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data } = await supabase
        .from("customer_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setProfile(data);
    };
    fetchProfile();
  }, []);

  const placeOrder = async () => {
    setPlacing(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const price = product.discountPrice || product.price;
    const tax = price * quantity * 0.18;
    const shipping = 50;
    const discount = 0;
    const total = price * quantity + tax + shipping - discount;
    console.log("Seller ID being inserted:", product?.seller?.user_id);
    const { error } = await supabase.from("orders").insert({
      customer_id: user.id,
      customer_name: profile.name,
      customer_email: profile.email,
      customer_phone: profile.phone,
      shipping_address: `${profile.address}\n${profile.city}\n${profile.state}\n${profile.pincode}`,
      outfit_id: product.id,
      seller_id: product?.seller?.user_id,
      quantity,
      price,
      tax,
      shipping,
      discount,
      total_amount: total,
      payment_method: paymentMethod,
      transaction_id: null,
      status: "Pending",
    });

    setPlacing(false);
    if (error) {
      console.log(error);
      alert("Order failed");
      return;
    }
    alert("Order placed successfully");
    navigate("/customer/orders");
  };

  if (!product)
    return (
      <div
        className="co-root min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg,#F0FDF4,#fff,#ECFDF5)" }}
      >
        <div className="text-center">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
            style={{ background: "#F0FDF4" }}
          >
            <Package style={{ width: 24, height: 24, color: "#9CA3AF" }} />
          </div>
          <p style={{ color: "#6B7280", fontWeight: 600 }}>No product found</p>
        </div>
      </div>
    );

  const price = product.discountPrice || product.price;
  const tax = price * quantity * 0.18;
  const shipping = 50;
  const total = price * quantity + tax + shipping;

  return (
    <div
      className="co-root min-h-screen py-12 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg,#F0FDF4 0%,#ffffff 45%,#ECFDF5 100%)",
      }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.025 }}
        >
          <defs>
            <pattern
              id="co-dots"
              x="0"
              y="0"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.4" fill="#16A34A" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#co-dots)" />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="back-btn inline-flex items-center gap-2 font-medium mb-8 transition-all group"
          style={{
            color: "#16A34A",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <span
            className="w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 group-hover:bg-green-600 group-hover:border-green-600"
            style={{
              background: "#fff",
              borderColor: "#BBF7D0",
              boxShadow: "0 1px 4px rgba(22,163,74,0.10)",
            }}
          >
            <ArrowLeft
              style={{ width: 14, height: 14 }}
              className="group-hover:text-white transition-colors"
            />
          </span>
          Back
        </button>

        {/* Page title */}
        <div className="page-header mb-8">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold mb-3"
            style={{
              background: "#F0FDF4",
              border: "1px solid #BBF7D0",
              color: "#15803D",
            }}
          >
            <ShoppingBag style={{ width: 13, height: 13 }} /> Secure Checkout
          </span>
          <h2
            className="font-bold"
            style={{
              fontSize: "clamp(26px,5vw,38px)",
              background: "linear-gradient(135deg,#15803D,#059669)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Checkout
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT COLUMN (2/3) ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Product card */}
            <div
              className="section-card bg-white rounded-3xl overflow-hidden"
              style={{
                boxShadow: "0 4px 24px rgba(22,163,74,0.08)",
                border: "1px solid rgba(187,247,208,0.6)",
              }}
            >
              <div
                className="h-1"
                style={{
                  background:
                    "linear-gradient(90deg,#16A34A,#10B981,#22C55E,#10B981,#16A34A)",
                  backgroundSize: "200% 100%",
                  animation: "shimBar 3s linear infinite",
                }}
              />
              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Package
                    style={{ width: 16, height: 16, color: "#16A34A" }}
                  />{" "}
                  Order Item
                </h3>

                <div className="flex items-start gap-4">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="rounded-2xl object-cover shrink-0"
                      style={{ width: 80, height: 96 }}
                    />
                  )}
                  <div className="flex-1">
                    <h4
                      className="font-bold text-gray-800 mb-2"
                      style={{ fontSize: 16 }}
                    >
                      {product.name}
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          background: "#DCFCE7",
                          color: "#15803D",
                          border: "1px solid #BBF7D0",
                        }}
                      >
                        <Package style={{ width: 10, height: 10 }} /> Qty:{" "}
                        {quantity}
                      </span>
                      {size && (
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                          style={{
                            background: "#D1FAE5",
                            color: "#065F46",
                            border: "1px solid #A7F3D0",
                          }}
                        >
                          <Tag style={{ width: 10, height: 10 }} /> Size: {size}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span
                        className="font-bold"
                        style={{ fontSize: 20, color: "#15803D" }}
                      >
                        ₹{price.toFixed(2)}
                      </span>
                      {product.discountPrice && (
                        <span
                          style={{
                            fontSize: 14,
                            color: "#D1D5DB",
                            textDecoration: "line-through",
                          }}
                        >
                          ₹{product.price.toFixed(2)}
                        </span>
                      )}
                      <span style={{ fontSize: 13, color: "#9CA3AF" }}>
                        per item
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping address card */}
            <div
              className="section-card bg-white rounded-3xl p-6"
              style={{
                boxShadow: "0 4px 24px rgba(22,163,74,0.08)",
                border: "1px solid rgba(187,247,208,0.6)",
              }}
            >
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin style={{ width: 16, height: 16, color: "#16A34A" }} />{" "}
                Shipping Address
              </h3>

              {profile ? (
                <div
                  className="rounded-2xl p-4"
                  style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
                >
                  <p className="font-semibold text-gray-800 mb-1">
                    {profile.name}
                  </p>
                  <p
                    style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.7 }}
                  >
                    {profile.address}
                    <br />
                    {profile.city}, {profile.state}
                    <br />
                    <span style={{ fontWeight: 600 }}>{profile.pincode}</span>
                  </p>
                  {profile.phone && (
                    <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 6 }}>
                      📞 {profile.phone}
                    </p>
                  )}
                </div>
              ) : (
                <div
                  className="flex items-center gap-3 rounded-2xl p-4"
                  style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-green-500 shrink-0"
                    style={{ animation: "spin 0.9s linear infinite" }}
                  />
                  <span style={{ fontSize: 14, color: "#6B7280" }}>
                    Loading address…
                  </span>
                </div>
              )}
            </div>

            {/* Payment method card */}
            <div
              className="section-card bg-white rounded-3xl p-6"
              style={{
                boxShadow: "0 4px 24px rgba(22,163,74,0.08)",
                border: "1px solid rgba(187,247,208,0.6)",
              }}
            >
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard
                  style={{ width: 16, height: 16, color: "#16A34A" }}
                />{" "}
                Payment Method
              </h3>

              <div className="flex flex-col gap-3">
                {[
                  {
                    value: "COD",
                    label: "Cash on Delivery",
                    icon: "💵",
                    desc: "Pay when your order arrives",
                  },
                  {
                    value: "Online",
                    label: "Online Payment",
                    icon: "💳",
                    desc: "Pay now via UPI / Card / Net Banking",
                  },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="pay-option flex items-center gap-4 rounded-2xl px-5 py-4 cursor-pointer transition-all duration-200"
                    style={{
                      border:
                        paymentMethod === opt.value
                          ? "2px solid #16A34A"
                          : "1.5px solid #E5E7EB",
                      background:
                        paymentMethod === opt.value ? "#F0FDF4" : "#fff",
                      boxShadow:
                        paymentMethod === opt.value
                          ? "0 0 0 3px rgba(22,163,74,0.10)"
                          : "none",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ accentColor: "#16A34A", width: 16, height: 16 }}
                    />
                    <span style={{ fontSize: 20 }}>{opt.icon}</span>
                    <div>
                      <p
                        className="font-semibold text-gray-800"
                        style={{ fontSize: 14 }}
                      >
                        {opt.label}
                      </p>
                      <p style={{ fontSize: 12, color: "#9CA3AF" }}>
                        {opt.desc}
                      </p>
                    </div>
                    {paymentMethod === opt.value && (
                      <CheckCircle
                        style={{
                          width: 18,
                          height: 18,
                          color: "#16A34A",
                          marginLeft: "auto",
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Order Summary (1/3) ── */}
          <div className="lg:col-span-1">
            <div
              className="summary-card bg-white rounded-3xl overflow-hidden sticky top-24"
              style={{
                boxShadow: "0 4px 28px rgba(22,163,74,0.10)",
                border: "1px solid rgba(187,247,208,0.7)",
              }}
            >
              <div
                className="h-1.5"
                style={{
                  background:
                    "linear-gradient(90deg,#16A34A,#10B981,#22C55E,#10B981,#16A34A)",
                  backgroundSize: "200% 100%",
                  animation: "shimBar 3s linear infinite",
                }}
              />

              <div className="p-6">
                <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <Leaf style={{ width: 16, height: 16, color: "#16A34A" }} />{" "}
                  Order Summary
                </h3>

                <div className="space-y-3 mb-5">
                  {[
                    {
                      label: `${product.name} × ${quantity}`,
                      value: `₹${(price * quantity).toFixed(2)}`,
                    },
                    { label: "Tax (GST 18%)", value: `₹${tax.toFixed(2)}` },
                    {
                      label: "Shipping",
                      value: `₹${shipping.toFixed(2)}`,
                      icon: (
                        <Truck
                          style={{ width: 12, height: 12, color: "#9CA3AF" }}
                        />
                      ),
                    },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span
                        className="flex items-center gap-1.5"
                        style={{ fontSize: 13, color: "#6B7280" }}
                      >
                        {row.icon}
                        {row.label}
                      </span>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#374151",
                        }}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className="flex justify-between items-center py-4 mb-5"
                  style={{ borderTop: "2px solid #BBF7D0" }}
                >
                  <span
                    className="font-bold text-gray-800"
                    style={{ fontSize: 16 }}
                  >
                    Total
                  </span>
                  <span
                    className="font-bold"
                    style={{
                      fontSize: 22,
                      background: "linear-gradient(135deg,#15803D,#059669)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ₹{total.toFixed(2)}
                  </span>
                </div>

                {/* Place order button */}
                <button
                  onClick={placeOrder}
                  disabled={placing || !profile}
                  className="place-btn w-full flex items-center justify-center gap-2 py-4 text-white font-bold rounded-2xl transition-all duration-200"
                  style={{
                    background:
                      placing || !profile
                        ? "linear-gradient(135deg,#86EFAC,#6EE7B7)"
                        : "linear-gradient(135deg,#16A34A,#10B981)",
                    boxShadow:
                      placing || !profile
                        ? "none"
                        : "0 4px 18px rgba(22,163,74,0.35)",
                    fontSize: 15,
                    cursor: placing || !profile ? "not-allowed" : "pointer",
                    border: "none",
                  }}
                >
                  {placing ? (
                    <>
                      <span className="spin-ring" />
                      Placing Order…
                    </>
                  ) : (
                    <>
                      <CheckCircle style={{ width: 18, height: 18 }} />
                      Place Order
                    </>
                  )}
                </button>

                <p
                  className="text-center mt-3"
                  style={{ fontSize: 11, color: "#9CA3AF" }}
                >
                  🔒 Secured & encrypted checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .co-root * { font-family: 'Plus Jakarta Sans', sans-serif; }

        .blob { position:absolute; border-radius:50%; filter:blur(88px); pointer-events:none; }
        .blob-1 { top:-60px; left:-60px; width:440px; height:440px;
          background:radial-gradient(circle,rgba(74,222,128,0.18),transparent 70%);
          animation:coBlob 11s ease-in-out infinite; }
        .blob-2 { bottom:-80px; right:-80px; width:480px; height:480px;
          background:radial-gradient(circle,rgba(16,185,129,0.14),transparent 70%);
          animation:coBlob 13s ease-in-out infinite; animation-delay:-5s; }
        @keyframes coBlob { 0%,100%{transform:translate(0,0)scale(1)} 50%{transform:translate(16px,-16px)scale(1.04)} }

        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes shimBar { 0%{background-position:100% 0} 100%{background-position:-100% 0} }

        .page-header  { animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .section-card { animation: slideUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }
        .summary-card { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        @keyframes slideUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

        .back-btn { animation: fadeIn 0.3s ease both; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        .pay-option:hover { border-color:#22C55E !important; background:#F0FDF4 !important; }

        .place-btn:hover:not(:disabled) { transform:translateY(-2px); filter:brightness(1.06); box-shadow:0 8px 28px rgba(22,163,74,0.38) !important; }
        .place-btn:active:not(:disabled) { transform:scale(0.99); }

        @keyframes spin2 { to{transform:rotate(360deg)} }
        .spin-ring {
          display:inline-block; width:17px; height:17px;
          border-radius:50%; border:2px solid rgba(255,255,255,0.35);
          border-top-color:#fff; animation:spin2 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Checkout;
