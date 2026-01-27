import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Package,
  TrendingUp,
  DollarSign,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Download,
  Phone,
  Mail,
  Calendar,
  FileText,
  X as CloseIcon,
} from "lucide-react";
import { supabase } from "../services/supabase";

const SellerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH SELLER ORDERS ================= */
  useEffect(() => {
    const fetchSellerOrders = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

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
            outfit_images (
              image_url,
              is_main
            )
          )
        `,
        )
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Order fetch error:", error);
        setLoading(false);
        return;
      }

      const formatted = data.map((o) => {
        const mainImage =
          o.outfits?.outfit_images?.find((i) => i.is_main)?.image_url ||
          "https://via.placeholder.com/100x120?text=No+Image";

        return {
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

          image: mainImage,
          paymentMethod: o.payment_method,
          transactionId: o.transaction_id,
        };
      });

      setOrders(formatted);
      setLoading(false);
    };

    fetchSellerOrders();
  }, []);

  /* ================= HELPERS ================= */
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Pending":
        return "bg-gray-100 text-gray-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
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

  /* ================= FILTERS ================= */
  const filteredOrders = orders.filter((o) => {
    const statusMatch =
      filterStatus === "all" || o.status.toLowerCase() === filterStatus;

    const searchMatch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.item.toLowerCase().includes(searchTerm.toLowerCase());

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

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 py-12 px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <Link
          to="/seller/dashboard"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              My Orders
            </h1>
            <p className="text-gray-600">
              Track and manage your product orders
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <div className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-purple-600" />
              <p className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {[
            {
              label: "All",
              value: "all",
              count: statusCounts.all,
              color: "purple",
            },
            {
              label: "Pending",
              value: "pending",
              count: statusCounts.pending,
              color: "gray",
            },
            {
              label: "Processing",
              value: "processing",
              count: statusCounts.processing,
              color: "yellow",
            },
            {
              label: "Shipped",
              value: "shipped",
              count: statusCounts.shipped,
              color: "blue",
            },
            {
              label: "Delivered",
              value: "delivered",
              count: statusCounts.delivered,
              color: "green",
            },
            {
              label: "Cancelled",
              value: "cancelled",
              count: statusCounts.cancelled,
              color: "red",
            },
          ].map((status) => (
            <button
              key={status.value}
              onClick={() => setFilterStatus(status.value)}
              className={`p-4 rounded-xl transition-all duration-200 ${
                filterStatus === status.value
                  ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
                  : "bg-white/80 backdrop-blur-lg hover:bg-white shadow-md"
              }`}
            >
              <p
                className={`text-2xl font-bold mb-1 ${
                  filterStatus === status.value ? "text-white" : "text-gray-800"
                }`}
              >
                {status.count}
              </p>
              <p
                className={`text-sm font-medium ${
                  filterStatus === status.value ? "text-white" : "text-gray-600"
                }`}
              >
                {status.label}
              </p>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
              placeholder="Search by order ID, customer name, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Orders */}
        <div className="space-y-6">
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
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden"
              >
                <div className="p-6 flex flex-col md:flex-row gap-6">
                  <img
                    src={order.image}
                    alt={order.item}
                    className="w-full md:w-32 h-40 object-cover rounded-lg"
                  />

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Order Info */}
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Order ID</p>
                      <p className="text-lg font-bold text-purple-600 mb-3">
                        {order.id}
                      </p>
                      <p className="font-semibold text-gray-800 mb-1">
                        {order.item}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity:{" "}
                        <span className="font-semibold">{order.quantity}</span>
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.date).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Customer</p>
                      <p className="font-semibold text-gray-800 mb-2">
                        {order.customer}
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{order.customerEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{order.customerPhone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Status</p>
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 ${getStatusColor(order.status)}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {order.status}
                      </div>

                      <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-gray-800 mb-4">
                        ₹{totalAmount}
                      </p>

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 shadow-lg text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Orders Found
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your filters"
                : "Orders will appear here once customers make purchases"}
            </p>
          </div>
        )}
      </div>

      {/* ================= ORDER MODAL ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Order Details
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Product Info */}
              <div className="flex gap-4">
                <img
                  src={selectedOrder.image}
                  alt={selectedOrder.item}
                  className="w-32 h-40 object-cover rounded-lg"
                />
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-xl font-bold text-purple-600 mb-2">
                    {selectedOrder.id}
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    {selectedOrder.item}
                  </p>
                  <p className="text-gray-600">
                    Quantity: {selectedOrder.quantity}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Name:</span>{" "}
                    {selectedOrder.customer}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span>{" "}
                    {selectedOrder.customerEmail}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedOrder.customerPhone}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Address:</span>{" "}
                    {selectedOrder.address}
                  </p>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Price Breakdown
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Item Price</span>
                    <span className="font-medium">₹{selectedOrder.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">₹{selectedOrder.tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      ₹{selectedOrder.shipping}
                    </span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">
                        -₹{selectedOrder.discount}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold text-gray-800">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-purple-600">
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

              {/* Order Timeline */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Order Timeline
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Order Date:</span>{" "}
                    {new Date(selectedOrder.date).toLocaleDateString()}
                  </p>
                  {selectedOrder.deliveryDate && (
                    <p className="text-gray-700">
                      <span className="font-medium">Delivery Date:</span>{" "}
                      {new Date(
                        selectedOrder.deliveryDate,
                      ).toLocaleDateString()}
                    </p>
                  )}
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}
                  >
                    {React.createElement(getStatusIcon(selectedOrder.status), {
                      className: "w-4 h-4",
                    })}
                    {selectedOrder.status}
                  </div>
                </div>
              </div>

              {/* Status Update Buttons */}
              {selectedOrder.status !== "Delivered" &&
                selectedOrder.status !== "Cancelled" && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Update Status
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-medium hover:bg-yellow-200 transition-colors">
                        Mark as Processing
                      </button>
                      <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                        Mark as Shipped
                      </button>
                      <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors col-span-2">
                        Mark as Delivered
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        .animate-pulse { animation: pulse 4s ease-in-out infinite; }
        .delay-1000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default SellerOrder;
