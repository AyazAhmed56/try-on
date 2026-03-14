import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
  Heart,
  Tag,
  CreditCard,
  Truck,
  Shield,
  AlertCircle,
} from "lucide-react";
import { supabase } from "../services/supabase";

/* Only keyframes & font import — nothing Tailwind can do natively */
const injectStyles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
* { font-family: 'DM Sans', sans-serif; }

.font-display { font-family: 'DM Serif Display', serif; }

.text-gradient {
  background: linear-gradient(135deg, #15803d, #059669);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.bg-green-grad { background: linear-gradient(135deg, #15803d, #059669); }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes floatBlob {
  0%, 100% { transform: translateY(0) scale(1); }
  50%       { transform: translateY(-18px) scale(1.04); }
}
@keyframes spin { to { transform: rotate(360deg); } }

.anim-fade-up  { animation: fadeUp  0.5s ease both; }
.anim-slide-in { animation: slideIn 0.35s ease both; }

.blob-1 {
  position: absolute; border-radius: 50%; pointer-events: none;
  width: 420px; height: 420px;
  background: rgba(134,239,172,0.28);
  top: -60px; left: -80px;
  filter: blur(80px);
  animation: floatBlob 7s ease-in-out infinite;
}
.blob-2 {
  position: absolute; border-radius: 50%; pointer-events: none;
  width: 360px; height: 360px;
  background: rgba(52,211,153,0.2);
  bottom: 40px; right: -60px;
  filter: blur(80px);
  animation: floatBlob 9s ease-in-out infinite reverse;
}

.spinner {
  width: 44px; height: 44px;
  border: 3px solid #dcfce7;
  border-top-color: #15803d;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* qty border trick */
.qty-wrap {
  display: flex; align-items: center;
  border: 1.5px solid #d1fae5;
  border-radius: 12px; overflow: hidden;
}
`;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const navigate = useNavigate();

  /* ── All logic unchanged ── */
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("cart")
        .select(
          `id,quantity,created_at,outfits:outfit_id(id,name,category,price,discount_price,stock_quantity,brand,outfit_images(image_url,is_main))`,
        )
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching cart:", error);
        setLoading(false);
        return;
      }

      const formatted = data
        .filter((item) => item.outfits)
        .map((item) => {
          const outfit = item.outfits;
          const mainImage =
            outfit.outfit_images?.find((img) => img.is_main)?.image_url ||
            "https://via.placeholder.com/150x200?text=No+Image";
          return {
            cartId: item.id,
            id: outfit.id,
            name: outfit.name,
            category: outfit.category,
            price: outfit.discount_price || outfit.price,
            originalPrice: outfit.discount_price ? outfit.price : null,
            stock: outfit.stock_quantity,
            brand: outfit.brand,
            image: mainImage,
            quantity: item.quantity,
          };
        });
      setCartItems(formatted);
      setLoading(false);
    };
    fetchCart();
  }, []);

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    const { error } = await supabase
      .from("cart")
      .update({ quantity: newQuantity })
      .eq("id", cartId);
    if (!error)
      setCartItems((prev) =>
        prev.map((item) =>
          item.cartId === cartId ? { ...item, quantity: newQuantity } : item,
        ),
      );
  };

  const removeFromCart = async (cartId) => {
    const { error } = await supabase.from("cart").delete().eq("id", cartId);
    if (!error)
      setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const moveToWishlist = async (item) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase
      .from("wishlist")
      .insert({ customer_id: user.id, outfit_id: item.id });
    await removeFromCart(item.cartId);
  };

  const applyCoupon = () => {
    if (couponCode === "SAVE10")
      setAppliedCoupon({ code: "SAVE10", discount: 10 });
    else alert("Invalid coupon code");
  };

  const proceedToCheckout = () => navigate("/customer/checkout");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = appliedCoupon
    ? (subtotal * appliedCoupon.discount) / 100
    : 0;
  const tax = (subtotal - discount) * 0.18;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal - discount + tax + shipping;

  /* ── Loading screen ── */
  if (loading)
    return (
      <>
        <style>{injectStyles}</style>
        <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-50 flex items-center justify-center">
          <div className="text-center">
            <div className="spinner mx-auto mb-4" />
            <p className="text-gray-500 font-medium text-sm">
              Loading your cart…
            </p>
          </div>
        </div>
      </>
    );

  return (
    <>
      <style>{injectStyles}</style>

      {/* ── Page wrapper ── */}
      <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-green-50 px-4 pt-10 pb-16 relative overflow-hidden">
        <div className="blob-1" />
        <div className="blob-2" />

        <div className="relative max-w-6xl mx-auto">
          {/* Header */}
          <Link
            to="/customer/dashboard"
            className="inline-flex items-center gap-1.5 text-green-700 text-sm font-medium no-underline mb-5 hover:gap-2.5 transition-all"
          >
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>

          <h1 className="text-gradient font-display text-4xl tracking-tight m-0 mb-1 leading-tight">
            Shopping Cart
          </h1>
          <p className="text-gray-500 text-sm mb-7">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>

          {/* ── Empty state ── */}
          {cartItems.length === 0 ? (
            <div className="anim-fade-up bg-white/90 backdrop-blur-md rounded-3xl border border-green-100 py-20 px-8 text-center shadow-sm">
              <ShoppingCart size={64} className="mx-auto text-green-200 mb-5" />
              <h3 className="font-display text-3xl text-gray-900 mb-2">
                Your Cart is Empty
              </h3>
              <p className="text-gray-500 text-sm mb-7">
                Add some items to get started!
              </p>
              <Link
                to="/customer/products"
                className="bg-green-grad inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white font-semibold text-sm no-underline shadow-lg shadow-green-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-200 transition-all"
              >
                <ShoppingBag size={17} /> Browse Products
              </Link>
            </div>
          ) : (
            /* ── Main grid ── */
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-7 items-start">
              {/* ── Cart items column ── */}
              <div className="flex flex-col gap-3.5">
                {cartItems.map((item, idx) => (
                  <div
                    key={item.cartId}
                    className="anim-slide-in bg-white/92 backdrop-blur-xl rounded-2xl border border-green-100 shadow-sm p-5 flex gap-5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-100 transition-all sm:flex-row flex-col"
                    style={{ animationDelay: `${idx * 0.07}s` }}
                  >
                    {/* Image */}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-28 h-36 object-cover rounded-2xl shrink-0 sm:w-28 sm:h-36"
                      />
                    ) : (
                      <div className="shrink-0 sm:w-28 sm:h-36 w-full h-48 rounded-2xl bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                        <ShoppingBag size={36} className="text-green-300" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Top row */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          {item.brand && (
                            <p className="text-xs font-semibold text-green-700 mb-1">
                              {item.brand}
                            </p>
                          )}
                          <h3 className="text-base font-semibold text-gray-900 leading-snug m-0">
                            {item.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          title="Remove"
                          className="p-2 rounded-xl text-red-400 border-none bg-transparent cursor-pointer hover:bg-red-50 hover:text-red-600 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Price + qty */}
                      <div className="flex items-end justify-between flex-wrap gap-3">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-gradient font-display text-xl font-bold">
                              ₹{item.price}
                            </span>
                            {item.originalPrice && (
                              <span className="text-sm text-gray-400 line-through">
                                ₹{item.originalPrice}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Subtotal:{" "}
                            <span className="font-semibold text-green-700">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </p>
                        </div>

                        {/* Qty control */}
                        <div className="qty-wrap">
                          <button
                            onClick={() =>
                              updateQuantity(item.cartId, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="w-9 h-9 flex items-center justify-center bg-green-50 text-green-700 border-none cursor-pointer hover:bg-green-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-10 text-center font-semibold text-sm text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.cartId, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.stock}
                            className="w-9 h-9 flex items-center justify-center bg-green-50 text-green-700 border-none cursor-pointer hover:bg-green-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Actions row */}
                      <div className="flex gap-2 mt-3.5 flex-wrap">
                        <button
                          onClick={() => moveToWishlist(item)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-pink-50 text-pink-700 text-xs font-medium rounded-xl border-none cursor-pointer hover:bg-pink-100 transition-colors"
                        >
                          <Heart size={13} /> Move to Wishlist
                        </button>
                        {item.quantity >= item.stock && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 text-xs rounded-xl">
                            <AlertCircle size={13} /> Max stock reached
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Order Summary ── */}
              <div className="anim-fade-up bg-white/95 backdrop-blur-xl rounded-3xl border border-green-100 shadow-lg shadow-green-100/50 p-7 sticky top-5">
                <h2 className="font-display text-2xl text-gray-900 m-0 mb-6">
                  Order Summary
                </h2>

                {/* Coupon */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-600 tracking-wide uppercase mb-2">
                    Promo / Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-3.5 py-2.5 border-2 border-green-100 rounded-xl text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all"
                    />
                    <button
                      onClick={applyCoupon}
                      className="bg-green-grad px-4 py-2.5 rounded-xl text-white text-sm font-semibold border-none cursor-pointer hover:shadow-md hover:shadow-green-200 hover:-translate-y-0.5 transition-all"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div className="flex items-center gap-1.5 text-green-700 text-xs mt-2">
                      <Tag size={12} />
                      Coupon "{appliedCoupon.code}" applied —{" "}
                      {appliedCoupon.discount}% off!
                    </div>
                  )}
                </div>

                {/* Price breakdown */}
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-700">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span className="font-semibold">
                        −₹{discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax (GST 18%)</span>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span
                      className={`font-semibold ${shipping === 0 ? "text-green-700" : "text-gray-700"}`}
                    >
                      {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-green-100 my-4" />

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-base font-bold text-gray-900">
                    Total
                  </span>
                  <span className="text-gradient font-display text-3xl font-bold">
                    ₹{total.toFixed(2)}
                  </span>
                </div>

                {/* CTA buttons */}
                <button
                  onClick={proceedToCheckout}
                  className="bg-green-grad w-full py-4 rounded-2xl text-white text-sm font-bold border-none cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-200 hover:-translate-y-0.5 transition-all mb-3"
                >
                  <CreditCard size={17} /> Proceed to Checkout
                </button>
                <Link
                  to="/customer/products"
                  className="block w-full py-3.5 text-center text-green-700 font-semibold text-sm bg-green-50 rounded-2xl no-underline hover:bg-green-100 transition-colors"
                >
                  Continue Shopping
                </Link>

                {/* Benefits */}
                <div className="mt-6 flex flex-col gap-3">
                  <div className="flex items-center gap-2.5 text-xs text-gray-500">
                    <Truck size={16} className="text-green-600 shrink-0" />
                    Free shipping on orders above ₹500
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-gray-500">
                    <Shield size={16} className="text-green-600 shrink-0" />
                    Secure payment &amp; 100% authentic products
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
