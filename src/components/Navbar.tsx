import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, LogOut, User, Zap, ShieldCheck, Crown, Menu, X } from "lucide-react";
import { supabase } from "../services/supabaseClient";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("Gratis");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("userSession");
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        if (sessionData && sessionData.loggedIn) {
          setIsLoggedIn(true);
          setUserRole(sessionData.member);
          setUserEmail(sessionData.email);
        }
      } catch (e) {
        console.error("Failed to parse session", e);
      }
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate("/");
  };

  const handleResetPassword = async () => {
    const user = await supabase.auth.getUser();

    if (!user?.data?.user?.email) {
      alert("Sesi tidak ditemukan. Silahkan login kembali.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(
      user.data.user.email,
      {
        redirectTo: `${window.location.origin}/login`
      }
    );

    if (!error) {
      alert("Email reset password telah dikirim. Silakan cek inbox Anda.");
      setDropdownOpen(false);
    } else {
      alert("Gagal mengirim email reset: " + error.message);
    }
  };

  const menuItems = [
    { name: "Landing Page", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Tutorial", path: "/tutorial" },
    { name: "Pricing", path: "/pricing" },
  ];

  const handleNavClick = (path: string) => {
    if (path === "/dashboard" && !isLoggedIn) {
      navigate("/login?mode=login");
      return;
    }
    navigate(path);
  };

  return (
    <div className="sticky top-0 z-[100] backdrop-blur-md bg-black/70 border-b border-white/10">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-zinc-900 border-r border-white/10 shadow-xl z-[120] transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="text-yellow-400 font-bold tracking-widest text-sm">
              PABRIK KONTEN AI
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-500 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="h-[1px] bg-white/5 mb-8" />

          <div className="space-y-6">
            {menuItems.map((item) => (
              <div
                key={item.path}
                onClick={() => {
                  handleNavClick(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`text-sm transition cursor-pointer ${
                  location.pathname === item.path
                    ? "text-yellow-400 font-medium"
                    : "text-zinc-400 hover:text-yellow-400"
                }`}
              >
                {item.name}
              </div>
            ))}

            <div className="h-[1px] bg-white/5 my-4" />

            {isLoggedIn ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <User size={16} className="text-yellow-400" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Email</p>
                    <p className="text-xs text-white truncate font-medium">{userEmail}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      handleResetPassword();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left text-sm text-zinc-400 hover:text-amber-500 transition"
                  >
                    Reset Password
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-sm text-zinc-500 hover:text-red-400 transition"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => {
                    navigate("/login?mode=login");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-zinc-400 hover:text-white transition text-sm font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/login?mode=register");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold px-4 py-3 rounded-xl text-sm transition text-center"
                >
                  Daftar Gratis
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Left: Hamburger & Logo */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="flex md:hidden text-zinc-400 hover:text-white transition"
          >
            <Menu size={22} />
          </button>
          
          <div 
            className="text-yellow-400 font-bold tracking-widest text-sm cursor-pointer"
            onClick={() => navigate("/")}
          >
            PABRIK KONTEN AI
          </div>
        </div>

        {/* Center: Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <div
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`text-sm transition cursor-pointer ${
                location.pathname === item.path
                  ? "text-yellow-400 font-medium"
                  : "text-zinc-400 hover:text-yellow-400"
              }`}
            >
              {item.name}
            </div>
          ))}
        </div>

        {/* Right: Login/Account */}
        <div className="relative flex items-center gap-3">
          {isLoggedIn ? (
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-[#111] border border-white/10 px-4 py-2 rounded-xl hover:border-yellow-400 transition text-sm flex items-center gap-2"
            >
              Akun Saya <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login?mode=login")}
                className="text-zinc-400 hover:text-white transition text-sm font-medium px-2"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/login?mode=register")}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold px-4 py-2 rounded-xl text-sm transition shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                Daftar Gratis
              </button>
            </>
          )}

          {/* Account Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-3 w-72 rounded-xl bg-zinc-900 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-50 p-5">
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <User size={20} className="text-yellow-400" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Email</p>
                    <p className="text-xs text-white truncate font-medium">{userEmail}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Member Status</p>
                  <div className="flex items-center gap-2">
                    {userRole === "VIP" ? (
                      <Crown size={14} className="text-fuchsia-400" />
                    ) : userRole === "Premium" ? (
                      <Zap size={14} className="text-yellow-400" />
                    ) : (
                      <ShieldCheck size={14} className="text-zinc-400" />
                    )}
                    <span className={`text-sm font-bold ${
                      userRole === "VIP" ? "text-fuchsia-400" : 
                      userRole === "Premium" ? "text-yellow-400" : "text-zinc-400"
                    }`}>
                      {userRole}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  {userRole === "Gratis" || userRole === "Freemium" ? (
                    <button 
                      onClick={() => navigate("/pricing")}
                      className="w-full bg-gradient-to-r from-yellow-400 to-amber-600 text-black text-[11px] font-bold py-2.5 rounded-lg hover:brightness-110 transition uppercase tracking-tighter"
                    >
                      Tingkatkan ke Premium
                    </button>
                  ) : userRole === "Premium" ? (
                    <button 
                      onClick={() => navigate("/pricing")}
                      className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-[11px] font-bold py-2.5 rounded-lg hover:brightness-110 transition uppercase tracking-tighter"
                    >
                      Tingkatkan ke VIP
                    </button>
                  ) : (
                    <div className="w-full bg-white/5 border border-fuchsia-500/30 text-fuchsia-400 text-[11px] font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 uppercase tracking-tighter">
                      VIP Member ✔
                    </div>
                  )}
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={handleResetPassword}
                    className="w-full text-left text-zinc-400 hover:text-amber-500 text-sm transition-colors py-1"
                  >
                    Reset Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-red-400 transition pt-2 border-t border-white/5"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
