import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Printer,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Package,
  CreditCard,
  CheckCircle,
  FileText,
  Leaf,
} from "lucide-react";
import { supabase } from "../services/supabase";
import html2pdf from "html2pdf.js";

const OrderReceipt = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const receiptRef = useRef(null);

  const statusStyles = {
    delivered: { bg: "#DCFCE7", color: "#15803D", border: "#BBF7D0" },
    shipped: { bg: "#DBEAFE", color: "#1D4ED8", border: "#BFDBFE" },
    pending: { bg: "#FEF9C3", color: "#92400E", border: "#FDE68A" },
    cancelled: { bg: "#FEE2E2", color: "#991B1B", border: "#FECACA" },
  };

  useEffect(() => {
    const fetchOrderReceipt = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!orderId) {
          setError("No order ID provided");
          setLoading(false);
          return;
        }

        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select(
            `id, created_at, quantity, price, tax, shipping, discount, total_amount,
            status, delivery_date, payment_method, transaction_id,
            customer_name, customer_email, customer_phone, shipping_address, seller_id,
            outfits(name, category, outfit_images(image_url, is_main))`,
          )
          .eq("id", orderId)
          .single();

        if (orderError) {
          setError("Order not found");
          setLoading(false);
          return;
        }
        setOrder(orderData);

        const { data: sellerData, error: sellerError } = await supabase
          .from("seller_profiles")
          .select("*")
          .eq("user_id", orderData.seller_id)
          .single();
        if (!sellerError && sellerData) setSeller(sellerData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load receipt", err);
        setLoading(false);
      }
    };
    fetchOrderReceipt();
  }, [orderId]);

  const handlePrint = () => window.print();
  const handleDownload = () =>
    html2pdf().from(receiptRef.current).save(`receipt-${order.id}.pdf`);

  if (loading)
    return (
      <div
        className="or-root min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg,#F0FDF4,#fff,#ECFDF5)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#16A34A,#10B981)" }}
          >
            <div
              className="w-10 h-10 rounded-full border-2 border-white/40 border-t-white"
              style={{ animation: "spin 0.9s linear infinite" }}
            />
          </div>
          <p style={{ color: "#16A34A", fontWeight: 600 }}>Loading receipt…</p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );

  if (error || !order)
    return (
      <div
        className="or-root min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(135deg,#F0FDF4,#fff,#ECFDF5)" }}
      >
        <div
          className="bg-white rounded-3xl p-12 text-center max-w-md"
          style={{
            boxShadow: "0 8px 40px rgba(22,163,74,0.10)",
            border: "1px solid rgba(187,247,208,0.7)",
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "#F0FDF4" }}
          >
            <FileText style={{ width: 28, height: 28, color: "#9CA3AF" }} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {error || "Order Not Found"}
          </h3>
          <p
            style={{
              color: "#6B7280",
              fontSize: 14,
              marginBottom: 24,
              lineHeight: 1.6,
            }}
          >
            The order receipt could not be loaded. Please check the order ID and
            try again.
          </p>
          <Link
            to="/order-list"
            className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl transition-all duration-200"
            style={{
              background: "linear-gradient(135deg,#16A34A,#10B981)",
              boxShadow: "0 4px 14px rgba(22,163,74,0.30)",
              textDecoration: "none",
            }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} /> Back to Orders
          </Link>
        </div>
      </div>
    );

  const mainImage = order.outfits?.outfit_images?.find(
    (i) => i.is_main,
  )?.image_url;
  const subtotal = (order.price || 0) * (order.quantity || 1);
  const tax = order.tax || 0;
  const shipping = order.shipping || 0;
  const discount = order.discount || 0;
  const total = order.total_amount || subtotal + tax + shipping - discount;
  const statusStyle = statusStyles[order.status] || {
    bg: "#F3F4F6",
    color: "#374151",
    border: "#E5E7EB",
  };

  return (
    <div
      className="or-root min-h-screen py-12 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg,#F0FDF4 0%,#ffffff 45%,#ECFDF5 100%)",
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none print:hidden">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.025 }}
        >
          <defs>
            <pattern
              id="or-dots"
              x="0"
              y="0"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.4" fill="#16A34A" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#or-dots)" />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Action bar */}
        <div className="print:hidden mb-6 flex items-center justify-between flex-wrap gap-4">
          <Link
            to="/customer/orders"
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
            Back to Orders
          </Link>

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="action-btn flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl transition-all duration-200"
              style={{
                background: "linear-gradient(135deg,#16A34A,#10B981)",
                boxShadow: "0 3px 12px rgba(22,163,74,0.28)",
                fontSize: 14,
              }}
            >
              <Download style={{ width: 15, height: 15 }} /> Download
            </button>
            <button
              onClick={handlePrint}
              className="action-btn flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl transition-all duration-200"
              style={{
                background: "#fff",
                color: "#16A34A",
                border: "1.5px solid #BBF7D0",
                boxShadow: "0 2px 8px rgba(22,163,74,0.08)",
                fontSize: 14,
              }}
            >
              <Printer style={{ width: 15, height: 15 }} /> Print
            </button>
          </div>
        </div>

        {/* ── RECEIPT CARD ── */}
        <div
          ref={receiptRef}
          className="receipt-card bg-white rounded-3xl overflow-hidden print:shadow-none print:rounded-none"
          style={{
            boxShadow:
              "0 8px 48px rgba(22,163,74,0.11), 0 2px 8px rgba(0,0,0,0.05)",
            border: "1px solid rgba(187,247,208,0.7)",
          }}
        >
          {/* Header Banner */}
          <div
            className="relative overflow-hidden px-8 py-9"
            style={{
              background:
                "linear-gradient(135deg,#15803D 0%,#16A34A 50%,#059669 100%)",
            }}
          >
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 border border-white/10" />
            <div className="absolute -bottom-14 -left-14 w-64 h-64 rounded-full bg-white/5 border border-white/10" />
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{
                background:
                  "linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)",
                animation: "shimBar 2.5s linear infinite",
              }}
            />

            <div className="relative flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-13 h-13 rounded-2xl flex items-center justify-center"
                  style={{
                    width: 52,
                    height: 52,
                    background: "rgba(255,255,255,0.18)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <FileText style={{ width: 24, height: 24, color: "#fff" }} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    ORDER RECEIPT
                  </h1>
                  <p style={{ color: "#BBF7D0", fontSize: 13, marginTop: 2 }}>
                    Try-on Virtual Outfit Trial
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p style={{ color: "#BBF7D0", fontSize: 12, marginBottom: 4 }}>
                  Order ID
                </p>
                <p
                  className="font-bold text-white break-all"
                  style={{ fontSize: 15, maxWidth: 200 }}
                >
                  {order.id}
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {/* Date & Status */}
            <div
              className="flex items-center justify-between mb-8 pb-6 flex-wrap gap-4"
              style={{ borderBottom: "1px solid #F0FDF4" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "#DCFCE7" }}
                >
                  <Calendar
                    style={{ width: 18, height: 18, color: "#16A34A" }}
                  />
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "#9CA3AF" }}>Order Date</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold"
                style={{
                  background: statusStyle.bg,
                  color: statusStyle.color,
                  border: `1px solid ${statusStyle.border}`,
                  fontSize: 14,
                }}
              >
                <CheckCircle style={{ width: 15, height: 15 }} />
                {(order.status || "Confirmed").charAt(0).toUpperCase() +
                  (order.status || "Confirmed").slice(1)}
              </div>
            </div>

            {/* Seller & Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Seller */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
              >
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Package
                    style={{ width: 16, height: 16, color: "#16A34A" }}
                  />{" "}
                  Seller Information
                </h3>
                <div className="space-y-2">
                  <p
                    className="font-semibold text-gray-800"
                    style={{ fontSize: 14 }}
                  >
                    {seller?.shop_name || "Try-on Store"}
                  </p>
                  {seller?.shop_address && (
                    <div
                      className="flex items-start gap-2"
                      style={{ fontSize: 13, color: "#4B5563" }}
                    >
                      <MapPin
                        style={{
                          width: 13,
                          height: 13,
                          marginTop: 2,
                          flexShrink: 0,
                          color: "#16A34A",
                        }}
                      />
                      <span>{seller.shop_address}</span>
                    </div>
                  )}
                  {seller?.phone_number_1 && (
                    <div
                      className="flex items-center gap-2"
                      style={{ fontSize: 13, color: "#4B5563" }}
                    >
                      <Phone
                        style={{ width: 13, height: 13, color: "#16A34A" }}
                      />
                      <span>{seller.phone_number_1}</span>
                    </div>
                  )}
                  {seller?.gst_number && (
                    <p style={{ fontSize: 12, color: "#6B7280" }}>
                      GST: {seller.gst_number}
                    </p>
                  )}
                </div>
              </div>

              {/* Customer */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "#ECFDF5", border: "1px solid #A7F3D0" }}
              >
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Mail style={{ width: 16, height: 16, color: "#059669" }} />{" "}
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <p
                    className="font-semibold text-gray-800"
                    style={{ fontSize: 14 }}
                  >
                    {order.customer_name || "Customer"}
                  </p>
                  {order.customer_email && (
                    <div
                      className="flex items-center gap-2"
                      style={{ fontSize: 13, color: "#4B5563" }}
                    >
                      <Mail
                        style={{ width: 13, height: 13, color: "#059669" }}
                      />
                      <span className="break-all">{order.customer_email}</span>
                    </div>
                  )}
                  {order.customer_phone && (
                    <div
                      className="flex items-center gap-2"
                      style={{ fontSize: 13, color: "#4B5563" }}
                    >
                      <Phone
                        style={{ width: 13, height: 13, color: "#059669" }}
                      />
                      <span>{order.customer_phone}</span>
                    </div>
                  )}
                  {order.shipping_address && (
                    <div
                      className="flex items-start gap-2"
                      style={{ fontSize: 13, color: "#4B5563" }}
                    >
                      <MapPin
                        style={{
                          width: 13,
                          height: 13,
                          marginTop: 2,
                          flexShrink: 0,
                          color: "#059669",
                        }}
                      />
                      <span>{order.shipping_address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Package style={{ width: 16, height: 16, color: "#16A34A" }} />{" "}
                Order Items
              </h3>
              <div
                className="rounded-2xl overflow-hidden overflow-x-auto"
                style={{ border: "1px solid #E5E7EB" }}
              >
                <table className="w-full" style={{ minWidth: 520 }}>
                  <thead>
                    <tr
                      style={{
                        background: "linear-gradient(90deg,#F0FDF4,#ECFDF5)",
                      }}
                    >
                      {["Product", "Qty", "Price", "Total"].map((h, i) => (
                        <th
                          key={i}
                          className={
                            i === 0
                              ? "text-left"
                              : i >= 2
                                ? "text-right"
                                : "text-center"
                          }
                          style={{
                            padding: "14px 20px",
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#374151",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderTop: "1px solid #F0FDF4" }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div className="flex items-center gap-4">
                          {mainImage && (
                            <img
                              src={mainImage}
                              alt={order.outfits?.name}
                              className="rounded-xl object-cover shrink-0"
                              style={{ width: 56, height: 68 }}
                            />
                          )}
                          <div>
                            <p
                              className="font-semibold text-gray-800"
                              style={{ fontSize: 14 }}
                            >
                              {order.outfits?.name || "Product"}
                            </p>
                            {order.outfits?.category && (
                              <span
                                className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{
                                  background: "#DCFCE7",
                                  color: "#15803D",
                                }}
                              >
                                {order.outfits.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td
                        className="text-center font-medium"
                        style={{
                          padding: "16px 20px",
                          fontSize: 14,
                          color: "#374151",
                        }}
                      >
                        {order.quantity || 1}
                      </td>
                      <td
                        className="text-right font-medium"
                        style={{
                          padding: "16px 20px",
                          fontSize: 14,
                          color: "#374151",
                        }}
                      >
                        ₹{(order.price || 0).toFixed(2)}
                      </td>
                      <td
                        className="text-right font-bold"
                        style={{
                          padding: "16px 20px",
                          fontSize: 15,
                          color: "#15803D",
                        }}
                      >
                        ₹{subtotal.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Summary */}
            <div
              className="rounded-2xl p-6 mb-8"
              style={{
                background: "linear-gradient(135deg,#F0FDF4,#ECFDF5)",
                border: "1px solid #BBF7D0",
              }}
            >
              <h3 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
                <CreditCard
                  style={{ width: 16, height: 16, color: "#16A34A" }}
                />{" "}
                Payment Summary
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Subtotal", value: `₹${subtotal.toFixed(2)}` },
                  { label: "Tax (GST)", value: `₹${tax.toFixed(2)}` },
                  { label: "Shipping", value: `₹${shipping.toFixed(2)}` },
                  ...(discount > 0
                    ? [
                        {
                          label: "Discount",
                          value: `-₹${discount.toFixed(2)}`,
                          green: true,
                        },
                      ]
                    : []),
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex justify-between"
                    style={{
                      fontSize: 14,
                      color: row.green ? "#16A34A" : "#4B5563",
                    }}
                  >
                    <span>{row.label}</span>
                    <span className="font-medium">{row.value}</span>
                  </div>
                ))}
                <div
                  className="flex justify-between items-center pt-4"
                  style={{ borderTop: "2px solid #BBF7D0" }}
                >
                  <span
                    className="font-bold text-gray-800"
                    style={{ fontSize: 17 }}
                  >
                    Total Amount
                  </span>
                  <span
                    className="font-bold"
                    style={{
                      fontSize: 26,
                      background: "linear-gradient(135deg,#15803D,#059669)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            {order.payment_method && (
              <div
                className="flex items-center gap-3 rounded-2xl p-4 mb-8"
                style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "#DCFCE7" }}
                >
                  <CreditCard
                    style={{ width: 18, height: 18, color: "#16A34A" }}
                  />
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "#9CA3AF" }}>
                    Payment Method
                  </p>
                  <p
                    className="font-semibold text-gray-800"
                    style={{ fontSize: 14 }}
                  >
                    {order.payment_method}
                  </p>
                  {order.transaction_id && (
                    <p
                      className="break-all"
                      style={{ fontSize: 11, color: "#9CA3AF" }}
                    >
                      Transaction ID: {order.transaction_id}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div
              className="text-center pt-6"
              style={{ borderTop: "1px solid #F0FDF4" }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Leaf style={{ width: 14, height: 14, color: "#16A34A" }} />
                <p style={{ fontSize: 14, color: "#4B5563", fontWeight: 500 }}>
                  Thank you for your business!
                </p>
              </div>
              <p style={{ fontSize: 12, color: "#9CA3AF" }}>
                This is a computer-generated receipt and does not require a
                signature.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .or-root * { font-family: 'Plus Jakarta Sans', sans-serif; }

        .blob { position:absolute; border-radius:50%; filter:blur(88px); pointer-events:none; }
        .blob-1 { top:-60px; left:-60px; width:440px; height:440px;
          background:radial-gradient(circle,rgba(74,222,128,0.18),transparent 70%);
          animation:orBlob 11s ease-in-out infinite; }
        .blob-2 { bottom:-80px; right:-80px; width:480px; height:480px;
          background:radial-gradient(circle,rgba(16,185,129,0.14),transparent 70%);
          animation:orBlob 13s ease-in-out infinite; animation-delay:-5s; }
        @keyframes orBlob { 0%,100%{transform:translate(0,0)scale(1)} 50%{transform:translate(16px,-16px)scale(1.04)} }

        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes shimBar { 0%{background-position:100% 0} 100%{background-position:-100% 0} }

        .receipt-card { animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes cardIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        .back-btn { animation: fadeIn 0.3s ease both; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        .action-btn:hover  { transform:translateY(-2px); filter:brightness(1.06); }
        .action-btn:active { transform:scale(0.98); }

        @media print {
          body { background: white !important; }
          .print\\:hidden    { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:rounded-none { border-radius: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default OrderReceipt;
