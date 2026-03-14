import React, { useState, useEffect, useCallback } from "react";
import {
  Package,
  Search,
  Download,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  ArrowLeft,
  ChevronDown,
  Star,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import jsPDF from "jspdf";
import "jspdf-autotable";

/* Only keyframes + gradient-text + sidebar-like constructs Tailwind can't handle */
const injectStyles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
* { font-family: 'DM Sans', sans-serif; }
.font-display { font-family: 'DM Serif Display', serif; }

.text-gradient {
  background: linear-gradient(135deg,#15803d,#059669);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}
.bg-green-grad { background: linear-gradient(135deg,#15803d,#059669); }

@keyframes fadeUp   { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
@keyframes spin     { to{transform:rotate(360deg);} }
@keyframes slideUp  { from{opacity:0;transform:translateY(32px);} to{opacity:1;transform:translateY(0);} }

.anim-fade { animation: fadeUp 0.4s ease both; }
.anim-modal { animation: slideUp 0.35s ease both; }

.spinner {
  width:44px; height:44px;
  border:3px solid #dcfce7; border-top-color:#15803d;
  border-radius:50%; animation: spin 0.8s linear infinite;
}

/* order card image hover */
.order-card:hover .order-img { transform: scale(1.05); }
.order-img { transition: transform 0.4s ease; }
`;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  const statusOptions = [
    "All",
    "Pending",
    "Processing",
    "Confirmed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
    "Returned",
  ];

  const getStatusClasses = (status) => {
    const map = {
      Pending: "bg-yellow-100 text-yellow-700",
      Processing: "bg-blue-100 text-blue-700",
      Confirmed: "bg-indigo-100 text-indigo-700",
      Shipped: "bg-violet-100 text-violet-700",
      "Out for Delivery": "bg-cyan-100 text-cyan-700",
      Delivered: "bg-green-100 text-green-700",
      Cancelled: "bg-red-100 text-red-700",
      Returned: "bg-orange-100 text-orange-700",
    };
    return map[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status) => {
    const map = {
      Pending: Clock,
      Processing: Package,
      Confirmed: CheckCircle,
      Shipped: Truck,
      "Out for Delivery": Truck,
      Delivered: CheckCircle,
      Cancelled: XCircle,
      Returned: Package,
    };
    const Icon = map[status] || Package;
    return <Icon size={14} />;
  };

  /* ── All logic unchanged ── */
  const fetchOrders = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `id,created_at,quantity,total_amount,status,shipping_address,payment_method,outfits(id,name,price,category,outfit_images(image_url,is_main)),seller:seller_id(business_name,email)`,
        )
        .eq("customer_id", userId)
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
        setOrders([]);
        setFilteredOrders([]);
        return;
      }
      const formatted = data
        .filter((o) => o.outfits)
        .map((order) => ({
          id: order.id,
          orderId: `ORD${order.id.toString().padStart(6, "0")}`,
          date: new Date(order.created_at).toLocaleDateString(),
          fullDate: order.created_at,
          quantity: order.quantity,
          total: Number(order.total_amount) || 0,
          status: order.status || "Pending",
          shippingAddress: order.shipping_address || "N/A",
          paymentMethod: order.payment_method || "N/A",
          product: {
            id: order.outfits.id,
            name: order.outfits.name,
            price: Number(order.outfits.price) || 0,
            category: order.outfits.category,
            image:
              order.outfits.outfit_images?.find((img) => img.is_main)
                ?.image_url || null,
          },
          seller: {
            name: order.seller?.business_name || "Unknown",
            email: order.seller?.email || "N/A",
          },
        }));
      setOrders(formatted);
      setFilteredOrders(formatted);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchUserAndOrders = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setUserProfile(profileData);
      await fetchOrders(user.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [fetchOrders]);

  const applyFilters = useCallback(() => {
    let filtered = [...orders];
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (o) =>
          o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.status.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    if (statusFilter !== "All")
      filtered = filtered.filter((o) => o.status === statusFilter);
    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter]);

  useEffect(() => {
    fetchUserAndOrders();
  }, [fetchUserAndOrders]);
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const generateOrderPDF = (order) => {
    const doc = new jsPDF();
    doc.setFillColor(21, 128, 61);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, "bold");
    doc.text("VirtualFit", 20, 25);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text("Virtual Try-On E-Commerce Platform", 20, 32);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.setFont(undefined, "bold");
    doc.text("ORDER INVOICE", 140, 25);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`Order ID: ${order.orderId}`, 140, 32);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Customer Information", 20, 55);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`Name: ${userProfile?.name || "N/A"}`, 20, 63);
    doc.text(`Email: ${userProfile?.email || "N/A"}`, 20, 70);
    doc.text(`Phone: ${userProfile?.phone || "N/A"}`, 20, 77);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Order Information", 20, 92);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`Order Date: ${order.date}`, 20, 100);
    doc.text(`Status: ${order.status}`, 20, 107);
    doc.text(`Payment Method: ${order.paymentMethod}`, 20, 114);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Shipping Address", 110, 92);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    const addressLines = doc.splitTextToSize(order.shippingAddress, 80);
    doc.text(addressLines, 110, 100);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Product Details", 20, 135);
    doc.autoTable({
      startY: 142,
      head: [["Product Name", "Category", "Quantity", "Unit Price", "Total"]],
      body: [
        [
          order.product.name,
          order.product.category,
          order.quantity.toString(),
          `₹${order.product.price.toFixed(2)}`,
          `₹${(order.product.price * order.quantity).toFixed(2)}`,
        ],
      ],
      theme: "striped",
      headStyles: {
        fillColor: [21, 128, 61],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: { fontSize: 10 },
    });
    const finalY = doc.lastAutoTable.finalY + 15;
    const subtotal = order.product.price * order.quantity;
    const tax = subtotal * 0.1;
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text("Subtotal:", 130, finalY);
    doc.text(`₹${subtotal.toFixed(2)}`, 175, finalY, { align: "right" });
    doc.text("Tax (10%):", 130, finalY + 7);
    doc.text(`₹${tax.toFixed(2)}`, 175, finalY + 7, { align: "right" });
    doc.text("Shipping:", 130, finalY + 14);
    doc.text("₹5.00", 175, finalY + 14, { align: "right" });
    doc.setDrawColor(21, 128, 61);
    doc.setLineWidth(0.5);
    doc.line(130, finalY + 20, 175, finalY + 20);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Total Amount:", 130, finalY + 28);
    doc.text(`₹${order.total.toFixed(2)}`, 175, finalY + 28, {
      align: "right",
    });
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text("Seller Information:", 20, finalY);
    doc.text(`Name: ${order.seller.name}`, 20, finalY + 7);
    doc.text(`Email: ${order.seller.email}`, 20, finalY + 14);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text("Thank you for shopping with VirtualFit!", 105, 280, {
      align: "center",
    });
    doc.text(
      "For any queries, contact us at support@virtualfit.com",
      105,
      285,
      { align: "center" },
    );
    doc.save(`${order.orderId}_Invoice.pdf`);
  };

  /* Derived stats */
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;

  /* ── Order Details Modal ── */
  const OrderDetailsModal = ({ order }) => {
    if (!order) return null;
    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
        onClick={() => setShowOrderDetails(false)}
      >
        <div
          className="anim-modal bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal header */}
          <div className="sticky top-0 bg-green-grad text-white px-6 py-5 rounded-t-3xl flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold m-0">
                Order Details
              </h2>
              <p className="text-green-100 text-sm mt-0.5">{order.orderId}</p>
            </div>
            <button
              onClick={() => setShowOrderDetails(false)}
              className="p-2 rounded-xl bg-white/20 border-none cursor-pointer text-white hover:bg-white/30 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 flex flex-col gap-4">
            {/* Status */}
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Truck size={15} className="text-green-700" /> Order Status
              </h3>
              <div className="flex justify-center">
                <span
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold ${getStatusClasses(order.status)}`}
                >
                  {getStatusIcon(order.status)} {order.status}
                </span>
              </div>
            </div>

            {/* Product */}
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Package size={15} className="text-green-700" /> Product
                Information
              </h3>
              <div className="flex items-center gap-4">
                {order.product.image ? (
                  <img
                    src={order.product.image}
                    alt={order.product.name}
                    className="w-20 h-20 object-cover rounded-xl shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <Package size={28} className="text-green-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm mb-0.5">
                    {order.product.name}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    {order.product.category}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Qty: {order.quantity}
                    </span>
                    <span className="text-gradient font-display text-base font-bold">
                      ₹{order.product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Date + Payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Calendar size={13} className="text-green-700" /> Order Date
                </h3>
                <p className="text-sm text-gray-700 font-medium">
                  {order.date}
                </p>
              </div>
              <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <DollarSign size={13} className="text-green-700" /> Payment
                  Method
                </h3>
                <p className="text-sm text-gray-700 font-medium">
                  {order.paymentMethod}
                </p>
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <MapPin size={13} className="text-green-700" /> Shipping Address
              </h3>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {order.shippingAddress}
              </p>
            </div>

            {/* Seller */}
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Package size={13} className="text-green-700" /> Seller
                Information
              </h3>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Name:</span> {order.seller.name}
              </p>
              <p className="text-sm text-gray-700 mt-0.5">
                <span className="font-semibold">Email:</span>{" "}
                {order.seller.email}
              </p>
            </div>

            {/* Price summary */}
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
              <h3 className="text-sm font-bold text-gray-700 mb-3">
                Price Summary
              </h3>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    ₹{(order.product.price * order.quantity).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span className="font-medium">
                    ₹{(order.product.price * order.quantity * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium">₹5.00</span>
                </div>
                <div className="border-t-2 border-green-200 pt-2 mt-1 flex items-center justify-between">
                  <span className="text-base font-bold text-gray-900">
                    Total
                  </span>
                  <span className="text-gradient font-display text-2xl font-bold">
                    ₹{order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => generateOrderPDF(order)}
                className="flex-1 bg-green-grad text-white py-3 rounded-2xl text-sm font-semibold border-none cursor-pointer flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-green-200 hover:-translate-y-0.5 transition-all"
              >
                <Download size={16} /> Download Invoice PDF
              </button>
              {order.status === "Delivered" && (
                <button className="flex-1 bg-white border-2 border-green-600 text-green-700 py-3 rounded-2xl text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 hover:bg-green-50 transition-colors">
                  <Star size={16} /> Rate Product
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{injectStyles}</style>

      <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-green-50">
        {/* ── Sticky header ── */}
        <div className="bg-white border-b border-green-100 shadow-sm sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-gradient font-display text-3xl tracking-tight m-0">
                  My Orders
                </h1>
                <p className="text-gray-500 text-sm mt-1 m-0">
                  {filteredOrders.length}{" "}
                  {filteredOrders.length === 1 ? "order" : "orders"} found
                </p>
              </div>
              <Link
                to="/customer/dashboard"
                className="bg-green-grad no-underline flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:shadow-lg hover:shadow-green-200 transition-all"
              >
                <ArrowLeft size={15} /> Dashboard
              </Link>
            </div>

            {/* Search + filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search by order ID, product or status…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-green-100 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-green-100 text-sm outline-none focus:border-green-600 bg-white cursor-pointer text-gray-700 transition-all"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s === "All" ? "All Statuses" : s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* ── Stat cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: <Package size={22} className="text-green-700" />,
                value: totalOrders,
                label: "Total Orders",
              },
              {
                icon: <DollarSign size={22} className="text-green-700" />,
                value: `₹${totalSpent.toFixed(2)}`,
                label: "Total Spent",
              },
              {
                icon: <CheckCircle size={22} className="text-green-700" />,
                value: deliveredOrders,
                label: "Delivered",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="anim-fade bg-white rounded-2xl border border-green-100 p-6 shadow-sm hover:-translate-y-1 hover:shadow-md hover:shadow-green-100 transition-all"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-green-50 rounded-xl p-2.5">{s.icon}</div>
                  <span className="text-gradient font-display text-3xl font-bold">
                    {s.value}
                  </span>
                </div>
                <p className="text-gray-500 text-sm m-0">{s.label}</p>
              </div>
            ))}
          </div>

          {/* ── Orders list ── */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-green-50 p-16 text-center shadow-sm">
              <div className="spinner mx-auto mb-4" />
              <p className="text-gray-400 text-sm">Loading your orders…</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-green-50 p-16 text-center shadow-sm">
              <Package size={56} className="mx-auto text-green-200 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {orders.length === 0 ? "No orders yet" : "No orders found"}
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                {orders.length === 0
                  ? "Start shopping to see your orders here!"
                  : "Try adjusting your search or filters"}
              </p>
              <button
                onClick={() => navigate("/customer/products")}
                className="bg-green-grad text-white px-7 py-3 rounded-xl text-sm font-semibold border-none cursor-pointer hover:shadow-lg hover:shadow-green-200 hover:-translate-y-0.5 transition-all"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredOrders.map((order, idx) => (
                <div
                  key={order.id}
                  className="order-card anim-fade bg-white rounded-2xl border border-green-100 shadow-sm hover:shadow-lg hover:shadow-green-100 transition-all p-5"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {/* Order header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-green-50 gap-2">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 m-0">
                        {order.orderId}
                      </h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1 m-0">
                        <Calendar size={12} /> {order.date}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusClasses(order.status)}`}
                    >
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                  </div>

                  {/* Order body */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Product image */}
                    <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-green-50">
                      {order.product.image ? (
                        <img
                          src={order.product.image}
                          alt={order.product.name}
                          className="order-img w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={24} className="text-green-300" />
                        </div>
                      )}
                    </div>

                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 mb-0.5">
                        {order.product.name}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2">
                        {order.product.category}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>Qty: {order.quantity}</span>
                        <span>·</span>
                        <span className="font-semibold text-green-700">
                          ₹{order.product.price.toFixed(2)} each
                        </span>
                      </div>
                    </div>

                    {/* Price + actions */}
                    <div className="flex flex-col items-start sm:items-end gap-3 w-full sm:w-auto">
                      <div className="sm:text-right">
                        <p className="text-xs text-gray-400 mb-0.5">
                          Total Amount
                        </p>
                        <p className="text-gradient font-display text-2xl font-bold m-0">
                          ₹{order.total.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetails(true);
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-green-50 text-green-700 text-xs font-semibold border-none cursor-pointer hover:bg-green-100 transition-colors"
                        >
                          <Eye size={13} /> View Details
                        </button>
                        <button
                          onClick={() => generateOrderPDF(order)}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-green-grad text-white text-xs font-semibold border-none cursor-pointer hover:shadow-md hover:shadow-green-200 hover:-translate-y-0.5 transition-all"
                        >
                          <Download size={13} /> PDF
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Seller footer */}
                  <div className="mt-4 pt-3 border-t border-green-50 flex items-center gap-1.5">
                    <span className="text-xs text-gray-400">Seller:</span>
                    <span className="text-xs font-semibold text-gray-600">
                      {order.seller.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showOrderDetails && <OrderDetailsModal order={selectedOrder} />}
      </div>
    </>
  );
};

export default MyOrders;
