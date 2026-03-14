import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, UserCircle, LogOut, ChevronDown } from "lucide-react";
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
    if (data.role === "customer") navigate("/customer/profile");
    else if (data.role === "seller") navigate("/seller/profile");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/tryon-info", label: "Try-on Info" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .navbar-root * { font-family: 'Plus Jakarta Sans', sans-serif; }

        /* Scrolled glow */
        .navbar-scrolled {
          background: rgba(255,255,255,0.97) !important;
          box-shadow: 0 2px 24px rgba(22,163,74,0.10), 0 1px 4px rgba(0,0,0,0.06) !important;
        }

        /* Nav link hover */
        .nav-link {
          position: relative;
          color: #374151;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 10px;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 4px; left: 50%; right: 50%;
          height: 2px;
          background: linear-gradient(90deg, #16A34A, #10B981);
          border-radius: 2px;
          transition: left 0.25s ease, right 0.25s ease;
        }
        .nav-link:hover {
          background: #F0FDF4;
          color: #15803D;
        }
        .nav-link:hover::after { left: 16px; right: 16px; }

        /* Login button */
        .login-btn {
          background: linear-gradient(135deg, #16A34A 0%, #10B981 100%);
          color: #fff;
          font-weight: 600;
          padding: 9px 24px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(22,163,74,0.30);
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .login-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #15803D 0%, #059669 100%);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .login-btn:hover::before { opacity: 1; }
        .login-btn:hover { box-shadow: 0 6px 20px rgba(22,163,74,0.40); transform: translateY(-1px); }
        .login-btn:active { transform: translateY(0); }
        .login-btn span { position: relative; z-index: 1; }

        /* Profile button */
        .profile-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          border-radius: 10px;
          color: #374151;
          font-weight: 500;
          cursor: pointer;
          background: transparent;
          border: none;
          transition: all 0.2s ease;
        }
        .profile-btn:hover { background: #F0FDF4; color: #15803D; }

        /* Logout button */
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 10px;
          color: #DC2626;
          font-weight: 500;
          cursor: pointer;
          background: transparent;
          border: none;
          transition: all 0.2s ease;
          font-size: 14px;
        }
        .logout-btn:hover { background: #FEF2F2; }

        /* Avatar ring */
        .avatar-ring {
          width: 38px; height: 38px;
          border-radius: 50%;
          border: 2px solid #22C55E;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.15);
          object-fit: cover;
          transition: box-shadow 0.2s;
        }
        .avatar-ring:hover { box-shadow: 0 0 0 4px rgba(34,197,94,0.25); }

        /* Separator */
        .nav-sep {
          width: 1px; height: 24px;
          background: #E5E7EB;
          margin: 0 4px;
        }

        /* Mobile menu */
        .mobile-menu {
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease;
        }
        .mobile-menu.open  { max-height: 480px; opacity: 1; }
        .mobile-menu.closed { max-height: 0;   opacity: 0; }

        .mobile-link {
          display: block;
          padding: 12px 16px;
          color: #374151;
          font-weight: 500;
          border-radius: 10px;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .mobile-link:hover { background: #F0FDF4; color: #15803D; }

        .mobile-login-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #16A34A, #10B981);
          color: #fff;
          font-weight: 600;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          margin-top: 8px;
          box-shadow: 0 4px 12px rgba(22,163,74,0.25);
          transition: opacity 0.2s;
        }
        .mobile-login-btn:hover { opacity: 0.92; }

        .mobile-action-btn {
          width: 100%;
          padding: 11px;
          border-radius: 10px;
          border: 1.5px solid #E5E7EB;
          font-weight: 500;
          cursor: pointer;
          background: #fff;
          transition: all 0.15s;
        }
        .mobile-action-btn.profile { color: #374151; }
        .mobile-action-btn.profile:hover { background: #F0FDF4; border-color: #BBF7D0; color: #15803D; }
        .mobile-action-btn.logout  { color: #DC2626; margin-top: 4px; }
        .mobile-action-btn.logout:hover  { background: #FEF2F2; border-color: #FECACA; }

        /* Logo area green dot indicator */
        .brand-dot {
          width: 7px; height: 7px;
          background: #22C55E;
          border-radius: 50%;
          box-shadow: 0 0 0 2px rgba(34,197,94,0.25);
          animation: blink 2.5s ease-in-out infinite;
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }

        /* Hamburger hover */
        .hamburger-btn {
          padding: 8px;
          border-radius: 10px;
          border: none;
          background: transparent;
          cursor: pointer;
          color: #374151;
          transition: background 0.15s, color 0.15s;
        }
        .hamburger-btn:hover { background: #F0FDF4; color: #16A34A; }
      `}</style>

      <nav
        className={`navbar-root fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-green-100/60 ${
          isScrolled ? "navbar-scrolled py-2" : "py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logo.jpg"
                alt="Logo"
                className="w-44 h-20 object-cover rounded-xl transition-opacity group-hover:opacity-90"
              />
              <span className="brand-dot hidden sm:block" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="nav-link">
                  {link.label}
                </Link>
              ))}

              <div className="nav-sep" />

              {!user ? (
                <Link to="/login" className="ml-2">
                  <button className="login-btn">
                    <span>Login</span>
                  </button>
                </Link>
              ) : (
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={handleProfileNavigate}
                    className="profile-btn"
                  >
                    Profile
                  </button>
                  <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={15} />
                    Logout
                  </button>
                  <div className="nav-sep" />
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="avatar-ring cursor-pointer"
                      onClick={handleProfileNavigate}
                    />
                  ) : (
                    <UserCircle
                      className="w-9 h-9 cursor-pointer transition-colors"
                      style={{ color: "#16A34A" }}
                      onClick={handleProfileNavigate}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="hamburger-btn md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`mobile-menu md:hidden ${isMobileMenuOpen ? "open" : "closed"}`}
          >
            <div className="pt-3 pb-4 space-y-1 border-t border-green-100 mt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="mobile-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {!user ? (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="mobile-login-btn">Login</button>
                </Link>
              ) : (
                <div className="flex flex-col gap-1 pt-1">
                  {avatar && (
                    <div className="flex items-center gap-3 px-2 py-2">
                      <img src={avatar} alt="Avatar" className="avatar-ring" />
                      <span
                        style={{
                          fontSize: 14,
                          color: "#374151",
                          fontWeight: 500,
                        }}
                      >
                        {user.email?.split("@")[0]}
                      </span>
                    </div>
                  )}
                  <button
                    className="mobile-action-btn profile"
                    onClick={() => {
                      handleProfileNavigate();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="mobile-action-btn logout"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
