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

const UploadZone = ({ image, onClick, alt, tall = false }) => (
  <div
    onClick={onClick}
    className={`w-full border-2 border-dashed border-green-200 rounded-2xl hover:border-green-400 hover:bg-green-50/30 transition-all cursor-pointer bg-gray-50 flex flex-col items-center justify-center gap-2 overflow-hidden ${tall ? "py-5" : "py-8"}`}
  >
    {image ? (
      <img
        src={image}
        alt={alt}
        className={`object-cover rounded-xl ${tall ? "w-full h-32" : "w-20 h-20"}`}
      />
    ) : (
      <>
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
          <Upload className="w-5 h-5 text-green-500" />
        </div>
        <p className="text-sm text-gray-500 font-medium">
          Click to upload {alt.toLowerCase()}
        </p>
        <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
      </>
    )}
  </div>
);

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

    if (profileImage)
      avatarUrl = await uploadImage(
        "avatars",
        `${user.id}/profile.jpg`,
        profileImage,
      );
    if (shopLogo)
      logoUrl = await uploadImage(
        "shop-assets",
        `${user.id}/logo.jpg`,
        shopLogo,
      );
    if (shopBanner)
      bannerUrl = await uploadImage(
        "shop-assets",
        `${user.id}/banner.jpg`,
        shopBanner,
      );

    await supabase
      .from("profiles")
      .update({
        name: e.target.name.value,
        phone: e.target["phone-no-1"].value,
        avatar_url: avatarUrl,
      })
      .eq("id", user.id);

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
      approved: false, // 🔥 IMPORTANT
    });

    navigate("/seller/pending");
  };

  // Shared styles
  const inputCls =
    "w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none transition-all text-gray-800 placeholder-gray-400";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-125 h-125 bg-green-100 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-125 h-125 bg-emerald-100 rounded-full blur-3xl opacity-40 animate-pulse [animation-delay:2s]" />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="relative max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            to="/seller/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          {/* Page title */}
          <div className="text-center mb-7">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
              Seller Profile
            </h1>
            <p className="text-sm text-gray-400">
              Set up your shop and business details
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8 space-y-6">
            {/* Profile Photo */}
            <div className="flex flex-col items-center pb-6 border-b border-gray-100">
              <div className="relative group mb-3">
                <div className="w-28 h-28 rounded-2xl bg-green-50 flex items-center justify-center overflow-hidden border-2 border-green-100 shadow-sm">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-green-400" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => profileInputRef.current?.click()}
                  className="absolute -bottom-1.5 -right-1.5 w-9 h-9 rounded-xl flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                  style={{
                    background: "linear-gradient(135deg, #16a34a, #059669)",
                  }}
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setProfileImage)}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-400 font-medium">
                Upload profile photo
              </p>
            </div>

            {/* Personal Info section label */}
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #059669)",
                }}
              >
                1
              </div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                Personal Information
              </h2>
            </div>

            {/* Full Name */}
            <div>
              <label className={labelCls}>
                <User className="inline w-3.5 h-3.5 mr-1.5 text-green-600" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Enter your full name"
                className={inputCls}
              />
            </div>

            {/* DOB + Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>
                  <Calendar className="inline w-3.5 h-3.5 mr-1.5 text-green-600" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="Date-of-birth"
                  required
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Gender</label>
                <select name="Gender" className={inputCls}>
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
                <label className={labelCls}>
                  <Phone className="inline w-3.5 h-3.5 mr-1.5 text-green-600" />
                  Phone Number 1
                </label>
                <input
                  type="tel"
                  name="phone-no-1"
                  required
                  placeholder="1234567890"
                  pattern="[0-9]{10}"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>
                  <Phone className="inline w-3.5 h-3.5 mr-1.5 text-green-600" />
                  Phone Number 2{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone-no-2"
                  placeholder="1234567890"
                  pattern="[0-9]{10}"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Business Details divider */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #059669)",
                }}
              >
                2
              </div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                Business Details
              </h2>
            </div>

            {/* Shop Name */}
            <div>
              <label className={labelCls}>
                <Store className="inline w-3.5 h-3.5 mr-1.5 text-green-600" />
                Shop Name
              </label>
              <input
                type="text"
                name="Shop-name"
                required
                placeholder="Enter your shop name"
                className={inputCls}
              />
            </div>

            {/* GST + Reg No */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>
                  <FileText className="inline w-3.5 h-3.5 mr-1.5 text-green-600" />
                  GST Number
                </label>
                <input
                  type="text"
                  name="gst-no"
                  required
                  placeholder="Enter GST number"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>
                  <FileText className="inline w-3.5 h-3.5 mr-1.5 text-green-600" />
                  Registration Number
                </label>
                <input
                  type="text"
                  name="reg-no"
                  required
                  placeholder="Enter registration number"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className={labelCls}>
                <MapPin className="inline w-3.5 h-3.5 mr-1.5 text-green-600" />
                Shop Address
              </label>
              <input
                type="text"
                name="address"
                required
                placeholder="Enter shop address"
                className={inputCls}
              />
            </div>

            {/* State, City, Pincode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "State", name: "state", placeholder: "State" },
                { label: "City", name: "city", placeholder: "City" },
                {
                  label: "Pincode",
                  name: "pincode",
                  placeholder: "Pincode",
                  type: "number",
                },
              ].map(({ label, name, placeholder, type = "text" }) => (
                <div key={name}>
                  <label className={labelCls}>{label}</label>
                  <input
                    type={type}
                    name={name}
                    required
                    placeholder={placeholder}
                    className={inputCls}
                  />
                </div>
              ))}
            </div>

            {/* Shop Assets divider */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #059669)",
                }}
              >
                3
              </div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                Shop Assets
              </h2>
            </div>

            {/* Shop Logo */}
            <div>
              <label className={labelCls}>Shop Logo</label>
              <UploadZone
                image={shopLogo}
                inputRef={logoInputRef}
                onClick={() => logoInputRef.current?.click()}
                alt="Shop Logo"
              />
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
              <label className={labelCls}>Shop Banner</label>
              <UploadZone
                image={shopBanner}
                inputRef={bannerInputRef}
                onClick={() => bannerInputRef.current?.click()}
                alt="Shop Banner"
                tall
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Recommended: 1200×400px
              </p>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setShopBanner)}
                className="hidden"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 text-sm font-semibold text-white rounded-xl flex items-center justify-center gap-2 shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300 active:scale-[0.98] transition-all mt-2"
              style={{
                background: "linear-gradient(135deg, #16a34a, #059669)",
              }}
            >
              <Save className="w-4 h-4" /> Save Profile
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SellerProfile;
