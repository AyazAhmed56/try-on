import React, { useState, useRef } from "react";
import {
  User,
  Calendar,
  Phone,
  MapPin,
  Camera,
  Upload,
  Store,
  FileText,
  Save,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "../services/supabase";
import { uploadImage } from "../services/uploadImage";
import { Link, useNavigate } from "react-router-dom";

const SellerProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [shopLogo, setShopLogo] = useState(null);
  const [shopBanner, setShopBanner] = useState(null);
  const profileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const handleImageUpload = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return alert("Not authenticated");

    let avatarUrl = null;
    let logoUrl = null;
    let bannerUrl = null;

    if (profileImage) {
      avatarUrl = await uploadImage(
        "avatars",
        `${user.id}/profile.jpg`,
        profileImage
      );
    }

    if (shopLogo) {
      logoUrl = await uploadImage(
        "shop-assets",
        `${user.id}/logo.jpg`,
        shopLogo
      );
    }

    if (shopBanner) {
      bannerUrl = await uploadImage(
        "shop-assets",
        `${user.id}/banner.jpg`,
        shopBanner
      );
    }

    // 1️⃣ Update profiles
    await supabase
      .from("profiles")
      .update({
        name: e.target.name.value,
        phone: e.target["phone-no-1"].value,
        avatar_url: avatarUrl,
      })
      .eq("id", user.id);

    // 2️⃣ Upsert seller_profiles
    await supabase.from("seller_profiles").upsert({
      user_id: user.id,
      shop_name: e.target["Shop-name"].value,
      gst_no: e.target["gst-no"].value,
      reg_no: e.target["reg-no"].value,
      address: e.target.address.value,
      city: e.target.city.value,
      state: e.target.state.value,
      pincode: e.target.pincode.value,
      shop_logo: logoUrl,
      shop_banner: bannerUrl,
      dob: e.target["Date-of-birth"].value,
      gender: e.target.Gender.value,
    });

    navigate("/seller/dashboard");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50 py-12 px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="relative max-w-3xl mx-auto">
          <Link
                    to="/seller/dashboard"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-6 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                  </Link>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Seller Profile
            </h1>
            <p className="text-gray-600">
              Set up your shop and business details
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
            <div className="space-y-6">
              {/* Profile Photo */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-purple-400" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => profileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-linear-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                  <input
                    ref={profileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setProfileImage)}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Upload profile photo
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                />
              </div>

              {/* Date of Birth & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="Date-of-birth"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="Gender"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline w-4 h-4 mr-1" />
                    Phone Number 1
                  </label>
                  <input
                    type="tel"
                    name="phone-no-1"
                    required
                    placeholder="1234567890"
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline w-4 h-4 mr-1" />
                    Phone Number 2 (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone-no-2"
                    placeholder="1234567890"
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm font-medium text-gray-500">
                    Business Details
                  </span>
                </div>
              </div>

              {/* Shop Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Store className="inline w-4 h-4 mr-1" />
                  Shop Name
                </label>
                <input
                  type="text"
                  name="Shop-name"
                  required
                  placeholder="Enter your shop name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                />
              </div>

              {/* GST & Registration Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline w-4 h-4 mr-1" />
                    GST Number
                  </label>
                  <input
                    type="text"
                    name="gst-no"
                    required
                    placeholder="Enter GST number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline w-4 h-4 mr-1" />
                    Registration Number
                  </label>
                  <input
                    type="text"
                    name="reg-no"
                    required
                    placeholder="Enter registration number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Shop Address
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="Enter shop address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                />
              </div>

              {/* State, City, Pincode */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    placeholder="State"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="City"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode
                  </label>
                  <input
                    type="number"
                    name="pincode"
                    required
                    placeholder="Pincode"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 outline-none"
                  />
                </div>
              </div>

              {/* Shop Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shop Logo
                </label>
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-all duration-200 cursor-pointer bg-gray-50 hover:bg-purple-50"
                >
                  <div className="flex flex-col items-center">
                    {shopLogo ? (
                      <img
                        src={shopLogo}
                        alt="Shop Logo"
                        className="w-24 h-24 object-cover rounded-lg mb-2"
                      />
                    ) : (
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    )}
                    <p className="text-sm text-gray-600">
                      Click to upload shop logo
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setShopLogo)}
                  className="hidden"
                />
              </div>

              {/* Shop Banner */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shop Banner
                </label>
                <div
                  onClick={() => bannerInputRef.current?.click()}
                  className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-all duration-200 cursor-pointer bg-gray-50 hover:bg-purple-50"
                >
                  <div className="flex flex-col items-center">
                    {shopBanner ? (
                      <img
                        src={shopBanner}
                        alt="Shop Banner"
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                    ) : (
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    )}
                    <p className="text-sm text-gray-600">
                      Click to upload shop banner
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG up to 5MB (Recommended: 1200x400px)
                    </p>
                  </div>
                </div>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setShopBanner)}
                  className="hidden"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </form>

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

export default SellerProfile;
