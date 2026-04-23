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
  Smartphone,
  X,
  Shield,
  Zap,
} from "lucide-react";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { product, quantity, size } = location.state || {};

  const [profile, setProfile] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placing, setPlacing] = useState(false);
  const [showPaymentUI, setShowPaymentUI] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [activePayTab, setActivePayTab] = useState("upi");

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
    const total = price * quantity + tax + shipping;
    const { error } = await supabase.from("orders").insert({
      customer_id: user.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      shipping_address: profile.address,
      city: profile.city,
      state: profile.state,
      pincode: profile.pincode,
      outfit_id: product.id,
      seller_id: product?.seller?.user_id,
      quantity,
      price,
      total_amount: total,
      payment_method: paymentMethod,
      status: "pending",
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

  const handleFakePayment = async () => {
    if (!upiId && !cardNumber) {
      alert("Enter UPI or Card details");
      return;
    }
    setTimeout(async () => {
      setPaymentSuccess(true);
      setShowPaymentUI(false);
      alert("Payment Successful ✅");
      await placeOrder();
    }, 1500);
  };

  if (!product)
    return (
      <div className="co-root min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="no-product-icon">
            <Package style={{ width: 28, height: 28, color: "#9CA3AF" }} />
          </div>
          <p className="no-product-text">No product found</p>
        </div>
        <style>{baseStyles}</style>
      </div>
    );

  const price = product.discountPrice || product.price;
  const tax = price * quantity * 0.18;
  const shipping = 50;
  const total = price * quantity + tax + shipping;

  return (
    <div className="co-root min-h-screen py-10 px-4 relative overflow-hidden">
      {/* Ambient background */}
      <div className="bg-canvas" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <svg className="dot-grid" aria-hidden="true">
          <defs>
            <pattern
              id="co-dots"
              x="0"
              y="0"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.2" fill="#16A34A" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#co-dots)" />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Back button */}
        <button onClick={() => navigate(-1)} className="back-btn">
          <span className="back-circle">
            <ArrowLeft style={{ width: 14, height: 14 }} />
          </span>
          <span>Back</span>
        </button>

        {/* Page header */}
        <div className="page-header mb-8">
          <span className="secure-badge">
            <Shield style={{ width: 12, height: 12 }} />
            Secure Checkout
          </span>
          <h2 className="page-title">Checkout</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Product card */}
            <div className="section-card anim-1">
              <div className="shim-bar" />
              <div className="p-6">
                <h3 className="card-heading">
                  <Package
                    style={{ width: 15, height: 15, color: "#16A34A" }}
                  />
                  Order Item
                </h3>
                <div className="flex items-start gap-4">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-thumb"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="product-name">{product.name}</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="badge badge-green">
                        <Package style={{ width: 10, height: 10 }} />
                        Qty: {quantity}
                      </span>
                      {size && (
                        <span className="badge badge-emerald">
                          <Tag style={{ width: 10, height: 10 }} />
                          Size: {size}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="price-main">₹{price.toFixed(2)}</span>
                      {product.discountPrice && (
                        <span className="price-strike">
                          ₹{product.price.toFixed(2)}
                        </span>
                      )}
                      <span className="price-unit">per item</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div className="section-card anim-2 p-6">
              <h3 className="card-heading">
                <MapPin style={{ width: 15, height: 15, color: "#16A34A" }} />
                Shipping Address
              </h3>
              {profile ? (
                <div className="address-box">
                  <div className="address-avatar">
                    {profile.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="address-name">{profile.name}</p>
                    <p className="address-line">
                      {profile.address}
                      <br />
                      {profile.city}, {profile.state} —{" "}
                      <strong>{profile.pincode}</strong>
                    </p>
                    {profile.phone && (
                      <p className="address-phone">📞 {profile.phone}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="loading-row">
                  <div className="spin-ring-sm" />
                  <span style={{ fontSize: 14, color: "#6B7280" }}>
                    Loading address…
                  </span>
                </div>
              )}
            </div>

            {/* Payment method */}
            <div className="section-card anim-3 p-6">
              <h3 className="card-heading">
                <CreditCard
                  style={{ width: 15, height: 15, color: "#16A34A" }}
                />
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
                    className={`pay-option ${paymentMethod === opt.value ? "pay-active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ accentColor: "#16A34A", width: 16, height: 16 }}
                    />
                    <span className="pay-emoji">{opt.icon}</span>
                    <div>
                      <p className="pay-label">{opt.label}</p>
                      <p className="pay-desc">{opt.desc}</p>
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

                {paymentMethod === "Online" && (
                  <div className="online-pay-box">
                    <div className="online-pay-info">
                      <Zap
                        style={{ width: 14, height: 14, color: "#16A34A" }}
                      />
                      <span>Instant & secure payment</span>
                    </div>
                    <button
                      onClick={() => setShowPaymentUI(true)}
                      className="pay-now-btn"
                    >
                      <span>Pay ₹{total.toFixed(2)}</span>
                      <span className="pay-now-arrow">→</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Summary ── */}
          <div className="lg:col-span-1">
            <div className="summary-card sticky top-24">
              <div className="shim-bar" />
              <div className="p-6">
                <h3 className="card-heading mb-5">
                  <Leaf style={{ width: 15, height: 15, color: "#16A34A" }} />
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
                          style={{ width: 11, height: 11, color: "#9CA3AF" }}
                        />
                      ),
                    },
                  ].map((row, i) => (
                    <div key={i} className="summary-row">
                      <span className="summary-label">
                        {row.icon}
                        {row.label}
                      </span>
                      <span className="summary-value">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="total-row">
                  <span className="total-label">Total</span>
                  <span className="total-amount">₹{total.toFixed(2)}</span>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={placing || !profile || paymentMethod === "Online"}
                  className={`place-btn ${placing || !profile ? "place-btn-disabled" : ""}`}
                >
                  {placing ? (
                    <>
                      <span className="spin-ring-btn" />
                      Placing Order…
                    </>
                  ) : (
                    <>
                      <CheckCircle style={{ width: 17, height: 17 }} />
                      Place Order
                    </>
                  )}
                </button>

                <p className="secure-note">🔒 Secured & encrypted checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Payment Modal ── */}
      {showPaymentUI && (
        <div className="modal-overlay" onClick={() => setShowPaymentUI(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal header */}
            <div className="modal-header">
              <div>
                <span className="modal-badge">
                  <Shield style={{ width: 11, height: 11 }} />
                  Secure Payment
                </span>
                <h3 className="modal-title">Complete Payment</h3>
                <p className="modal-amount">₹{total.toFixed(2)}</p>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowPaymentUI(false)}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {/* Tab switcher */}
            <div className="pay-tabs">
              {[
                {
                  key: "upi",
                  label: "UPI",
                  icon: <Smartphone style={{ width: 14, height: 14 }} />,
                },
                {
                  key: "card",
                  label: "Card",
                  icon: <CreditCard style={{ width: 14, height: 14 }} />,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`pay-tab ${activePayTab === tab.key ? "pay-tab-active" : ""}`}
                  onClick={() => setActivePayTab(tab.key)}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* UPI panel */}
            {activePayTab === "upi" && (
              <div className="pay-panel">
                <label className="field-label">UPI ID</label>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="pay-input"
                />
                <p className="field-hint">e.g. name@okaxis, name@paytm</p>
              </div>
            )}

            {/* Card panel */}
            {activePayTab === "card" && (
              <div className="pay-panel">
                <label className="field-label">Card Number</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="pay-input"
                  maxLength={19}
                />
                <div className="card-row">
                  <div>
                    <label className="field-label">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="pay-input pay-input-sm"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="field-label">CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      className="pay-input pay-input-sm"
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
            )}

            <button onClick={handleFakePayment} className="modal-pay-btn">
              <Shield style={{ width: 15, height: 15 }} />
              Pay ₹{total.toFixed(2)} Securely
            </button>
            <button
              onClick={() => setShowPaymentUI(false)}
              className="modal-cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <style>{baseStyles}</style>
    </div>
  );
};

const baseStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');

  .co-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }

  /* ── Page background ── */
  .co-root {
    background: linear-gradient(160deg, #F0FDF4 0%, #ffffff 50%, #ECFDF5 100%);
  }
  .bg-canvas { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
  .dot-grid  { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.03; }

  .blob { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; }
  .blob-1 { top: -80px; left: -80px; width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(74,222,128,0.22), transparent 70%);
    animation: blobFloat 12s ease-in-out infinite; }
  .blob-2 { bottom: -100px; right: -80px; width: 520px; height: 520px;
    background: radial-gradient(circle, rgba(16,185,129,0.18), transparent 70%);
    animation: blobFloat 14s ease-in-out infinite; animation-delay: -6s; }
  .blob-3 { top: 40%; left: 50%; width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(34,197,94,0.10), transparent 70%);
    animation: blobFloat 10s ease-in-out infinite; animation-delay: -3s; }
  @keyframes blobFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(20px,-20px) scale(1.05); }
  }

  /* ── Back button ── */
  .back-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: none; border: none; cursor: pointer;
    color: #16A34A; font-size: 14px; font-weight: 500;
    margin-bottom: 28px; padding: 0;
    animation: fadeSlideDown 0.3s ease both;
  }
  .back-btn:hover .back-circle { background: #16A34A; border-color: #16A34A; color: #fff; }
  .back-circle {
    width: 32px; height: 32px; border-radius: 50%;
    background: #fff; border: 1px solid #BBF7D0;
    box-shadow: 0 1px 6px rgba(22,163,74,0.12);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s ease; color: #16A34A;
  }

  /* ── Page header ── */
  .page-header { animation: fadeSlideDown 0.4s ease both; }
  .secure-badge {
    display: inline-flex; align-items: center; gap: 5px;
    background: #F0FDF4; border: 1px solid #BBF7D0;
    color: #15803D; font-size: 12px; font-weight: 600;
    border-radius: 999px; padding: 5px 14px; margin-bottom: 10px;
  }
  .page-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(28px, 5vw, 42px);
    background: linear-gradient(135deg, #15803D, #059669, #10B981);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin: 0;
  }

  /* ── Section cards ── */
  .section-card {
    background: #fff;
    border-radius: 24px;
    border: 1px solid rgba(187,247,208,0.7);
    box-shadow: 0 4px 28px rgba(22,163,74,0.07);
    overflow: hidden;
    transition: box-shadow 0.25s ease, transform 0.25s ease;
  }
  .section-card:hover {
    box-shadow: 0 8px 36px rgba(22,163,74,0.13);
    transform: translateY(-2px);
  }
  .summary-card {
    background: #fff;
    border-radius: 24px;
    border: 1px solid rgba(187,247,208,0.8);
    box-shadow: 0 4px 28px rgba(22,163,74,0.10);
    overflow: hidden;
    animation: fadeSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both;
  }

  .anim-1 { animation: fadeSlideUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }
  .anim-2 { animation: fadeSlideUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.08s both; }
  .anim-3 { animation: fadeSlideUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.16s both; }

  @keyframes fadeSlideUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeSlideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }

  /* ── Shimmer bar ── */
  .shim-bar {
    height: 4px;
    background: linear-gradient(90deg, #16A34A, #10B981, #22C55E, #10B981, #16A34A);
    background-size: 200% 100%;
    animation: shimBar 3s linear infinite;
  }
  @keyframes shimBar { 0%{background-position:100% 0} 100%{background-position:-100% 0} }

  /* ── Card heading ── */
  .card-heading {
    display: flex; align-items: center; gap: 8px;
    font-size: 15px; font-weight: 600; color: #1F2937;
    margin: 0 0 16px;
  }

  /* ── Product ── */
  .product-thumb { width: 80px; height: 96px; border-radius: 16px; object-fit: cover; flex-shrink: 0; }
  .product-name  { font-size: 16px; font-weight: 700; color: #1F2937; margin: 0 0 10px; }
  .price-main    { font-size: 20px; font-weight: 700; color: #15803D; }
  .price-strike  { font-size: 14px; color: #D1D5DB; text-decoration: line-through; }
  .price-unit    { font-size: 13px; color: #9CA3AF; }

  /* ── Badges ── */
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    border-radius: 999px; padding: 4px 12px;
    font-size: 11px; font-weight: 600;
  }
  .badge-green   { background: #DCFCE7; color: #15803D; border: 1px solid #BBF7D0; }
  .badge-emerald { background: #D1FAE5; color: #065F46; border: 1px solid #A7F3D0; }

  /* ── Address ── */
  .address-box {
    display: flex; align-items: flex-start; gap: 14px;
    background: #F0FDF4; border: 1px solid #BBF7D0;
    border-radius: 16px; padding: 16px;
  }
  .address-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    background: linear-gradient(135deg, #16A34A, #10B981);
    color: #fff; font-size: 16px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .address-name  { font-weight: 600; color: #1F2937; font-size: 15px; margin: 0 0 4px; }
  .address-line  { font-size: 13px; color: #4B5563; line-height: 1.7; margin: 0 0 4px; }
  .address-phone { font-size: 12px; color: #9CA3AF; margin: 0; }
  .loading-row   { display: flex; align-items: center; gap: 12px; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 14px; padding: 14px; }

  /* ── Spinners ── */
  @keyframes spin { to { transform: rotate(360deg); } }
  .spin-ring-sm  { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #D1FAE5; border-top-color: #10B981; animation: spin 0.9s linear infinite; flex-shrink: 0; }
  .spin-ring-btn { display: inline-block; width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; animation: spin 0.8s linear infinite; }

  /* ── Payment options ── */
  .pay-option {
    display: flex; align-items: center; gap: 14px;
    border-radius: 18px; padding: 14px 18px; cursor: pointer;
    border: 1.5px solid #E5E7EB; background: #fff;
    transition: all 0.2s ease;
  }
  .pay-option:hover { border-color: #86EFAC; background: #F0FDF4; }
  .pay-active { border: 2px solid #16A34A !important; background: #F0FDF4 !important; box-shadow: 0 0 0 4px rgba(22,163,74,0.08); }
  .pay-emoji { font-size: 22px; line-height: 1; }
  .pay-label { font-size: 14px; font-weight: 600; color: #1F2937; margin: 0 0 2px; }
  .pay-desc  { font-size: 12px; color: #9CA3AF; margin: 0; }

  .online-pay-box {
    background: linear-gradient(135deg, #F0FDF4, #ECFDF5);
    border: 1px solid #BBF7D0; border-radius: 16px;
    padding: 16px; margin-top: 4px;
    display: flex; flex-direction: column; gap: 12px;
  }
  .online-pay-info {
    display: flex; align-items: center; gap: 6px;
    font-size: 13px; color: #15803D; font-weight: 500;
  }
  .pay-now-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    background: linear-gradient(135deg, #16A34A, #059669);
    color: #fff; font-size: 15px; font-weight: 700;
    border: none; border-radius: 14px; padding: 13px;
    cursor: pointer; transition: all 0.2s ease;
    box-shadow: 0 4px 16px rgba(22,163,74,0.3);
    font-family: 'DM Sans', sans-serif;
  }
  .pay-now-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(22,163,74,0.38); }
  .pay-now-btn:active { transform: scale(0.98); }
  .pay-now-arrow { font-size: 18px; }

  /* ── Summary ── */
  .summary-row   { display: flex; justify-content: space-between; align-items: center; }
  .summary-label { display: flex; align-items: center; gap: 5px; font-size: 13px; color: #6B7280; }
  .summary-value { font-size: 14px; font-weight: 500; color: #374151; }
  .total-row     { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-top: 2px solid #BBF7D0; margin-bottom: 20px; }
  .total-label   { font-size: 16px; font-weight: 700; color: #1F2937; }
  .total-amount  {
    font-size: 24px; font-weight: 700;
    background: linear-gradient(135deg, #15803D, #059669);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  /* ── Place order button ── */
  .place-btn {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 15px; border-radius: 18px; border: none;
    background: linear-gradient(135deg, #16A34A, #10B981);
    color: #fff; font-size: 15px; font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 20px rgba(22,163,74,0.35);
    cursor: pointer; transition: all 0.2s ease;
  }
  .place-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(22,163,74,0.4); filter: brightness(1.05); }
  .place-btn:active:not(:disabled) { transform: scale(0.99); }
  .place-btn-disabled,
  .place-btn:disabled {
    background: linear-gradient(135deg, #86EFAC, #6EE7B7) !important;
    box-shadow: none !important; cursor: not-allowed !important;
  }
  .secure-note { text-align: center; margin-top: 12px; font-size: 11px; color: #9CA3AF; }

  /* ── No product ── */
  .no-product-icon {
    width: 60px; height: 60px; border-radius: 20px; background: #F0FDF4;
    margin: 0 auto 12px; display: flex; align-items: center; justify-content: center;
  }
  .no-product-text { font-size: 15px; color: #6B7280; font-weight: 600; }

  /* ── Payment Modal ── */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(0,0,0,0.45); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; padding: 16px;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

  .modal-card {
    background: #fff; border-radius: 28px; width: 100%; max-width: 400px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(187,247,208,0.5);
    overflow: hidden;
    animation: modalPop 0.3s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes modalPop { from{opacity:0;transform:scale(0.94) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }

  .modal-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 24px 24px 0; margin-bottom: 20px;
  }
  .modal-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 600; color: #15803D;
    background: #F0FDF4; border: 1px solid #BBF7D0;
    border-radius: 999px; padding: 4px 10px; margin-bottom: 6px;
  }
  .modal-title  { font-family: 'DM Serif Display', serif; font-size: 22px; color: #1F2937; margin: 0 0 2px; }
  .modal-amount { font-size: 28px; font-weight: 700; background: linear-gradient(135deg,#15803D,#059669); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; }
  .modal-close  {
    width: 32px; height: 32px; border-radius: 50%; background: #F9FAFB;
    border: 1px solid #E5E7EB; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #6B7280; flex-shrink: 0; transition: all 0.2s;
  }
  .modal-close:hover { background: #FEE2E2; border-color: #FCA5A5; color: #EF4444; }

  /* ── Pay tabs ── */
  .pay-tabs {
    display: flex; gap: 0; margin: 0 24px 20px;
    background: #F0FDF4; border-radius: 12px; padding: 4px;
    border: 1px solid #BBF7D0;
  }
  .pay-tab {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 9px; border-radius: 9px; border: none; cursor: pointer;
    font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif;
    background: none; color: #6B7280; transition: all 0.2s;
  }
  .pay-tab:hover { color: #16A34A; }
  .pay-tab-active { background: #fff; color: #15803D; box-shadow: 0 1px 6px rgba(22,163,74,0.15); }

  /* ── Pay panels ── */
  .pay-panel { padding: 0 24px 20px; }
  .field-label { display: block; font-size: 12px; font-weight: 600; color: #6B7280; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.04em; }
  .field-hint  { font-size: 11px; color: #9CA3AF; margin-top: 5px; }
  .pay-input {
    width: 100%; border: 1.5px solid #E5E7EB; border-radius: 12px;
    padding: 12px 14px; font-size: 14px; font-family: 'DM Sans', sans-serif;
    color: #1F2937; background: #fff; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .pay-input:focus { border-color: #16A34A; box-shadow: 0 0 0 3px rgba(22,163,74,0.12); }
  .pay-input::placeholder { color: #D1D5DB; }
  .pay-input-sm { width: 100%; }
  .card-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }

  /* ── Modal action buttons ── */
  .modal-pay-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    margin: 0 24px 12px; width: calc(100% - 48px);
    background: linear-gradient(135deg, #16A34A, #059669);
    color: #fff; font-size: 15px; font-weight: 700;
    border: none; border-radius: 16px; padding: 14px;
    cursor: pointer; transition: all 0.2s ease;
    box-shadow: 0 4px 18px rgba(22,163,74,0.32);
    font-family: 'DM Sans', sans-serif;
  }
  .modal-pay-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(22,163,74,0.42); }
  .modal-pay-btn:active { transform: scale(0.98); }
  .modal-cancel {
    display: block; width: calc(100% - 48px); margin: 0 24px 24px;
    background: none; border: none; color: #9CA3AF; font-size: 13px;
    font-family: 'DM Sans', sans-serif; cursor: pointer; padding: 8px;
    border-radius: 12px; transition: color 0.2s;
  }
  .modal-cancel:hover { color: #6B7280; background: #F9FAFB; }
`;

export default Checkout;
