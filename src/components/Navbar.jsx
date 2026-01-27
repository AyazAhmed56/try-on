import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, UserCircle, LogOut } from "lucide-react";
import { supabase } from "../services/supabase";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 👤 FETCH AVATAR
  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("avatar_url, role")
      .eq("id", userId)
      .single();

    if (data?.avatar_url) setAvatar(data.avatar_url);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // 🔐 AUTH STATE
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
      if (data?.user) fetchProfile(data.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) fetchProfile(session.user.id);
      else setAvatar(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleProfileNavigate = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !data) {
      alert("Profile not found");
      return;
    }

    if (data.role === "customer") {
      navigate("/customer/profile");
    } else if (data.role === "seller") {
      navigate("/seller/profile");
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/tryon-info", label: "Try-on Info" },
  ];

  return (
    <nav
      className={` top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-lg py-3"
          : "bg-white/95 backdrop-blur-sm py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/tryon-logo-horizontal-styled.svg"
              alt="Logo"
              className="w-52 h-16 object-cover rounded-xl"
            />
          </Link>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-purple-50 hover:text-purple-600 transition"
              >
                {link.label}
              </Link>
            ))}

            {/* 🔐 AUTH SECTION */}
            {/* AUTH SECTION */}
            {!user ? (
              <Link to="/login" className="ml-4">
                <button className="px-6 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition">
                  Login
                </button>
              </Link>
            ) : (
              <div className="ml-4 flex items-center gap-3">
                {/* Profile Button */}
                <button
                  onClick={handleProfileNavigate}
                  className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-purple-50 hover:text-purple-600 transition"
                >
                  Profile
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-600 font-medium rounded-lg hover:bg-red-50 transition"
                >
                  Logout
                </button>

                {/* Avatar */}
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
                  />
                ) : (
                  <UserCircle className="w-10 h-10 text-purple-600" />
                )}
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`md:hidden transition-all ${
            isMobileMenuOpen ? "max-h-96 mt-4" : "max-h-0 overflow-hidden"
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3"
            >
              {link.label}
            </Link>
          ))}

          {!user ? (
            <Link to="/login">
              <button className="w-full mt-2 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg">
                Login
              </button>
            </Link>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={() => navigate("/profile")}
                className="w-full py-3 rounded-lg border text-gray-700"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-lg border text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
