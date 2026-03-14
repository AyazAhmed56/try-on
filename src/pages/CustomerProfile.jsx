import React, { useState, useRef } from "react";
import {
  User,
  Calendar,
  Phone,
  MapPin,
  Camera,
  Save,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "../services/supabase";
import { uploadImage } from "../services/uploadImage";
import { Link, useNavigate } from "react-router-dom";

const CustomerProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setProfileImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Not authenticated");
      setSaving(false);
      return;
    }

    let avatarUrl = null;
    if (imageFile) {
      avatarUrl = await uploadImage(
        "avatars",
        `${user.id}/avatar.jpg`,
        imageFile,
      );
    }

    await supabase
      .from("profiles")
      .update({
        name: e.target.name.value,
        phone: e.target["phone-no-1"].value,
        avatar_url: avatarUrl,
      })
      .eq("id", user.id);

    await supabase.from("customer_profiles").upsert({
      user_id: user.id,
      dob: e.target["Date-of-birth"].value,
      gender: e.target.Gender.value,
      address: e.target.address.value,
      city: e.target.city.value,
      state: e.target.state.value,
      pincode: e.target.pincode.value,
    });

    setSaving(false);
    navigate("/customer/home");
  };

  const inp = (name) => ({
    onFocus: () => setFocusedField(name),
    onBlur: () => setFocusedField(null),
    style: {
      width: "100%",
      padding: "12px 16px",
      border: `1px solid ${focusedField === name ? "#22C55E" : "#E5E7EB"}`,
      borderRadius: 12,
      outline: "none",
      fontSize: 14,
      color: "#111827",
      background: "#F9FAFB",
      boxShadow:
        focusedField === name ? "0 0 0 3px rgba(34,197,94,0.15)" : "none",
      transition: "all 0.2s ease",
    },
  });

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 7,
  };

  return (
    <div
      className="cp-root min-h-screen py-12 px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #F0FDF4 0%, #ffffff 50%, #ECFDF5 100%)",
      }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.03 }}
        >
          <defs>
            <pattern
              id="cp-grid"
              x="0"
              y="0"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.4" fill="#16A34A" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cp-grid)" />
        </svg>
      </div>

      {/* Back button */}
      <div className="relative max-w-3xl mx-auto mb-6">
        <Link
          to="/customer/dashboard"
          className="back-btn inline-flex items-center gap-2 font-medium transition-all group"
          style={{ color: "#16A34A", textDecoration: "none" }}
        >
          <span
            className="w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 group-hover:bg-green-600 group-hover:border-green-600"
            style={{
              background: "#fff",
              borderColor: "#BBF7D0",
              boxShadow: "0 1px 4px rgba(22,163,74,0.10)",
            }}
          >
            <ArrowLeft
              style={{ width: 14, height: 14 }}
              className="group-hover:text-white transition-colors"
            />
          </span>
          Dashboard
        </Link>
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold mb-3"
            style={{
              background: "#F0FDF4",
              border: "1px solid #BBF7D0",
              color: "#15803D",
            }}
          >
            <User style={{ width: 13, height: 13 }} />
            Customer Account
          </span>
          <h1
            className="font-bold mb-2"
            style={{
              fontSize: "clamp(28px,5vw,40px)",
              background: "linear-gradient(135deg,#15803D,#059669)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Customer Profile
          </h1>
          <p style={{ color: "#6B7280", fontSize: 15 }}>
            Complete your profile to get started
          </p>
        </div>

        {/* Main Card */}
        <form onSubmit={handleSubmit}>
          <div
            className="main-card bg-white rounded-3xl overflow-hidden"
            style={{
              boxShadow:
                "0 8px 48px rgba(22,163,74,0.10), 0 2px 8px rgba(0,0,0,0.05)",
              border: "1px solid rgba(187,247,208,0.7)",
            }}
          >
            {/* Top shimmer bar */}
            <div
              className="h-1.5"
              style={{
                background:
                  "linear-gradient(90deg,#16A34A,#10B981,#22C55E,#10B981,#16A34A)",
                backgroundSize: "200% 100%",
                animation: "shimBar 3s linear infinite",
              }}
            />

            <div className="p-8 space-y-7">
              {/* Profile Photo */}
              <div
                className="flex flex-col items-center pb-6"
                style={{ borderBottom: "1px solid #F0FDF4" }}
              >
                <div className="relative group mb-3">
                  {/* Outer ring */}
                  <div
                    className="absolute -inset-1.5 rounded-full"
                    style={{
                      background: "linear-gradient(135deg,#22C55E,#10B981)",
                      opacity: 0.25,
                      animation: "avatarRing 3s ease-in-out infinite",
                    }}
                  />
                  <div
                    className="relative w-32 h-32 rounded-full overflow-hidden flex items-center justify-center"
                    style={{
                      border: "3px solid #22C55E",
                      boxShadow: "0 4px 20px rgba(34,197,94,0.25)",
                      background: "linear-gradient(135deg,#DCFCE7,#BBF7D0)",
                    }}
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User
                        style={{ width: 52, height: 52, color: "#16A34A" }}
                      />
                    )}
                  </div>

                  {/* Camera button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="camera-btn absolute bottom-0.5 right-0.5 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{
                      background: "linear-gradient(135deg,#16A34A,#10B981)",
                      boxShadow: "0 3px 12px rgba(22,163,74,0.40)",
                    }}
                  >
                    <Camera style={{ width: 18, height: 18, color: "#fff" }} />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <p style={{ fontSize: 12, color: "#9CA3AF" }}>
                  Click camera icon to upload photo
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label style={labelStyle}>
                  <User style={{ width: 14, height: 14, color: "#16A34A" }} />{" "}
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  {...inp("name")}
                />
              </div>

              {/* DOB & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>
                    <Calendar
                      style={{ width: 14, height: 14, color: "#16A34A" }}
                    />{" "}
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="Date-of-birth"
                    required
                    {...inp("dob")}
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle }}>Gender</label>
                  <select
                    name="Gender"
                    {...inp("gender")}
                    style={{ ...inp("gender").style, cursor: "pointer" }}
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
                  <label style={labelStyle}>
                    <Phone
                      style={{ width: 14, height: 14, color: "#16A34A" }}
                    />{" "}
                    Phone Number 1
                  </label>
                  <input
                    type="tel"
                    name="phone-no-1"
                    required
                    placeholder="12345-67890"
                    pattern="[0-9]{5}-[0-9]{5}"
                    {...inp("phone1")}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    <Phone
                      style={{ width: 14, height: 14, color: "#16A34A" }}
                    />{" "}
                    Phone Number 2
                    <span
                      style={{
                        fontSize: 11,
                        color: "#9CA3AF",
                        fontWeight: 400,
                      }}
                    >
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="tel"
                    name="phone-no-2"
                    placeholder="12345-67890"
                    pattern="[0-9]{5}-[0-9]{5}"
                    {...inp("phone2")}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label style={labelStyle}>
                  <MapPin style={{ width: 14, height: 14, color: "#16A34A" }} />{" "}
                  Current Address
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="Enter your full address"
                  {...inp("address")}
                />
              </div>

              {/* State / City / Pincode */}
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
                ].map((f) => (
                  <div key={f.name}>
                    <label style={labelStyle}>{f.label}</label>
                    <input
                      type={f.type || "text"}
                      name={f.name}
                      required
                      placeholder={f.placeholder}
                      {...inp(f.name)}
                    />
                  </div>
                ))}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className="save-btn w-full py-4 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  background: saving
                    ? "linear-gradient(135deg,#86EFAC,#6EE7B7)"
                    : "linear-gradient(135deg,#16A34A,#10B981)",
                  boxShadow: saving
                    ? "none"
                    : "0 4px 16px rgba(22,163,74,0.32)",
                  fontSize: 15,
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving ? (
                  <>
                    <span className="saving-spinner w-5 h-5 rounded-full border-2 border-white/40 border-t-white" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save style={{ width: 18, height: 18 }} />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <p
          className="text-center mt-6"
          style={{ fontSize: 12, color: "#9CA3AF" }}
        >
          © 2025 Try-on. Your data is encrypted and secure.
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .cp-root * { font-family: 'Plus Jakarta Sans', sans-serif; }

        .blob {
          position:absolute; border-radius:50%;
          filter:blur(80px); pointer-events:none;
          animation:cpBlob 10s ease-in-out infinite;
        }
        .blob-1 { top:-60px; left:-60px; width:380px; height:380px;
          background:radial-gradient(circle,rgba(74,222,128,0.16),transparent 70%);
          animation-duration:11s; }
        .blob-2 { bottom:-80px; right:-60px; width:420px; height:420px;
          background:radial-gradient(circle,rgba(16,185,129,0.13),transparent 70%);
          animation-duration:13s; animation-delay:-4s; }
        @keyframes cpBlob { 0%,100%{transform:translate(0,0)scale(1)} 50%{transform:translate(14px,-14px)scale(1.04)} }

        .main-card { animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes cardIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

        .back-btn { animation: fadeIn 0.3s ease both; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        @keyframes shimBar { 0%{background-position:100% 0} 100%{background-position:-100% 0} }

        @keyframes avatarRing {
          0%,100%{opacity:0.25;transform:scale(1)}
          50%{opacity:0.45;transform:scale(1.06)}
        }

        .camera-btn:hover { transform:scale(1.12); box-shadow:0 6px 18px rgba(22,163,74,0.50) !important; }
        .camera-btn:active { transform:scale(0.96); }

        .save-btn:hover:not(:disabled) {
          transform:translateY(-2px);
          filter:brightness(1.07);
          box-shadow:0 8px 24px rgba(22,163,74,0.38) !important;
        }
        .save-btn:active:not(:disabled) { transform:scale(0.99); }

        @keyframes spin { to{transform:rotate(360deg)} }
        .saving-spinner { animation:spin 0.8s linear infinite; }
      `}</style>
    </div>
  );
};

export default CustomerProfile;
