import React, { useState, useEffect, useCallback } from "react";
import {
  Package,
  Search,
  Filter,
  Download,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  ArrowLeft,
  ChevronDown,
  Star,
  MessageSquare,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-700",
      Processing: "bg-blue-100 text-blue-700",
      Confirmed: "bg-indigo-100 text-indigo-700",
      Shipped: "bg-purple-100 text-purple-700",
      "Out for Delivery": "bg-cyan-100 text-cyan-700",
      Delivered: "bg-green-100 text-green-700",
      Cancelled: "bg-red-100 text-red-700",
      Returned: "bg-orange-100 text-orange-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status) => {
    const icons = {
      Pending: Clock,
      Processing: Package,
      Confirmed: CheckCircle,
      Shipped: Truck,
      "Out for Delivery": Truck,
      Delivered: CheckCircle,
      Cancelled: XCircle,
      Returned: Package,
    };
    const Icon = icons[status] || Package;
    return <Icon className="w-4 h-4" />;
  };

  const fetchOrders = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
        id,
        created_at,
        quantity,
        total_amount,
        status,
        shipping_address,
        payment_method,
        outfits (
          id,
          name,
          price,
          category,
          outfit_images (
            image_url,
            is_main
          )
        ),
        seller:seller_id (
          business_name,
          email
        )
      `,
        )
        .eq("customer_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
        setFilteredOrders([]);
        return;
      }

      const formattedOrders = data
        .filter((order) => order.outfits)
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

      setOrders(formattedOrders);
      setFilteredOrders(formattedOrders);
    } catch (err) {
      console.error("fetchOrders error:", err);
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
      console.error("Error fetching user and orders:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchOrders]);

  const applyFilters = useCallback(() => {
    let filtered = [...orders];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.status.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

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

    // Add company header
    doc.setFillColor(147, 51, 234); // Purple
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, "bold");
    doc.text("VirtualFit", 20, 25);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text("Virtual Try-On E-Commerce Platform", 20, 32);

    // Order Invoice Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.setFont(undefined, "bold");
    doc.text("ORDER INVOICE", 140, 25);

    // Order details box
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`Order ID: ${order.orderId}`, 140, 32);

    // Customer Information
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Customer Information", 20, 55);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`Name: ${userProfile?.name || "N/A"}`, 20, 63);
    doc.text(`Email: ${userProfile?.email || "N/A"}`, 20, 70);
    doc.text(`Phone: ${userProfile?.phone || "N/A"}`, 20, 77);

    // Order Information
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Order Information", 20, 92);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`Order Date: ${order.date}`, 20, 100);
    doc.text(`Status: ${order.status}`, 20, 107);
    doc.text(`Payment Method: ${order.paymentMethod}`, 20, 114);

    // Shipping Address
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Shipping Address", 110, 92);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    const addressLines = doc.splitTextToSize(order.shippingAddress, 80);
    doc.text(addressLines, 110, 100);

    // Product Details Table
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Product Details", 20, 135);

    const tableData = [
      [
        order.product.name,
        order.product.category,
        order.quantity.toString(),
        `$${order.product.price.toFixed(2)}`,
        `$${(order.product.price * order.quantity).toFixed(2)}`,
      ],
    ];

    doc.autoTable({
      startY: 142,
      head: [["Product Name", "Category", "Quantity", "Unit Price", "Total"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [147, 51, 234],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 10,
      },
    });

    // Order Summary
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");

    const subtotal = order.product.price * order.quantity;
    const tax = subtotal * 0.1; // 10% tax
    const shipping = 5.0;
    const total = order.total;

    doc.text("Subtotal:", 130, finalY);
    doc.text(`$${subtotal.toFixed(2)}`, 175, finalY, { align: "right" });

    doc.text("Tax (10%):", 130, finalY + 7);
    doc.text(`$${tax.toFixed(2)}`, 175, finalY + 7, { align: "right" });

    doc.text("Shipping:", 130, finalY + 14);
    doc.text(`$${shipping.toFixed(2)}`, 175, finalY + 14, { align: "right" });

    // Total line
    doc.setDrawColor(147, 51, 234);
    doc.setLineWidth(0.5);
    doc.line(130, finalY + 20, 175, finalY + 20);

    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Total Amount:", 130, finalY + 28);
    doc.text(`$${total.toFixed(2)}`, 175, finalY + 28, { align: "right" });

    // Seller Information
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text("Seller Information:", 20, finalY);
    doc.text(`Name: ${order.seller.name}`, 20, finalY + 7);
    doc.text(`Email: ${order.seller.email}`, 20, finalY + 14);

    // Footer
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

    // Save the PDF
    doc.save(`${order.orderId}_Invoice.pdf`);
  };

  const OrderStats = () => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const deliveredOrders = orders.filter(
      (o) => o.status === "Delivered",
    ).length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-purple-500" />
            <span className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {totalOrders}
            </span>
          </div>
          <p className="text-sm text-gray-600">Total Orders</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-pink-500" />
            <span className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ${totalSpent.toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-gray-600">Total Spent</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <span className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {deliveredOrders}
            </span>
          </div>
          <p className="text-sm text-gray-600">Delivered</p>
        </div>
      </div>
    );
  };

  const OrderDetailsModal = ({ order }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-linear-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Order Details</h2>
                <p className="text-purple-100 mt-1">{order.orderId}</p>
              </div>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all"
              >
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Status Timeline */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-purple-600" />
                Order Status
              </h3>
              <div className="flex items-center justify-center">
                <span
                  className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(
                    order.status,
                  )} flex items-center space-x-2`}
                >
                  {getStatusIcon(order.status)}
                  <span>{order.status}</span>
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Package className="w-5 h-5 mr-2 text-purple-600" />
                Product Information
              </h3>
              <div className="flex items-center space-x-4">
                {order.product.image ? (
                  <img
                    src={order.product.image}
                    alt={order.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {order.product.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {order.product.category}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">
                      Quantity: {order.quantity}
                    </span>
                    <span className="font-bold text-purple-600">
                      ${order.product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                  Order Date
                </h3>
                <p className="text-gray-700">{order.date}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
                  Payment Method
                </h3>
                <p className="text-gray-700">{order.paymentMethod}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                Shipping Address
              </h3>
              <p className="text-gray-700 whitespace-pre-line">
                {order.shippingAddress}
              </p>
            </div>

            {/* Seller Information */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Package className="w-5 h-5 mr-2 text-purple-600" />
                Seller Information
              </h3>
              <p className="text-gray-700">
                <strong>Name:</strong> {order.seller.name}
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> {order.seller.email}
              </p>
            </div>

            {/* Price Summary */}
            <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Price Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>
                    ${(order.product.price * order.quantity).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (10%)</span>
                  <span>
                    ${(order.product.price * order.quantity * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>$5.00</span>
                </div>
                <div className="border-t-2 border-purple-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => generateOrderPDF(order)}
                className="flex-1 py-3 px-4 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Invoice PDF</span>
              </button>
              {order.status === "Delivered" && (
                <button className="flex-1 py-3 px-4 rounded-xl bg-white border-2 border-purple-600 text-purple-600 font-semibold hover:bg-purple-50 transition-all flex items-center justify-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>Rate Product</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Orders
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredOrders.length}{" "}
                {filteredOrders.length === 1 ? "order" : "orders"} found
              </p>
            </div>
            <Link
              to="/customer/dashboard"
              className="px-4 py-2 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, product name, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "All" ? "All Status" : status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <OrderStats />

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {orders.length === 0 ? "No orders yet" : "No orders found"}
            </h3>
            <p className="text-gray-600 mb-6">
              {orders.length === 0
                ? "Start shopping to see your orders here!"
                : "Try adjusting your search or filters"}
            </p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <div className="mb-3 sm:mb-0">
                    <h3 className="text-lg font-bold text-gray-900">
                      {order.orderId}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {order.date}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        order.status,
                      )} flex items-center space-x-1`}
                    >
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </span>
                  </div>
                </div>

                {/* Order Content */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  {/* Product Image */}
                  <div className="shrink-0">
                    {order.product.image ? (
                      <img
                        src={order.product.image}
                        alt={order.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {order.product.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {order.product.category}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Quantity: {order.quantity}</span>
                      <span>•</span>
                      <span className="font-semibold text-purple-600">
                        ${order.product.price.toFixed(2)} each
                      </span>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex flex-col items-start sm:items-end space-y-3 w-full sm:w-auto">
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetails(true);
                        }}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all flex items-center justify-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                      <button
                        onClick={() => generateOrderPDF(order)}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-linear-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Seller:</strong> {order.seller.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && <OrderDetailsModal order={selectedOrder} />}
    </div>
  );
};

export default MyOrders;
