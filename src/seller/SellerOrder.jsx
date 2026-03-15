import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Package,
  DollarSign,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Phone,
  Mail,
  Calendar,
  X as CloseIcon,
} from "lucide-react";
import { supabase } from "../services/supabase";

const SellerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerOrders = async () => {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User not found", userError);
        setLoading(false);
        return;
      }

      console.log("Seller auth id:", user.id);

      const { data, error } = await supabase
        .from("orders")
        .select(
          `
        id,
        created_at,
        quantity,
        price,
        tax,
        shipping,
        discount,
        total_amount,
        status,
        delivery_date,
        payment_method,
        transaction_id,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        outfits (
          name,
          outfit_images (image_url, is_main)
        )
      `,
        )
        .eq("seller_id", user.id) // ✅ use auth user id
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Orders fetch error:", error);
        setLoading(false);
        return;
      }

      console.log("Seller Orders:", data);

      setOrders(
        (data || []).map((o) => ({
          id: o.id,
          customer: o.customer_name,
          customerEmail: o.customer_email,
          customerPhone: o.customer_phone,
          address: o.shipping_address,
          item: o.outfits?.name,
          quantity: o.quantity,
          amount: o.price,
          tax: o.tax,
          shipping: o.shipping,
          discount: o.discount,
          status: o.status,
          date: o.created_at,
          deliveryDate: o.delivery_date,
          image:
            o.outfits?.outfit_images?.find((i) => i.is_main)?.image_url ||
            "https://via.placeholder.com/100x120?text=No+Image",
          paymentMethod: o.payment_method,
          transactionId: o.transaction_id,
        })),
      );

      setLoading(false);
    };

    fetchSellerOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-50 text-green-700 border border-green-100";
      case "Shipped":
        return "bg-blue-50 text-blue-700 border border-blue-100";
      case "Processing":
        return "bg-amber-50 text-amber-700 border border-amber-100";
      case "Pending":
        return "bg-gray-50 text-gray-600 border border-gray-100";
      case "Cancelled":
        return "bg-red-50 text-red-600 border border-red-100";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return CheckCircle;
      case "Shipped":
        return Truck;
      case "Processing":
        return Clock;
      case "Cancelled":
        return XCircle;
      default:
        return Package;
    }
  };

  const filteredOrders = orders.filter((o) => {
    const statusMatch =
      filterStatus === "all" || o.status.toLowerCase() === filterStatus;
    const searchMatch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.item?.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.amount + o.tax + o.shipping - o.discount, 0);

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    processing: orders.filter((o) => o.status === "Processing").length,
    shipped: orders.filter((o) => o.status === "Shipped").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    cancelled: orders.filter((o) => o.status === "Cancelled").length,
  };

  const statusTabs = [
    { label: "All", value: "all", count: statusCounts.all },
    { label: "Pending", value: "pending", count: statusCounts.pending },
    {
      label: "Processing",
      value: "processing",
      count: statusCounts.processing,
    },
    { label: "Shipped", value: "shipped", count: statusCounts.shipped },
    { label: "Delivered", value: "delivered", count: statusCounts.delivered },
    { label: "Cancelled", value: "cancelled", count: statusCounts.cancelled },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500 font-medium">Loading orders…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-125 h-125 bg-green-100 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-125 h-125 bg-emerald-100 rounded-full blur-3xl opacity-40 animate-pulse [animation-delay:2s]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Back link */}
        <Link
          to="/seller/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-7 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-0.5">
              My Orders
            </h1>
            <p className="text-sm text-gray-400">
              Track and manage your product orders
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
              <DollarSign
                className="w-4.5 h-4.5 text-green-600"
                style={{ width: "18px", height: "18px" }}
              />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Revenue</p>
              <p
                className="text-xl font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, #16a34a, #059669)",
                }}
              >
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`p-3.5 rounded-2xl text-center transition-all border ${
                filterStatus === tab.value
                  ? "text-white border-transparent shadow-md"
                  : "bg-white border-gray-100 hover:border-green-200 hover:bg-green-50/40 shadow-sm"
              }`}
              style={
                filterStatus === tab.value
                  ? { background: "linear-gradient(135deg, #16a34a, #059669)" }
                  : {}
              }
            >
              <p
                className={`text-xl font-bold mb-0.5 ${filterStatus === tab.value ? "text-white" : "text-gray-900"}`}
              >
                {tab.count}
              </p>
              <p
                className={`text-xs font-medium ${filterStatus === tab.value ? "text-green-100" : "text-gray-400"}`}
              >
                {tab.label}
              </p>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none transition-all placeholder-gray-400"
              placeholder="Search by order ID, customer, or product…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Orders list */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            const totalAmount = (
              order.amount +
              order.tax +
              order.shipping -
              order.discount
            ).toFixed(2);

            return (
              <div
                key={order.id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="p-5 flex flex-col md:flex-row gap-5">
                  <img
                    src={order.image}
                    alt={order.item}
                    className="w-full md:w-28 h-36 object-cover rounded-xl shrink-0"
                  />

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Order info */}
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                      <p className="text-sm font-bold text-green-700 mb-2">
                        #{String(order.id).slice(0, 8)}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        {order.item}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        Qty:{" "}
                        <span className="font-semibold text-gray-700">
                          {order.quantity}
                        </span>
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(order.date).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Customer info */}
                    <div>
                      <p className="text-xs text-gray-400 mb-1.5">Customer</p>
                      <p className="text-sm font-semibold text-gray-900 mb-2">
                        {order.customer}
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">
                            {order.customerEmail}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          {order.customerPhone}
                        </div>
                      </div>
                    </div>

                    {/* Status + actions */}
                    <div className="flex flex-col gap-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-1.5">Status</p>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(order.status)}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {order.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">
                          Total Amount
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{totalAmount}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-sm shadow-green-200 hover:shadow-md hover:shadow-green-300 transition-all active:scale-95 mt-auto"
                        style={{
                          background:
                            "linear-gradient(135deg, #16a34a, #059669)",
                        }}
                      >
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredOrders.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 shadow-sm text-center">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              No Orders Found
            </h3>
            <p className="text-sm text-gray-400">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your filters"
                : "Orders will appear here once customers make purchases"}
            </p>
          </div>
        )}
      </div>

      {/* ── ORDER DETAIL MODAL ── */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-7 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
              >
                <CloseIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Product */}
              <div className="flex gap-4">
                <img
                  src={selectedOrder.image}
                  alt={selectedOrder.item}
                  className="w-28 h-36 object-cover rounded-2xl shrink-0 border border-gray-100"
                />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                  <p className="text-sm font-bold text-green-700 mb-2">
                    #{String(selectedOrder.id).slice(0, 8)}
                  </p>
                  <p className="text-base font-semibold text-gray-900 mb-1">
                    {selectedOrder.item}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty:{" "}
                    <span className="font-semibold text-gray-700">
                      {selectedOrder.quantity}
                    </span>
                  </p>
                </div>
              </div>

              {/* Customer */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3">
                  Customer Information
                </h3>
                <div className="space-y-1.5 text-sm text-gray-600">
                  {[
                    { label: "Name", val: selectedOrder.customer },
                    { label: "Email", val: selectedOrder.customerEmail },
                    { label: "Phone", val: selectedOrder.customerPhone },
                    { label: "Address", val: selectedOrder.address },
                  ].map(({ label, val }) => (
                    <p key={label}>
                      <span className="font-semibold text-gray-700">
                        {label}:
                      </span>{" "}
                      {val}
                    </p>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3">
                  Price Breakdown
                </h3>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Item Price", val: `₹${selectedOrder.amount}` },
                    { label: "Tax", val: `₹${selectedOrder.tax}` },
                    { label: "Shipping", val: `₹${selectedOrder.shipping}` },
                    ...(selectedOrder.discount > 0
                      ? [
                          {
                            label: "Discount",
                            val: `-₹${selectedOrder.discount}`,
                            green: true,
                          },
                        ]
                      : []),
                  ].map(({ label, val, green }) => (
                    <div key={label} className="flex justify-between">
                      <span
                        className={green ? "text-green-600" : "text-gray-500"}
                      >
                        {label}
                      </span>
                      <span
                        className={`font-semibold ${green ? "text-green-600" : "text-gray-800"}`}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2.5 border-t border-gray-100">
                    <span className="font-bold text-gray-800">
                      Total Amount
                    </span>
                    <span
                      className="text-xl font-bold bg-clip-text text-transparent"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #16a34a, #059669)",
                      }}
                    >
                      ₹
                      {(
                        selectedOrder.amount +
                        selectedOrder.tax +
                        selectedOrder.shipping -
                        selectedOrder.discount
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3">
                  Order Timeline
                </h3>
                <div className="space-y-1.5 text-sm text-gray-600 mb-3">
                  <p>
                    <span className="font-semibold text-gray-700">
                      Order Date:
                    </span>{" "}
                    {new Date(selectedOrder.date).toLocaleDateString()}
                  </p>
                  {selectedOrder.deliveryDate && (
                    <p>
                      <span className="font-semibold text-gray-700">
                        Delivery Date:
                      </span>{" "}
                      {new Date(
                        selectedOrder.deliveryDate,
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(selectedOrder.status)}`}
                >
                  {React.createElement(getStatusIcon(selectedOrder.status), {
                    className: "w-3.5 h-3.5",
                  })}
                  {selectedOrder.status}
                </span>
              </div>

              {/* Status update */}
              {selectedOrder.status !== "Delivered" &&
                selectedOrder.status !== "Cancelled" && (
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-bold text-gray-800 mb-3">
                      Update Status
                    </h3>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button className="px-4 py-2.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-xl text-xs font-semibold hover:bg-amber-100 transition-colors">
                        Mark as Processing
                      </button>
                      <button className="px-4 py-2.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-xs font-semibold hover:bg-blue-100 transition-colors">
                        Mark as Shipped
                      </button>
                      <button className="col-span-2 px-4 py-2.5 bg-green-50 text-green-700 border border-green-100 rounded-xl text-xs font-semibold hover:bg-green-100 transition-colors">
                        Mark as Delivered
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrder;
