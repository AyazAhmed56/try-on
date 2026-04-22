import React, { useEffect, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { supabase } from "../services/supabase";
import html2pdf from "html2pdf.js";
import { Link } from "react-router-dom";

const OrderReceipt = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
    id,
    created_at,
    quantity,
    total_amount,
    status,
    payment_method,
    shipping_address,

    name,
    email,
    phone,

    outfits!orders_outfit_id_fkey (
      name,
      seller_id,
      outfit_images (image_url, is_main),

      seller_profiles (
        shop_name,
        gst_no,
        address,
        city,
        state,
        pincode,
        shop_logo,
        shop_banner
      )
    )
  `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }
      setOrders(data || []);
    };

    fetchOrders();
  }, []);

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
    const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
              <span style="font-size:18px; font-weight:700; color:#173404;">₹${order.total_amount}</span>
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

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700 border border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 p-6">
      {/* Back link */}
      <Link
        to="/seller/dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-8 rounded-full bg-linear-to-b from-green-600 to-emerald-500" />
          <h1 className="text-2xl font-bold text-gray-900">Order Receipts</h1>
        </div>
        <p className="text-sm text-gray-500 ml-4">
          {orders.length} {orders.length === 1 ? "order" : "orders"} found
        </p>
      </div>

      {/* Order List */}
      <div className="grid gap-4">
        {orders.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
              <Download size={24} className="text-green-400" />
            </div>
            <p className="text-sm">No orders found</p>
          </div>
        )}

        {orders.map((order) => {
          const image = order.outfits?.outfit_images?.find(
            (i) => i.is_main,
          )?.image_url;

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-green-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-200 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Left — Image + Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Image or Placeholder */}
                  <div className="w-16 h-20 rounded-xl overflow-hidden shrink-0 bg-green-50 border border-green-100">
                    {image ? (
                      <img
                        src={image}
                        alt={order.outfits?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-green-300 text-2xl">👗</span>
                      </div>
                    )}
                  </div>

                  {/* Text Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-gray-900 text-sm">
                        #{String(order.id).slice(0, 8).toUpperCase()}
                      </p>
                      {order.status && (
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusStyle(order.status)}`}
                        >
                          {order.status}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-700 font-medium truncate">
                      {order.outfits?.name || "—"}
                    </p>

                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <p className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </p>
                      {order.total_amount && (
                        <p className="text-xs font-semibold text-green-700">
                          ₹{order.total_amount}
                        </p>
                      )}
                      {order.quantity && (
                        <p className="text-xs text-gray-400">
                          Qty: {order.quantity}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right — Download Button */}
                <button
                  onClick={() => handleDownload(order)}
                  className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 active:scale-95 text-white text-sm font-medium shadow-sm transition-all duration-150"
                >
                  <Download size={14} />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderReceipt;
