import React, { useEffect, useState, useCallback } from "react";
import {
  Package,
  Search,
  Eye,
  Download,
  Calendar,
  ArrowLeft,
  CheckCircle,
  ShoppingBag,
  Leaf,
  X,
  MapPin,
  CreditCard,
  Hash,
  TrendingUp,
} from "lucide-react";
import { supabase } from "../services/supabase";
import { Link, useNavigate } from "react-router-dom";
import "jspdf-autotable";
import html2pdf from "html2pdf.js";

const statusStyles = {
  Delivered: { bg: "#DCFCE7", color: "#15803D", border: "#BBF7D0" },
  Shipped: { bg: "#DBEAFE", color: "#1D4ED8", border: "#BFDBFE" },
  Pending: { bg: "#FEF9C3", color: "#92400E", border: "#FDE68A" },
  Cancelled: { bg: "#FEE2E2", color: "#991B1B", border: "#FECACA" },
};

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("orders")
        .select(
          `
  *,
  outfits (
    name,
    seller_profiles (
      shop_name,
      gst_no,
      address,
      city,
      state,
      pincode,
      shop_logo
    )
  )
`,
        )
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Order fetch error:", error);
        return;
      }

      console.log("Orders:", data);

      setOrders(
        (data || []).map((order) => {
          const product = order.outfits || {};

          const mainImage =
            product?.outfit_images?.find((img) => img.is_main)?.image_url ||
            null;

          return {
            ...order, // ⭐ ADD THIS LINE (IMPORTANT)

            id: order.id,

            orderId: order.id
              ? `ORD-${order.id.slice(0, 6).toUpperCase()}`
              : "ORD-XXXX",

            date: new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),

            seller_id: product?.seller_id ?? null,

            quantity: order.quantity ?? 0,
            total: order.total_amount ?? 0,

            // ✅ FIXED STATUS
            status: order.status
              ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
              : "Pending",

            paymentMethod: order.payment_method ?? "N/A",
            shippingAddress: order.shipping_address ?? "N/A",

            product: {
              name: product?.name ?? "Unknown Product",
              category: product?.category ?? "N/A",
              price: product?.price ?? 0,
              image: mainImage,
            },

            seller: {
              name: product?.seller_profiles?.shop_name ?? "Unknown Seller",
            },
          };
        }),
      );
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    setFilteredOrders(
      !q
        ? orders
        : orders.filter(
            (o) =>
              o.orderId.toLowerCase().includes(q) ||
              o.product.name.toLowerCase().includes(q) ||
              o.status.toLowerCase().includes(q),
          ),
    );
  }, [searchQuery, orders]);

  const handleDownload = (order) => {
    const element = document.createElement("div");
    const seller = order.outfits?.seller_profiles || {};

    const shopInitial = (seller.shop_name || "S").charAt(0).toUpperCase();
    const shopLocation = [seller.city, seller.state].filter(Boolean).join(", ");
    const shopAddress = [
      seller.address,
      seller.city,
      seller.state,
      seller.pincode ? "- " + seller.pincode : "",
    ]
      .filter(Boolean)
      .join(", ");
    const orderDate = order.date; // instead of created_at
    const orderId = "#" + String(order.id).slice(0, 8).toUpperCase();

    element.innerHTML = `
  <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
  
    <!-- TOP ACCENT -->
    <div style="height: 3px; background: #3B6D11;"></div>
  
    <!-- HEADER -->
    <div style="padding: 28px 32px 20px; border-bottom: 1px solid #e5e7eb;">
      <div style="display: flex; align-items: flex-start; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 14px;">
          ${
            seller.shop_logo
              ? `<img src="${seller.shop_logo}" style="width:48px; height:48px; object-fit:cover; border-radius:8px; flex-shrink:0;" />`
              : `<div style="width:48px; height:48px; background:#EAF3DE; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:500; color:#3B6D11; flex-shrink:0;">${shopInitial}</div>`
          }
          <div>
            <p style="margin:0 0 2px; font-size:17px; font-weight:600; color:#111827;">${seller.shop_name || "Your Store"}</p>
            <p style="margin:0; font-size:12px; color:#6b7280;">${shopAddress || "Mumbai, Maharashtra"}</p>
            ${seller.gst_no ? `<p style="font-size:11px; color:#9ca3af; margin:2px 0 0;">GST: ${seller.gst_no}</p>` : ""}
          </div>
        </div>
        <div style="text-align:right;">
          <p style="margin:0 0 4px; font-size:11px; color:#9ca3af; text-transform:uppercase; letter-spacing:0.5px;">Document</p>
          <p style="margin:0 0 8px; font-size:14px; font-weight:500; color:#111827;">Tax Invoice</p>
          <span style="background:#EAF3DE; color:#27500A; font-size:11px; font-weight:500; padding:3px 10px; border-radius:20px;">${order.status || "Pending"}</span>
        </div>
      </div>
    </div>
  
    <!-- META ROW -->
    <div style="display:flex; justify-content:space-between; background:#f9fafb; padding:16px 32px; border-bottom:1px solid #e5e7eb;">
      <div>
        <p style="margin:0 0 3px; font-size:10px; color:#9ca3af; text-transform:uppercase; letter-spacing:0.8px;">Order ID</p>
        <p style="margin:0; font-size:13px; font-weight:600; color:#111827; font-family:monospace;">${orderId}</p>
      </div>
      <div style="text-align:center;">
        <p style="margin:0 0 3px; font-size:10px; color:#9ca3af; text-transform:uppercase; letter-spacing:0.8px;">Quantity</p>
        <p style="margin:0; font-size:13px; font-weight:600; color:#111827;">${order.quantity} item${order.quantity > 1 ? "s" : ""}</p>
      </div>
      <div style="text-align:right;">
        <p style="margin:0 0 3px; font-size:10px; color:#9ca3af; text-transform:uppercase; letter-spacing:0.8px;">Date</p>
        <p style="margin:0; font-size:13px; font-weight:600; color:#111827;">${orderDate}</p>
      </div>
    </div>
  
    <!-- BODY -->
    <div style="padding:24px 32px;">
  
      <!-- CUSTOMER INFO -->
      <p style="margin:0 0 12px; font-size:10px; font-weight:600; color:#3B6D11; text-transform:uppercase; letter-spacing:1px;">Customer Info</p>
      <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
        <tr>
          <td style="width:50%; padding-right:8px; vertical-align:top;">
            <div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:14px;">
              <p style="margin:0 0 8px; font-size:10px; color:#9ca3af; text-transform:uppercase; letter-spacing:0.8px;">Bill To</p>
              <p style="margin:0 0 4px; font-size:14px; font-weight:600; color:#111827;">${order.name || "—"}</p>
              <p style="margin:0 0 3px; font-size:12px; color:#6b7280;">${order.email || "—"}</p>
              <p style="margin:0; font-size:12px; color:#6b7280;">${order.phone || "—"}</p>
            </div>
          </td>
          <td style="width:50%; padding-left:8px; vertical-align:top;">
            <div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:14px;">
              <p style="margin:0 0 8px; font-size:10px; color:#9ca3af; text-transform:uppercase; letter-spacing:0.8px;">Ship To</p>
              <p style="margin:0; font-size:12px; color:#374151; line-height:1.7;">${order.shipping_address || "—"}</p>
            </div>
          </td>
        </tr>
      </table>
  
      <!-- ITEMS TABLE -->
      <p style="margin:0 0 12px; font-size:10px; font-weight:600; color:#3B6D11; text-transform:uppercase; letter-spacing:1px;">Items Ordered</p>
      <table style="width:100%; border-collapse:collapse; margin-bottom:4px;">
        <thead>
          <tr style="border-bottom:1px solid #e5e7eb;">
            <th style="padding:8px 0; font-size:10px; font-weight:500; color:#9ca3af; text-transform:uppercase; letter-spacing:0.8px; text-align:left;">Product</th>
            <th style="padding:8px 0; font-size:10px; font-weight:500; color:#9ca3af; text-transform:uppercase; letter-spacing:0.8px; text-align:center;">Qty</th>
            <th style="padding:8px 0; font-size:10px; font-weight:500; color:#9ca3af; text-transform:uppercase; letter-spacing:0.8px; text-align:right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid #f3f4f6;">
            <td style="padding:14px 0; font-size:14px; color:#111827;">${order.outfits?.name || "—"}</td>
            <td style="padding:14px 0; font-size:13px; color:#6b7280; text-align:center;">${order.quantity}</td>
            <td style="padding:14px 0; font-size:14px; font-weight:600; color:#111827; text-align:right;">₹${order.total_amount}</td>
          </tr>
        </tbody>
      </table>
  
      <!-- TOTALS -->
      <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
        <tr>
          <td style="width:55%;"></td>
          <td style="width:45%; vertical-align:top; padding-top:8px;">
            <div style="font-size:13px;">
              <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #f3f4f6;">
                <span style="color:#6b7280;">Subtotal</span>
                <span style="color:#111827;">₹${order.total_amount}</span>
              </div>
              <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #f3f4f6;">
                <span style="color:#6b7280;">Shipping</span>
                <span style="color:#3B6D11; font-weight:500;">Free</span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; background:#EAF3DE; border-radius:8px; padding:12px 14px; margin-top:8px;">
                <span style="font-size:11px; font-weight:600; color:#27500A; text-transform:uppercase; letter-spacing:0.5px;">Total</span>
                <span style="font-size:18px; font-weight:700; color:#173404;">₹${order.total}</span>
              </div>
            </div>
          </td>
        </tr>
      </table>
  
      <!-- PAYMENT -->
      <p style="margin:0 0 12px; font-size:10px; font-weight:600; color:#3B6D11; text-transform:uppercase; letter-spacing:1px;">Payment</p>
      <div style="display:flex; align-items:center; justify-content:space-between; background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:14px 16px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:38px; height:38px; background:#EAF3DE; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <div style="width:18px; height:12px; background:#639922; border-radius:2px;"></div>
          </div>
          <div>
            <p style="margin:0 0 2px; font-size:10px; color:#9ca3af; text-transform:uppercase; letter-spacing:0.5px;">Payment Method</p>
            <p style="margin:0; font-size:14px; font-weight:600; color:#111827;">${order.payment_method || "—"}</p>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <div style="width:7px; height:7px; background:#3B6D11; border-radius:50%;"></div>
          <span style="font-size:12px; color:#3B6D11; font-weight:500;">Confirmed</span>
        </div>
      </div>
  
    </div>
  
    <!-- FOOTER -->
    <div style="background:#f9fafb; border-top:1px solid #e5e7eb; padding:20px 32px; text-align:center;">
      <p style="margin:0 0 4px; font-size:14px; font-weight:600; color:#111827;">Thank you for your purchase!</p>
      <p style="margin:0 0 16px; font-size:12px; color:#6b7280;">For support, reply to your order confirmation email.</p>
      <div style="border-top:1px solid #e5e7eb; padding-top:14px; display:flex; justify-content:space-between;">
        <span style="font-size:11px; color:#9ca3af;">${seller.shop_name || "Store"} · ${shopLocation || "India"}</span>
        <span style="font-size:11px; color:#9ca3af;">© ${new Date().getFullYear()} All rights reserved</span>
      </div>
    </div>
  
    <!-- BOTTOM ACCENT -->
    <div style="height:3px; background:#3B6D11;"></div>
  
  </div>`;

    html2pdf()
      .set({
        margin: 0,
        filename: `receipt-${order.id}.pdf`,
        html2canvas: { scale: 3, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const statusStyle = (s) =>
    statusStyles[s] || { bg: "#F3F4F6", color: "#374151", border: "#E5E7EB" };

  return (
    <div
      className="mo-root min-h-screen py-10 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg,#F0FDF4 0%,#ffffff 45%,#ECFDF5 100%)",
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.025 }}
        >
          <defs>
            <pattern
              id="mo-dots"
              x="0"
              y="0"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.4" fill="#16A34A" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mo-dots)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div className="page-header">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold mb-2"
              style={{
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                color: "#15803D",
              }}
            >
              <ShoppingBag style={{ width: 13, height: 13 }} /> Order History
            </span>
            <h1
              className="font-bold mb-0.5"
              style={{
                fontSize: "clamp(26px,5vw,38px)",
                background: "linear-gradient(135deg,#15803D,#059669)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              My Orders
            </h1>
            <p style={{ color: "#6B7280", fontSize: 14 }}>
              {filteredOrders.length} order
              {filteredOrders.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <Link
            to="/customer/dashboard"
            className="back-btn inline-flex items-center gap-2 font-medium transition-all group"
            style={{ color: "#16A34A", textDecoration: "none" }}
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
            Dashboard
          </Link>
        </div>

        {/* Stats row */}
        <div className="stats-row grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: Package,
              label: "Total Orders",
              value: orders.length,
              color: "#16A34A",
              bg: "#DCFCE7",
            },
            {
              icon: TrendingUp,
              label: "Total Spent",
              value: `₹${totalSpent.toFixed(0)}`,
              color: "#059669",
              bg: "#D1FAE5",
            },
            {
              icon: CheckCircle,
              label: "Delivered",
              value: delivered,
              color: "#10B981",
              bg: "#ECFDF5",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="stat-card bg-white rounded-2xl p-5 flex items-center gap-4 transition-all duration-200"
              style={{
                boxShadow: "0 2px 16px rgba(22,163,74,0.07)",
                border: "1px solid rgba(187,247,208,0.5)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: s.bg }}
              >
                <s.icon style={{ width: 22, height: 22, color: s.color }} />
              </div>
              <div>
                <p
                  className="font-bold"
                  style={{ fontSize: 24, color: "#111827", lineHeight: 1.1 }}
                >
                  {s.value}
                </p>
                <p style={{ fontSize: 13, color: "#6B7280" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search bar */}
        <div className="search-row mb-7">
          <div className="relative max-w-xl">
            <Search
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                width: 16,
                height: 16,
                color: searchFocused ? "#16A34A" : "#9CA3AF",
                transition: "color 0.2s",
              }}
            />
            <input
              type="text"
              placeholder="Search by order ID, product, or status…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                width: "100%",
                paddingLeft: 44,
                paddingRight: 16,
                paddingTop: 12,
                paddingBottom: 12,
                border: `1px solid ${searchFocused ? "#22C55E" : "#E5E7EB"}`,
                borderRadius: 12,
                outline: "none",
                fontSize: 14,
                color: "#111827",
                background: "#fff",
                boxShadow: searchFocused
                  ? "0 0 0 3px rgba(34,197,94,0.15)"
                  : "0 1px 6px rgba(0,0,0,0.04)",
                transition: "all 0.2s ease",
              }}
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-24 gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#16A34A,#10B981)" }}
            >
              <div
                className="w-10 h-10 rounded-full border-2 border-white/40 border-t-white"
                style={{ animation: "spin 0.9s linear infinite" }}
              />
            </div>
            <p style={{ color: "#16A34A", fontWeight: 600 }}>Loading orders…</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredOrders.length === 0 && (
          <div
            className="empty-state bg-white rounded-3xl p-16 text-center"
            style={{
              boxShadow: "0 4px 20px rgba(22,163,74,0.07)",
              border: "1px solid rgba(187,247,208,0.5)",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: "#F0FDF4" }}
            >
              <Package style={{ width: 28, height: 28, color: "#9CA3AF" }} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No orders yet
            </h3>
            <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 20 }}>
              {searchQuery
                ? "Try adjusting your search"
                : "Start shopping to see your orders here"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate("/customer/products")}
                className="place-btn inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg,#16A34A,#10B981)",
                  boxShadow: "0 4px 14px rgba(22,163,74,0.30)",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                <ShoppingBag style={{ width: 16, height: 16 }} /> Browse
                Products
              </button>
            )}
          </div>
        )}

        {/* Orders list */}
        {!loading && filteredOrders.length > 0 && (
          <div className="orders-list space-y-4">
            {filteredOrders.map((order, idx) => {
              const ss = statusStyle(order.status);
              return (
                <div
                  key={order.id}
                  className="order-card bg-white rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200"
                  style={{
                    boxShadow: "0 2px 14px rgba(22,163,74,0.07)",
                    border: "1px solid rgba(187,247,208,0.5)",
                    animationDelay: `${idx * 45}ms`,
                  }}
                >
                  {/* Left: image + info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {order.product.image ? (
                      <img
                        src={order.product.image}
                        alt={order.product.name}
                        className="rounded-xl object-cover shrink-0"
                        style={{ width: 68, height: 80 }}
                      />
                    ) : (
                      <div
                        className="rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          width: 68,
                          height: 80,
                          background: "#F0FDF4",
                          border: "1px solid #BBF7D0",
                        }}
                      >
                        <Package
                          style={{ width: 26, height: 26, color: "#9CA3AF" }}
                        />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4
                          className="font-bold text-gray-800 truncate"
                          style={{ fontSize: 15 }}
                        >
                          {order.product.name}
                        </h4>
                        <span
                          className="text-xs font-medium"
                          style={{ color: "#9CA3AF" }}
                        >
                          {order.orderId}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 13,
                          color: "#9CA3AF",
                          marginBottom: 6,
                        }}
                      >
                        {order.product.category} · Qty: {order.quantity}
                      </p>
                      <div className="flex flex-wrap gap-2 items-center">
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-semibold"
                          style={{
                            fontSize: 11,
                            background: ss.bg,
                            color: ss.color,
                            border: `1px solid ${ss.border}`,
                          }}
                        >
                          <span
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              background: ss.color,
                              display: "inline-block",
                            }}
                          />
                          {order.status}
                        </span>
                        <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                          {order.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: price + actions */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 shrink-0">
                    <p
                      className="font-bold"
                      style={{
                        fontSize: 20,
                        background: "linear-gradient(135deg,#15803D,#059669)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      ₹{order.total.toFixed(0)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(order)}
                        className="action-btn flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition-all duration-200"
                        style={{
                          background: "linear-gradient(135deg,#16A34A,#10B981)",
                          color: "#fff",
                          border: "none",
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(22,163,74,0.25)",
                        }}
                      >
                        <Download style={{ width: 13, height: 13 }} /> PDF
                      </button>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="action-btn flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition-all duration-200"
                        style={{
                          background: "#fff",
                          color: "#16A34A",
                          border: "1.5px solid #BBF7D0",
                          cursor: "pointer",
                        }}
                      >
                        <Eye style={{ width: 13, height: 13 }} /> Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── ORDER DETAIL MODAL ── */}
        {selectedOrder && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(4px)",
            }}
            onClick={(e) =>
              e.target === e.currentTarget && setSelectedOrder(null)
            }
          >
            <div
              className="modal-card bg-white rounded-3xl overflow-hidden w-full max-w-md"
              style={{
                boxShadow: "0 16px 60px rgba(0,0,0,0.20)",
                border: "1px solid rgba(187,247,208,0.6)",
              }}
            >
              {/* Modal header */}
              <div
                className="relative px-6 py-5 flex items-center justify-between"
                style={{
                  background: "linear-gradient(135deg,#15803D,#16A34A,#059669)",
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{
                    background:
                      "linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)",
                    animation: "shimBar 2.5s linear infinite",
                  }}
                />
                <div>
                  <h2 className="font-bold text-white" style={{ fontSize: 18 }}>
                    Order Details
                  </h2>
                  <p style={{ color: "#BBF7D0", fontSize: 12 }}>
                    {selectedOrder.orderId}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    cursor: "pointer",
                  }}
                >
                  <X style={{ width: 15, height: 15, color: "#fff" }} />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-6 space-y-4">
                {/* Product row */}
                <div
                  className="flex items-center gap-4 rounded-2xl p-4"
                  style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
                >
                  {selectedOrder.product.image ? (
                    <img
                      src={selectedOrder.product.image}
                      alt={selectedOrder.product.name}
                      className="rounded-xl object-cover shrink-0"
                      style={{ width: 56, height: 68 }}
                    />
                  ) : (
                    <div
                      className="rounded-xl flex items-center justify-center shrink-0"
                      style={{ width: 56, height: 68, background: "#DCFCE7" }}
                    >
                      <Package
                        style={{ width: 22, height: 22, color: "#16A34A" }}
                      />
                    </div>
                  )}
                  <div>
                    <p
                      className="font-bold text-gray-800"
                      style={{ fontSize: 15 }}
                    >
                      {selectedOrder.product.name}
                    </p>
                    <p style={{ fontSize: 13, color: "#9CA3AF" }}>
                      {selectedOrder.product.category}
                    </p>
                  </div>
                </div>

                {/* Detail rows */}
                {[
                  {
                    icon: Hash,
                    label: "Order ID",
                    value: selectedOrder.orderId,
                  },
                  {
                    icon: Package,
                    label: "Quantity",
                    value: selectedOrder.quantity,
                  },
                  { icon: Calendar, label: "Date", value: selectedOrder.date },
                  {
                    icon: CreditCard,
                    label: "Payment Method",
                    value: selectedOrder.paymentMethod,
                  },
                  {
                    icon: MapPin,
                    label: "Shipping Address",
                    value: selectedOrder.shippingAddress,
                  },
                ].map((row, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "#DCFCE7" }}
                    >
                      <row.icon
                        style={{ width: 14, height: 14, color: "#16A34A" }}
                      />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#9CA3AF",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {row.label}
                      </p>
                      <p style={{ fontSize: 14, color: "#374151" }}>
                        {row.value}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Status + total */}
                <div
                  className="flex items-center justify-between pt-2"
                  style={{ borderTop: "1px solid #F0FDF4" }}
                >
                  <div className="flex items-center gap-2">
                    {(() => {
                      const ss = statusStyle(selectedOrder.status);
                      return (
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold"
                          style={{
                            fontSize: 12,
                            background: ss.bg,
                            color: ss.color,
                            border: `1px solid ${ss.border}`,
                          }}
                        >
                          <CheckCircle style={{ width: 12, height: 12 }} />{" "}
                          {selectedOrder.status}
                        </span>
                      );
                    })()}
                  </div>
                  <p
                    className="font-bold"
                    style={{
                      fontSize: 22,
                      background: "linear-gradient(135deg,#15803D,#059669)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ₹{selectedOrder.total.toFixed(0)}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="place-btn w-full py-3 text-white font-semibold rounded-xl transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg,#16A34A,#10B981)",
                    boxShadow: "0 4px 14px rgba(22,163,74,0.28)",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .mo-root * { font-family: 'Plus Jakarta Sans', sans-serif; }

        .blob { position:absolute; border-radius:50%; filter:blur(88px); pointer-events:none; }
        .blob-1 { top:-60px; left:-60px; width:440px; height:440px;
          background:radial-gradient(circle,rgba(74,222,128,0.18),transparent 70%);
          animation:moBlob 11s ease-in-out infinite; }
        .blob-2 { bottom:-80px; right:-80px; width:480px; height:480px;
          background:radial-gradient(circle,rgba(16,185,129,0.14),transparent 70%);
          animation:moBlob 13s ease-in-out infinite; animation-delay:-5s; }
        @keyframes moBlob { 0%,100%{transform:translate(0,0)scale(1)} 50%{transform:translate(16px,-16px)scale(1.04)} }

        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes shimBar { 0%{background-position:100% 0} 100%{background-position:-100% 0} }

        .page-header { animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .stats-row   { animation: slideUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
        .search-row  { animation: slideUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.08s both; }
        .orders-list { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
        .empty-state { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        @keyframes slideUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

        .order-card { animation: fadeLeft 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes fadeLeft { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        .order-card:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(22,163,74,0.11) !important; }

        .stat-card:hover  { transform:translateY(-2px); box-shadow:0 6px 20px rgba(22,163,74,0.11) !important; }

        .action-btn:hover  { transform:translateY(-1px); filter:brightness(1.06); }
        .action-btn:active { transform:scale(0.97); }

        .place-btn:hover  { transform:translateY(-1px); filter:brightness(1.06); }
        .place-btn:active { transform:scale(0.98); }

        .back-btn { animation: fadeIn 0.3s ease both; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        .modal-card { animation: modalIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
        @keyframes modalIn { from{opacity:0;transform:scale(0.88)translateY(20px)} to{opacity:1;transform:scale(1)translateY(0)} }
      `}</style>
    </div>
  );
};

export default MyOrders;
