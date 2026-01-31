import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CustomerDashboard from "./customer/CustomerDashboard";
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
// import CustomerAllItems from "./customer/CustomerAllItems";
// import CustomerWishlist from "./customer/CustomerWishlist";
// import CustomerCart from "./customer/CustomerCart";
// import CustomerOrder from "./customer/CustomerOrder";
// import CustomerReviews from "./customer/CustomerReviews";
// import CustomerOffers from "./customer/CustomerOffers";
// import InvoiceDownload from "./components/InvoiceDownload";
// import CustomerSupport from "./components/CustomerSupport";
// import ProductRating from "./components/ProductRating";
// import FestivalOfferPage from "./pages/FestivalOfferPage";
// import DiscountSalesPage from "./pages/DiscountSalesPage";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UnifiedHomePage />} />
          {/* <Route path="/customer/home" element={<CustomerDashboard />} /> */}
          <Route path="/customer/dashboard" element={<CustomerDashboard />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/role" element={<Role />} />
          <Route path="/customer/profile" element={<CustomerProfile />} />
          <Route path="/seller/profile" element={<SellerProfile />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cookie" element={<CookiePolicy />} />
          <Route path="/seller/items" element={<SellerItem />} />
          <Route path="/seller/items/:id" element={<ItemView />} />
          <Route path="/customer/item/:id" element={<ItemView />} />
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
          {/* <Route path="/customer/wishlist" element={<CustomerWishlist />} />
          <Route path="/customer/all-items" element={<CustomerAllItems />} />
          <Route path="/customer/cart" element={<CustomerCart />} />
          <Route path="/customer/orders" element={<CustomerOrder />} /> */}
          <Route path="/tryon-info" element={<TryOnPages />} />
          {/* <Route path="/customer/reviews" element={<CustomerReviews />} />
          <Route path="/customer/offers" element={<CustomerOffers />} /> */}
          {/* <Route path="/invoice" element={<InvoiceDownload />} /> */}
          {/* <Route path="/need-help" element={<CustomerSupport />} /> */}
          {/* <Route path="/rate-products" element={<ProductRating />} /> */}
          {/* <Route path="/festival" element={<FestivalOfferPage />} /> */}
          {/* <Route path="/discount" element={<DiscountSalesPage />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
