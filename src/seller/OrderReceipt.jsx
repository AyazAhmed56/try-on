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
} from "lucide-react";
import { supabase } from "../services/supabase";

const OrderReceipt = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const receiptRef = useRef(null);

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
            seller_id,
            outfits (
              name,
              category,
              outfit_images (
                image_url,
                is_main
              )
            )
          `,
          )
          .eq("id", orderId)
          .single();

        if (orderError) {
          console.error("Order fetch error:", orderError);
          setError("Order not found");
          setLoading(false);
          return;
        }

        setOrder(orderData);

        // Fetch seller profile
        const { data: sellerData, error: sellerError } = await supabase
          .from("seller_profiles")
          .select("*")
          .eq("user_id", orderData.seller_id)
          .single();

        if (!sellerError && sellerData) {
          setSeller(sellerData);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load receipt");
        setLoading(false);
      }
    };

    fetchOrderReceipt();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 shadow-lg text-center max-w-md">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {error || "Order Not Found"}
          </h3>
          <p className="text-gray-600 mb-6">
            The order receipt could not be loaded. Please check the order ID and
            try again.
          </p>
          <Link
            to="/order-list"
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = order.outfits?.outfit_images?.find(
    (i) => i.is_main,
  )?.image_url;
  const subtotal = (order.price || 0) * (order.quantity || 1);
  const tax = order.tax || 0;
  const shipping = order.shipping || 0;
  const discount = order.discount || 0;
  const total = subtotal + tax + shipping - discount;

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 py-12 px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none print:hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Action Buttons - Hidden on print */}
        <div className="print:hidden mb-6 flex items-center justify-between flex-wrap gap-4">
          <Link
            to="/order-list"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-200 shadow-md"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transform hover:scale-105 transition-all duration-200 shadow-md"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Receipt */}
        <div
          ref={receiptRef}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none"
        >
          {/* Header */}
          <div className="bg-linear-to-r from-purple-600 to-pink-600 p-8 text-white">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">ORDER RECEIPT</h1>
                    <p className="text-white/90">Try-on Virtual Outfit Trial</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/90 text-sm mb-1">Order ID</p>
                <p className="text-xl font-bold break-all">{order.id}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {/* Date & Status */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">
                  {order.status || "Confirmed"}
                </span>
              </div>
            </div>

            {/* Seller & Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Seller Info */}
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Seller Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-gray-800">
                    {seller?.shop_name || "Try-on Store"}
                  </p>
                  {seller?.shop_address && (
                    <div className="flex items-start gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{seller.shop_address}</span>
                    </div>
                  )}
                  {seller?.phone_number_1 && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4" />
                      <span>{seller.phone_number_1}</span>
                    </div>
                  )}
                  {seller?.gst_number && (
                    <p className="text-gray-600">GST: {seller.gst_number}</p>
                  )}
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-pink-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-pink-600" />
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-gray-800">
                    {order.customer_name || "Customer"}
                  </p>
                  {order.customer_email && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4" />
                      <span className="break-all">{order.customer_email}</span>
                    </div>
                  )}
                  {order.customer_phone && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4" />
                      <span>{order.customer_phone}</span>
                    </div>
                  )}
                  {order.shipping_address && (
                    <div className="flex items-start gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{order.shipping_address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                Order Items
              </h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full min-w-150">
                  <thead>
                    <tr className="bg-linear-to-r from-purple-50 to-pink-50">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">
                        Product
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-700">
                        Quantity
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        Price
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-700">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-200">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          {mainImage && (
                            <img
                              src={mainImage}
                              alt={order.outfits?.name || "Product"}
                              className="w-16 h-20 object-cover rounded-lg shrink-0"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-gray-800">
                              {order.outfits?.name || "Product"}
                            </p>
                            {order.outfits?.category && (
                              <p className="text-sm text-gray-600">
                                {order.outfits.category}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-6 font-medium">
                        {order.quantity || 1}
                      </td>
                      <td className="text-right py-4 px-6 font-medium">
                        ₹{(order.price || 0).toFixed(2)}
                      </td>
                      <td className="text-right py-4 px-6 font-bold text-purple-600">
                        ₹{subtotal.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                Payment Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (GST)</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-medium">₹{shipping.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t-2 border-purple-200 pt-3 flex justify-between">
                  <span className="text-lg font-bold text-gray-800">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            {order.payment_method && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-8">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold text-gray-800">
                    {order.payment_method}
                  </p>
                  {order.transaction_id && (
                    <p className="text-xs text-gray-500 break-all">
                      Transaction ID: {order.transaction_id}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Footer Note */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                Thank you for your business!
              </p>
              <p className="text-xs text-gray-500">
                This is a computer-generated receipt and does not require a
                signature.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        .animate-pulse { animation: pulse 4s ease-in-out infinite; }
        .delay-1000 { animation-delay: 2s; }

        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderReceipt;
