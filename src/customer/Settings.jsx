import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bell,
  CreditCard,
  Eye,
  EyeOff,
  Save,
  Upload,
  Camera,
  Shield,
  Globe,
  Moon,
  Sun,
  Smartphone,
  ArrowLeft,
  Trash2,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    avatar_url: "",
    bio: "",
    date_of_birth: "",
    gender: "",
  });
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    label: "Home",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    is_default: false,
  });
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
    newsletter: false,
    smsNotifications: false,
    pushNotifications: true,
  });
  const [preferences, setPreferences] = useState({
    language: "en",
    currency: "USD",
    theme: "light",
    emailFrequency: "daily",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        navigate("/login");
        return;
      }
      setUserId(user.id);
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (profileData)
        setProfile({
          name: profileData.name || "",
          email: profileData.email || user.email || "",
          phone: profileData.phone || "",
          avatar_url: profileData.avatar_url || "",
          bio: profileData.bio || "",
          date_of_birth: profileData.date_of_birth || "",
          gender: profileData.gender || "",
        });
      console.log("Error", profileError);
      const { data: addressData } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id);
      if (addressData) setAddresses(addressData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: profile.name,
          phone: profile.phone,
          bio: profile.bio,
          date_of_birth: profile.date_of_birth,
          gender: profile.gender,
          avatar_url: profile.avatar_url,
        })
        .eq("id", userId);
      if (error) throw error;
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
      console.log(error);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    if (security.newPassword !== security.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      setSaving(false);
      return;
    }
    if (security.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long!",
      });
      setSaving(false);
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({
        password: security.newPassword,
      });
      if (error) throw error;
      setMessage({ type: "success", text: "Password changed successfully!" });
      setSecurity({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        twoFactorEnabled: security.twoFactorEnabled,
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to change password. Please try again.",
      });
      console.log(error);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      if (newAddress.is_default)
        await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", userId);
      const { data, error } = await supabase
        .from("addresses")
        .insert({ user_id: userId, ...newAddress })
        .select()
        .single();
      if (error) throw error;
      setAddresses([...addresses, data]);
      setNewAddress({
        label: "Home",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        is_default: false,
      });
      setMessage({ type: "success", text: "Address added successfully!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to add address. Please try again.",
      });
      console.log(error);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;
    try {
      const { error } = await supabase
        .from("addresses")
        .delete()
        .eq("id", addressId);
      if (error) throw error;
      setAddresses(addresses.filter((a) => a.id !== addressId));
      setMessage({ type: "success", text: "Address deleted successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete address." });
      console.log(error);
    } finally {
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleNotificationUpdate = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const { error } = await supabase.auth.updateUser({
        data: { notification_preferences: notifications },
      });
      if (error) throw error;
      setMessage({
        type: "success",
        text: "Notification preferences updated!",
      });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update preferences." });
      console.log(error);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handlePreferencesUpdate = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const { error } = await supabase.auth.updateUser({
        data: { preferences },
      });
      if (error) throw error;
      setMessage({
        type: "success",
        text: "Preferences updated successfully!",
      });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update preferences." });
      console.log(error);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setSaving(true);
      const fileExt = file.name.split(".").pop();
      const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, file);
      if (uploadError) throw uploadError;
      const {
        data: { publicUrl },
      } = supabase.storage.from("profiles").getPublicUrl(filePath);
      setProfile({ ...profile, avatar_url: publicUrl });
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);
      if (updateError) throw updateError;
      setMessage({ type: "success", text: "Avatar updated successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to upload avatar." });
      console.log(error);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone!",
      )
    )
      return;
    try {
      setSaving(true);
      alert(
        "Account deletion requested. Please contact support to complete this process.",
      );
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to delete account. Please contact support.",
      });
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Globe },
  ];

  // Reusable input class
  const inputCls =
    "w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none transition-all text-gray-800 placeholder-gray-400";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

  // Reusable save button
  const SaveBtn = ({ label = "Save Changes", onClick }) => (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={saving}
      className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 shadow-sm shadow-green-200 hover:shadow-md hover:shadow-green-300 transition-all disabled:opacity-50 active:scale-[0.98]"
      style={{ background: "linear-gradient(135deg, #16a34a, #059669)" }}
    >
      {saving ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Saving…</span>
        </>
      ) : (
        <>
          <Save className="w-4 h-4" />
          <span>{label}</span>
        </>
      )}
    </button>
  );

  // Toggle switch component
  const Toggle = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-green-400/40 peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 after:border after:border-gray-200" />
    </label>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Settings
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Manage your account settings and preferences
            </p>
          </div>
          <Link
            to="/customer/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm shadow-green-200 hover:shadow-md hover:shadow-green-300 transition-all"
            style={{ background: "linear-gradient(135deg, #16a34a, #059669)" }}
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-5 p-3.5 rounded-xl flex items-center gap-3 text-sm font-medium border ${message.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span className="flex-1">{message.text}</span>
            <button onClick={() => setMessage({ type: "", text: "" })}>
              <X className="w-4 h-4 opacity-60 hover:opacity-100" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-3 sticky top-24">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "text-white shadow-sm"
                        : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                    }`}
                    style={
                      activeTab === tab.id
                        ? {
                            background:
                              "linear-gradient(135deg, #16a34a, #059669)",
                          }
                        : {}
                    }
                  >
                    <tab.icon className="w-4 h-4 shrink-0" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Panel */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-12 text-center">
                <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-gray-500">Loading settings…</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
                {/* ── PROFILE ── */}
                {activeTab === "profile" && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-6">
                      Profile Information
                    </h2>
                    <form onSubmit={handleProfileUpdate} className="space-y-5">
                      {/* Avatar */}
                      <div className="flex items-center gap-5">
                        <div className="relative shrink-0">
                          {profile.avatar_url ? (
                            <img
                              src={profile.avatar_url}
                              alt="Avatar"
                              className="w-20 h-20 rounded-2xl object-cover border-2 border-green-100"
                            />
                          ) : (
                            <div
                              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
                              style={{
                                background:
                                  "linear-gradient(135deg, #16a34a, #059669)",
                              }}
                            >
                              {profile.name?.[0]?.toUpperCase() || "U"}
                            </div>
                          )}
                          <label
                            htmlFor="avatar-upload"
                            className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-white cursor-pointer transition-colors shadow-sm"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <input
                              id="avatar-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            Profile Picture
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            JPG, PNG or GIF · max 5MB
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>Full Name</label>
                          <input
                            type="text"
                            value={profile.name}
                            onChange={(e) =>
                              setProfile({ ...profile, name: e.target.value })
                            }
                            className={inputCls}
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Email</label>
                          <input
                            type="email"
                            value={profile.email}
                            disabled
                            className={`${inputCls} cursor-not-allowed opacity-60`}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Phone Number</label>
                          <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) =>
                              setProfile({ ...profile, phone: e.target.value })
                            }
                            className={inputCls}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Date of Birth</label>
                          <input
                            type="date"
                            value={profile.date_of_birth}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                date_of_birth: e.target.value,
                              })
                            }
                            className={inputCls}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className={labelCls}>Gender</label>
                          <select
                            value={profile.gender}
                            onChange={(e) =>
                              setProfile({ ...profile, gender: e.target.value })
                            }
                            className={inputCls}
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">
                              Prefer not to say
                            </option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className={labelCls}>Bio</label>
                        <textarea
                          value={profile.bio}
                          onChange={(e) =>
                            setProfile({ ...profile, bio: e.target.value })
                          }
                          rows={3}
                          className={inputCls}
                          placeholder="Tell us about yourself…"
                        />
                      </div>

                      <SaveBtn />
                    </form>
                  </div>
                )}

                {/* ── ADDRESSES ── */}
                {activeTab === "addresses" && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-5">
                      Saved Addresses
                    </h2>

                    <div className="space-y-3 mb-7">
                      {addresses.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 rounded-2xl">
                          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <MapPin className="w-6 h-6 text-green-500" />
                          </div>
                          <p className="text-sm text-gray-500">
                            No saved addresses yet
                          </p>
                        </div>
                      ) : (
                        addresses.map((address) => (
                          <div
                            key={address.id}
                            className="p-4 border border-gray-100 rounded-2xl hover:border-green-200 transition-all bg-gray-50/50"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="text-sm font-semibold text-gray-900">
                                    {address.label}
                                  </span>
                                  {address.is_default && (
                                    <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                  {address.street}
                                  <br />
                                  {address.city}, {address.state} {address.zip}
                                  <br />
                                  {address.country}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                      <h3 className="text-sm font-bold text-gray-800 mb-4">
                        Add New Address
                      </h3>
                      <form onSubmit={handleAddAddress} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            {
                              label: "Label",
                              key: "label",
                              type: "select",
                              options: ["Home", "Work", "Other"],
                            },
                            {
                              label: "Street Address",
                              key: "street",
                              placeholder: "123 Main St",
                            },
                            {
                              label: "City",
                              key: "city",
                              placeholder: "New York",
                            },
                            {
                              label: "State / Province",
                              key: "state",
                              placeholder: "NY",
                            },
                            {
                              label: "ZIP / Postal Code",
                              key: "zip",
                              placeholder: "10001",
                            },
                            {
                              label: "Country",
                              key: "country",
                              placeholder: "United States",
                            },
                          ].map(
                            ({ label, key, type, options, placeholder }) => (
                              <div key={key}>
                                <label className={labelCls}>{label}</label>
                                {type === "select" ? (
                                  <select
                                    value={newAddress[key]}
                                    onChange={(e) =>
                                      setNewAddress({
                                        ...newAddress,
                                        [key]: e.target.value,
                                      })
                                    }
                                    className={inputCls}
                                  >
                                    {options.map((o) => (
                                      <option key={o} value={o}>
                                        {o}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type="text"
                                    required
                                    value={newAddress[key]}
                                    onChange={(e) =>
                                      setNewAddress({
                                        ...newAddress,
                                        [key]: e.target.value,
                                      })
                                    }
                                    className={inputCls}
                                    placeholder={placeholder}
                                  />
                                )}
                              </div>
                            ),
                          )}
                        </div>
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            id="default-address"
                            checked={newAddress.is_default}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                is_default: e.target.checked,
                              })
                            }
                            className="w-4 h-4 rounded border-gray-300 accent-green-600 cursor-pointer"
                          />
                          <label
                            htmlFor="default-address"
                            className="text-sm font-medium text-gray-600 cursor-pointer"
                          >
                            Set as default address
                          </label>
                        </div>
                        <SaveBtn label="Add Address" />
                      </form>
                    </div>
                  </div>
                )}

                {/* ── SECURITY ── */}
                {activeTab === "security" && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-6">
                      Security Settings
                    </h2>

                    <div className="mb-7">
                      <h3 className="text-sm font-bold text-gray-800 mb-4">
                        Change Password
                      </h3>
                      <form
                        onSubmit={handlePasswordChange}
                        className="space-y-4"
                      >
                        <div>
                          <label className={labelCls}>New Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={security.newPassword}
                              onChange={(e) =>
                                setSecurity({
                                  ...security,
                                  newPassword: e.target.value,
                                })
                              }
                              required
                              className={`${inputCls} pr-11`}
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className={labelCls}>
                            Confirm New Password
                          </label>
                          <input
                            type={showPassword ? "text" : "password"}
                            value={security.confirmPassword}
                            onChange={(e) =>
                              setSecurity({
                                ...security,
                                confirmPassword: e.target.value,
                              })
                            }
                            required
                            className={inputCls}
                            placeholder="Confirm new password"
                          />
                        </div>
                        <SaveBtn label="Update Password" />
                      </form>
                    </div>

                    <div className="border-t border-gray-100 pt-6 mb-7">
                      <h3 className="text-sm font-bold text-gray-800 mb-3">
                        Two-Factor Authentication
                      </h3>
                      <div className="flex items-center justify-between p-4 bg-green-50/50 border border-green-100 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
                            <Shield
                              className="w-4.5 h-4.5 text-green-700"
                              style={{ width: "18px", height: "18px" }}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              2FA Status
                            </p>
                            <p className="text-xs text-gray-400">
                              Add an extra layer of security
                            </p>
                          </div>
                        </div>
                        <Toggle
                          checked={security.twoFactorEnabled}
                          onChange={(e) =>
                            setSecurity({
                              ...security,
                              twoFactorEnabled: e.target.checked,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="border-t border-red-100 pt-6">
                      <h3 className="text-sm font-bold text-red-500 mb-3">
                        Danger Zone
                      </h3>
                      <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                        <p className="text-xs text-red-600 mb-4">
                          Once you delete your account, there is no going back.
                          Please be certain.
                        </p>
                        <button
                          onClick={handleDeleteAccount}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all"
                        >
                          <Trash2 className="w-4 h-4" /> Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── NOTIFICATIONS ── */}
                {activeTab === "notifications" && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-5">
                      Notification Preferences
                    </h2>
                    <div className="space-y-2.5">
                      {[
                        {
                          key: "emailNotifications",
                          label: "Email Notifications",
                          description: "Receive notifications via email",
                        },
                        {
                          key: "orderUpdates",
                          label: "Order Updates",
                          description: "Get updates about your orders",
                        },
                        {
                          key: "promotions",
                          label: "Promotions & Offers",
                          description: "Receive promotional emails",
                        },
                        {
                          key: "newsletter",
                          label: "Newsletter",
                          description: "Subscribe to our newsletter",
                        },
                        {
                          key: "smsNotifications",
                          label: "SMS Notifications",
                          description: "Receive updates via SMS",
                        },
                        {
                          key: "pushNotifications",
                          label: "Push Notifications",
                          description: "Browser push notifications",
                        },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between p-4 bg-gray-50/80 border border-gray-100 rounded-2xl hover:border-green-100 transition-all"
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {item.label}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                          <Toggle
                            checked={notifications[item.key]}
                            onChange={(e) =>
                              setNotifications({
                                ...notifications,
                                [item.key]: e.target.checked,
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-5">
                      <SaveBtn
                        label="Save Preferences"
                        onClick={handleNotificationUpdate}
                      />
                    </div>
                  </div>
                )}

                {/* ── PREFERENCES ── */}
                {activeTab === "preferences" && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-5">
                      App Preferences
                    </h2>
                    <div className="space-y-5">
                      <div>
                        <label className={labelCls}>Language</label>
                        <select
                          value={preferences.language}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              language: e.target.value,
                            })
                          }
                          className={inputCls}
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="zh">Chinese</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Currency</label>
                        <select
                          value={preferences.currency}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              currency: e.target.value,
                            })
                          }
                          className={inputCls}
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="JPY">JPY (¥)</option>
                          <option value="INR">INR (₹)</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Theme</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            {
                              id: "light",
                              icon: <Sun className="w-5 h-5 text-amber-500" />,
                              label: "Light",
                            },
                            {
                              id: "dark",
                              icon: <Moon className="w-5 h-5 text-slate-600" />,
                              label: "Dark",
                            },
                            {
                              id: "auto",
                              icon: (
                                <Smartphone className="w-5 h-5 text-blue-500" />
                              ),
                              label: "Auto",
                            },
                          ].map(({ id, icon, label }) => (
                            <button
                              key={id}
                              onClick={() =>
                                setPreferences({ ...preferences, theme: id })
                              }
                              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${preferences.theme === id ? "border-green-500 bg-green-50/60" : "border-gray-200 hover:border-green-200 bg-white"}`}
                            >
                              {icon}
                              <span className="text-xs font-semibold text-gray-700 capitalize">
                                {label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Email Frequency</label>
                        <select
                          value={preferences.emailFrequency}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              emailFrequency: e.target.value,
                            })
                          }
                          className={inputCls}
                        >
                          <option value="instant">Instant</option>
                          <option value="daily">Daily Digest</option>
                          <option value="weekly">Weekly Summary</option>
                          <option value="never">Never</option>
                        </select>
                      </div>
                      <SaveBtn
                        label="Save Preferences"
                        onClick={handlePreferencesUpdate}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
