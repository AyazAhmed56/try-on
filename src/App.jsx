import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Role from "./pages/Role";
import CustomerProfile from "./pages/CustomerProfile";
import SellerProfile from "./seller/SellerProfile";
import TermsOfService from "./components/Terms";
import ForgotPassword from "./components/ForgetPassword";
import PrivacyPolicy from "./components/PrivacyPolicy";
import SellerDashboard from "./seller/SellerDashboard";
import AdvancedPostItem from "./seller/AdvancedPostItem";
import SellerItem from "./seller/SellerItem";
import SellerOrder from "./seller/SellerOrder";
import UnifiedHomePage from "./pages/UnifiedHomePage";
import SellerItemReviews from "./seller/SellerItemReviews";
import OtherSellerReviewsAndItems from "./seller/OtherSellerReviewsAndItems";
import ItemView from "./seller/ItemView";
import CookiePolicy from "./components/CookiePolicy";
import OrderReceipt from "./seller/OrderReceipt";
import BrowseProducts from "./customer/BrowseProducts";
import Wishlist from "./customer/Wishlist";
import Dashboard from "./customer/Dashboard";
import Cart from "./customer/Cart";
import MyOrders from "./customer/MyOrders";
import Settings from "./customer/Settings";
import Notifications from "./customer/Notifications";
import ProductDetails from "./customer/ProductDetails";
import AboutAndContact from "./pages/AboutAndContact";
import TryOnPages from "./pages/TryOnPages";
import VirtualTryOn from "./customer/VirtualTryOn";
import AdminTryonUpload from "./admin/AdminTryonUpload";
import Checkout from "./customer/Checkout";
import SellerRoute from "./seller/SellerRoute";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";
import AdminCustomers from "./admin/AdminCustomers";
import AdminSellers from "./admin/AdminSellers";
import AdminRoute from "./admin/AdminRoute";
import SellerPending from "./seller/SellerPending";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* customer */}
          <Route path="/customer/dashboard" element={<Dashboard />} />
          <Route path="/customer/profile" element={<CustomerProfile />} />
          <Route path="/customer/item/:id" element={<ItemView />} />
          <Route path="/customer/wishlist" element={<Wishlist />} />
          <Route path="/customer/products" element={<BrowseProducts />} />
          <Route path="/customer/products/:id" element={<ProductDetails />} />
          <Route path="/customer/cart" element={<Cart />} />
          <Route path="/customer/settings" element={<Settings />} />
          <Route path="/customer/notifications" element={<Notifications />} />
          <Route path="/customer/orders" element={<MyOrders />} />
          <Route path="/customer/try-on/:id" element={<TryOnPages />} />
          <Route path="/customer/try-on" element={<VirtualTryOn />} />
          <Route path="/customer/checkout" element={<Checkout />} />

          {/* seller */}
          <Route path="/seller/profile" element={<SellerProfile />} />
          <Route path="/seller/items" element={<SellerItem />} />
          <Route path="/seller/items/:id" element={<ItemView />} />
          <Route path="/post-item/:id" element={<AdvancedPostItem />} />
          <Route
            path="/seller/dashboard"
            element={
              <SellerRoute>
                <SellerDashboard />
              </SellerRoute>
            }
          />
          <Route path="/post-item" element={<AdvancedPostItem />} />
          <Route path="/my-items" element={<SellerItem />} />
          <Route path="/order-list" element={<SellerOrder />} />
          <Route path="/seller/reviews" element={<SellerItemReviews />} />
          <Route
            path="/other-sellers-items-reviews"
            element={<OtherSellerReviewsAndItems />}
          />
          <Route path="/order-receipt" element={<OrderReceipt />} />
          <Route path="/seller/pending" element={<SellerPending />} />

          {/* admin */}
          <Route path="/admin/upload" element={<AdminTryonUpload />} />
          {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="sellers" element={<AdminSellers />} />
          </Route>
          {/* other */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/role" element={<Role />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cookie" element={<CookiePolicy />} />
          <Route path="/" element={<UnifiedHomePage />} />
          <Route path="/tryon-info" element={<AboutAndContact />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
