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

  // Profile Settings
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    avatar_url: "",
    bio: "",
    date_of_birth: "",
    gender: "",
  });

  // Address Settings
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

  // Security Settings
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
    newsletter: false,
    smsNotifications: false,
    pushNotifications: true,
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    language: "en",
    currency: "USD",
    theme: "light",
    emailFrequency: "daily",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User not found:", userError);
        navigate("/login");
        return;
      }

      setUserId(user.id);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile({
          name: profileData.name || "",
          email: profileData.email || user.email || "",
          phone: profileData.phone || "",
          avatar_url: profileData.avatar_url || "",
          bio: profileData.bio || "",
          date_of_birth: profileData.date_of_birth || "",
          gender: profileData.gender || "",
        });
      }

      // Fetch addresses
      const { data: addressData } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id);

      if (addressData) {
        setAddresses(addressData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
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

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
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
      setMessage({
        type: "error",
        text: "Passwords do not match!",
      });
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

      setMessage({
        type: "success",
        text: "Password changed successfully!",
      });
      setSecurity({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        twoFactorEnabled: security.twoFactorEnabled,
      });
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage({
        type: "error",
        text: "Failed to change password. Please try again.",
      });
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
      // If this is the default address, unset other defaults
      if (newAddress.is_default) {
        await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", userId);
      }

      const { data, error } = await supabase
        .from("addresses")
        .insert({
          user_id: userId,
          ...newAddress,
        })
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
      setMessage({
        type: "success",
        text: "Address added successfully!",
      });
    } catch (error) {
      console.error("Error adding address:", error);
      setMessage({
        type: "error",
        text: "Failed to add address. Please try again.",
      });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const { error } = await supabase
        .from("addresses")
        .delete()
        .eq("id", addressId);

      if (error) throw error;

      setAddresses(addresses.filter((addr) => addr.id !== addressId));
      setMessage({
        type: "success",
        text: "Address deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting address:", error);
      setMessage({
        type: "error",
        text: "Failed to delete address. Please try again.",
      });
    } finally {
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleNotificationUpdate = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      // Store notification preferences in user metadata or separate table
      const { error } = await supabase.auth.updateUser({
        data: { notification_preferences: notifications },
      });

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Notification preferences updated!",
      });
    } catch (error) {
      console.error("Error updating notifications:", error);
      setMessage({
        type: "error",
        text: "Failed to update preferences. Please try again.",
      });
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
        data: { preferences: preferences },
      });

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Preferences updated successfully!",
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      setMessage({
        type: "error",
        text: "Failed to update preferences. Please try again.",
      });
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
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

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

      setMessage({
        type: "success",
        text: "Avatar updated successfully!",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setMessage({
        type: "error",
        text: "Failed to upload avatar. Please try again.",
      });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone!",
      )
    )
      return;

    try {
      setSaving(true);
      // You would typically call an edge function or API endpoint to handle account deletion
      alert(
        "Account deletion requested. Please contact support to complete this process.",
      );
    } catch (error) {
      console.error("Error deleting account:", error);
      setMessage({
        type: "error",
        text: "Failed to delete account. Please contact support.",
      });
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

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your account settings and preferences
              </p>
            </div>
            <Link
              to="/customer/dashboard"
              className="px-4 py-2 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{message.text}</span>
            <button
              onClick={() => setMessage({ type: "", text: "" })}
              className="ml-auto"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 sticky top-24">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-purple-50"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading settings...</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                {/* Profile Settings */}
                {activeTab === "profile" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Profile Information
                    </h2>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      {/* Avatar Upload */}
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          {profile.avatar_url ? (
                            <img
                              src={profile.avatar_url}
                              alt="Avatar"
                              className="w-24 h-24 rounded-full object-cover border-4 border-purple-200"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-3xl font-bold">
                              {profile.name?.[0]?.toUpperCase() || "U"}
                            </div>
                          )}
                          <label
                            htmlFor="avatar-upload"
                            className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full text-white cursor-pointer hover:bg-purple-700 transition-all"
                          >
                            <Camera className="w-4 h-4" />
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
                          <h3 className="font-semibold text-gray-900">
                            Profile Picture
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            JPG, PNG or GIF, max 5MB
                          </p>
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={profile.name}
                            onChange={(e) =>
                              setProfile({ ...profile, name: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={profile.email}
                            disabled
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) =>
                              setProfile({ ...profile, phone: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            value={profile.date_of_birth}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                date_of_birth: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender
                          </label>
                          <select
                            value={profile.gender}
                            onChange={(e) =>
                              setProfile({ ...profile, gender: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          value={profile.bio}
                          onChange={(e) =>
                            setProfile({ ...profile, bio: e.target.value })
                          }
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* Address Settings */}
                {activeTab === "addresses" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Saved Addresses
                    </h2>

                    {/* Existing Addresses */}
                    <div className="space-y-4 mb-8">
                      {addresses.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl">
                          <MapPin className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                          <p className="text-gray-600">
                            No saved addresses yet
                          </p>
                        </div>
                      ) : (
                        addresses.map((address) => (
                          <div
                            key={address.id}
                            className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 transition-all"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="font-semibold text-gray-900">
                                    {address.label}
                                  </span>
                                  {address.is_default && (
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">
                                  {address.street}
                                  <br />
                                  {address.city}, {address.state} {address.zip}
                                  <br />
                                  {address.country}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add New Address Form */}
                    <div className="border-t-2 border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Add New Address
                      </h3>
                      <form onSubmit={handleAddAddress} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Label
                            </label>
                            <select
                              value={newAddress.label}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  label: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="Home">Home</option>
                              <option value="Work">Work</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Street Address
                            </label>
                            <input
                              type="text"
                              value={newAddress.street}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  street: e.target.value,
                                })
                              }
                              required
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="123 Main St"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              value={newAddress.city}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  city: e.target.value,
                                })
                              }
                              required
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="New York"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              State/Province
                            </label>
                            <input
                              type="text"
                              value={newAddress.state}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  state: e.target.value,
                                })
                              }
                              required
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="NY"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ZIP/Postal Code
                            </label>
                            <input
                              type="text"
                              value={newAddress.zip}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  zip: e.target.value,
                                })
                              }
                              required
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="10001"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country
                            </label>
                            <input
                              type="text"
                              value={newAddress.country}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  country: e.target.value,
                                })
                              }
                              required
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="United States"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
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
                            className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <label
                            htmlFor="default-address"
                            className="text-sm font-medium text-gray-700"
                          >
                            Set as default address
                          </label>
                        </div>

                        <button
                          type="submit"
                          disabled={saving}
                          className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                          {saving ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span>Adding...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-5 h-5" />
                              <span>Add Address</span>
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === "security" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Security Settings
                    </h2>

                    {/* Change Password */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Change Password
                      </h3>
                      <form
                        onSubmit={handlePasswordChange}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
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
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
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
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Confirm new password"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={saving}
                          className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                          {saving ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span>Updating...</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-5 h-5" />
                              <span>Update Password</span>
                            </>
                          )}
                        </button>
                      </form>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="border-t-2 border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Two-Factor Authentication
                      </h3>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Shield className="w-6 h-6 text-purple-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              2FA Status
                            </p>
                            <p className="text-sm text-gray-600">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={security.twoFactorEnabled}
                            onChange={(e) =>
                              setSecurity({
                                ...security,
                                twoFactorEnabled: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-linear-to-r peer-checked:from-purple-600 peer-checked:to-pink-600"></div>
                        </label>
                      </div>
                    </div>

                    {/* Delete Account */}
                    <div className="border-t-2 border-red-200 pt-6 mt-8">
                      <h3 className="text-lg font-semibold text-red-600 mb-4">
                        Danger Zone
                      </h3>
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-700 mb-4">
                          Once you delete your account, there is no going back.
                          Please be certain.
                        </p>
                        <button
                          onClick={handleDeleteAccount}
                          className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all flex items-center space-x-2"
                        >
                          <Trash2 className="w-5 h-5" />
                          <span>Delete Account</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === "notifications" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Notification Preferences
                    </h2>
                    <div className="space-y-4">
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
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.label}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifications[item.key]}
                              onChange={(e) =>
                                setNotifications({
                                  ...notifications,
                                  [item.key]: e.target.checked,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-linear-to-r peer-checked:from-purple-600 peer-checked:to-pink-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleNotificationUpdate}
                      disabled={saving}
                      className="w-full mt-6 py-3 px-4 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>Save Preferences</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Preferences */}
                {activeTab === "preferences" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      App Preferences
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select
                          value={preferences.language}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              language: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="zh">Chinese</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Currency
                        </label>
                        <select
                          value={preferences.currency}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              currency: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="JPY">JPY (¥)</option>
                          <option value="INR">INR (₹)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Theme
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          {["light", "dark", "auto"].map((theme) => (
                            <button
                              key={theme}
                              onClick={() =>
                                setPreferences({ ...preferences, theme })
                              }
                              className={`p-4 rounded-xl border-2 transition-all ${
                                preferences.theme === theme
                                  ? "border-purple-600 bg-purple-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div className="flex flex-col items-center space-y-2">
                                {theme === "light" && (
                                  <Sun className="w-6 h-6 text-yellow-500" />
                                )}
                                {theme === "dark" && (
                                  <Moon className="w-6 h-6 text-purple-600" />
                                )}
                                {theme === "auto" && (
                                  <Smartphone className="w-6 h-6 text-blue-600" />
                                )}
                                <span className="text-sm font-medium capitalize">
                                  {theme}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Frequency
                        </label>
                        <select
                          value={preferences.emailFrequency}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              emailFrequency: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="instant">Instant</option>
                          <option value="daily">Daily Digest</option>
                          <option value="weekly">Weekly Summary</option>
                          <option value="never">Never</option>
                        </select>
                      </div>

                      <button
                        onClick={handlePreferencesUpdate}
                        disabled={saving}
                        className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            <span>Save Preferences</span>
                          </>
                        )}
                      </button>
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
