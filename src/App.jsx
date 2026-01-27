import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import CustomerDashboard from "./pages/CustomerDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Role from "./pages/Role";
// import CustomerProfile from "./pages/CustomerProfile";
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
// import CustomerProductsPage from "./pages/CustomerProductsPage";
// import CustomerWishlistPage from "./pages/CustomerWishlistPage";
// import CustomerCartPage from "./pages/CustomerCartPage";
// import CustomerOrdersPage from "./pages/CustomerOrdersPage";
import TryOnPages from "./pages/TryOnPages";
import SellerItemView from "./seller/SellerItemView";
import CookiePolicy from "./components/CookiePolicy";
import OrderReceipt from "./seller/OrderReceipt";
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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/role" element={<Role />} />
          {/* <Route path="/customer/profile" element={<CustomerProfile />} /> */}
          <Route path="/seller/profile" element={<SellerProfile />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cookie" element={<CookiePolicy />} />
          <Route path="/seller/items" element={<SellerItem />} />
          <Route path="/seller/items/:id" element={<SellerItemView />} />
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
          {/* <Route path="/wishlist" element={<CustomerWishlistPage />} /> */}
          {/* <Route path="/products" element={<CustomerProductsPage />} /> */}
          {/* <Route path="/cart" element={<CustomerCartPage />} /> */}
          {/* <Route path="/orders" element={<CustomerOrdersPage />} /> */}
          <Route path="/tryon-info" element={<TryOnPages />} />
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
