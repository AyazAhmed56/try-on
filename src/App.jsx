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
import TryOnPages from "./pages/TryOnPages";
import ItemView from "./pages/ItemView";
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
          <Route path="/tryon-info" element={<TryOnPages />} />

          {/* seller */}
          <Route path="/seller/profile" element={<SellerProfile />} />
          <Route path="/seller/items" element={<SellerItem />} />
          <Route path="/seller/items/:id" element={<ItemView />} />
          <Route path="/post-item/:id" element={<AdvancedPostItem />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/post-item" element={<AdvancedPostItem />} />
          <Route path="/my-items" element={<SellerItem />} />
          <Route path="/order-list" element={<SellerOrder />} />
          <Route path="/seller/reviews" element={<SellerItemReviews />} />
          <Route
            path="/other-sellers-items-reviews"
            element={<OtherSellerReviewsAndItems />}
          />
          <Route path="/order-receipt" element={<OrderReceipt />} />

          {/* admin */}

          {/* other */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/role" element={<Role />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cookie" element={<CookiePolicy />} />
          <Route path="/" element={<UnifiedHomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
