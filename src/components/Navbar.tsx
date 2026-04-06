import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, LogOut, User, Zap, ShieldCheck, Crown, Menu, X, Settings, Wrench, Users, BarChart3, KeyRound } from "lucide-react";
import { supabase } from "../services/supabaseClient";

const ADMIN_EMAILS = [
"wisnuhadi579@gmail.com"
];

const normalizeEmail = (email:string) => {
return email?.toLowerCase().trim();
};

export const Navbar = () => {

const navigate = useNavigate();
const location = useLocation();

const [isLoggedIn, setIsLoggedIn] = useState(false);
const [userEmail, setUserEmail] = useState("");
const [userRole, setUserRole] = useState("Gratis");

const [dropdownOpen, setDropdownOpen] = useState(false);
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

const [resetMessage, setResetMessage] = useState("");
const [resetLoading, setResetLoading] = useState(false);

/* ✅ FIX DROPDOWN */
const dropdownRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {

const handleClickOutside = (event: MouseEvent) => {
if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
setDropdownOpen(false);
}
};

document.addEventListener("mousedown", handleClickOutside);

return () => {
document.removeEventListener("mousedown", handleClickOutside);
};

}, []);

/* ✅ SESSION LOAD (ORIGINAL) */
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

/* 🔥 NEW: AUTO SYNC SESSION (TIDAK MENGUBAH YANG LAMA) */
useEffect(() => {

const syncSession = () => {

const session = localStorage.getItem("userSession");

if (!session) {
setIsLoggedIn(false);
return;
}

try {

const data = JSON.parse(session);

setIsLoggedIn(data.loggedIn);
setUserEmail(data.email);
setUserRole(data.member);

} catch (e) {
console.error("Session error", e);
}

};

window.addEventListener("storage", syncSession);

/* initial */
syncSession();

return () => {
window.removeEventListener("storage", syncSession);
};

}, []);

const handleLogout = () => {
localStorage.removeItem("userSession");
setIsLoggedIn(false);
setDropdownOpen(false);
navigate("/");
};

const handleResetPassword = async () => {

setResetLoading(true);
setResetMessage("");

const user = await supabase.auth.getUser();

if (!user?.data?.user?.email) {
setResetMessage("Sesi tidak ditemukan.");
setResetLoading(false);
return;
}

const { error } = await supabase.auth.resetPasswordForEmail(
user.data.user.email,
{
redirectTo: `${window.location.origin}/reset-password`
}
);

if (!error) {
setResetMessage("Link reset password sudah dikirim.");
} else {
setResetMessage("Gagal mengirim email.");
}

setResetLoading(false);

};

const menuItems = [
{ name: "Landing Page", path: "/" },
{ name: "Dashboard", path: "/dashboard" },
{ name: "Tutorial", path: "/tutorial" },
{ name: "Pricing", path: "/pricing" }
];

const handleNavClick = (path: string) => {
if (path === "/dashboard" && !isLoggedIn) {
navigate("/login?mode=login");
return;
}
navigate(path);
};

/* 🔥 NEW: helper biar dropdown auto close */
const go = (path:string) => {
setDropdownOpen(false);
navigate(path);
};

const isAdmin = ADMIN_EMAILS
.map(e => normalizeEmail(e))
.includes(normalizeEmail(userEmail));

return (

<div className="sticky top-0 z-[100] backdrop-blur-md bg-black/70 border-b border-white/10">

<div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

{/* LEFT */}
<div onClick={() => navigate("/")} className="cursor-pointer relative inline-flex items-center">

  {/* Logo utama */}
  <div className="bg-gradient-to-b from-red-500 to-red-700 px-2 py-[2px] rectangle-sm">
    <span className="text-gray-100 font-black text-sm">
      Pakar Digital
    </span>
  </div>

  {/* Badge APP (nempel kanan atas) */}
  <span className="
    absolute
    -top-0.5
    -right-8
    text-[10px]
    text-yellow-400
    border border-yellow-400
    rounded
    px-1
    font-bold
    bg-black
  ">
    APP
  </span>

</div>

{/* MENU */}
<div className="hidden md:flex items-center gap-8">

{menuItems.map((item) => (
<div
key={item.path}
onClick={() => handleNavClick(item.path)}
className={`text-sm cursor-pointer ${
location.pathname === item.path
? "text-yellow-400"
: "text-zinc-400 hover:text-yellow-400"
}`}
>
{item.name}
</div>
))}

</div>

{/* RIGHT */}
<div className="relative flex items-center gap-3">

{isLoggedIn ? (
<button
onClick={() => setDropdownOpen(!dropdownOpen)}
className="bg-[#111] border border-white/10 px-4 py-2 rounded-xl hover:border-yellow-400 flex items-center gap-2 text-sm"
>
Akun Saya
<ChevronDown size={14}/>
</button>
) : (
<>
<button onClick={() => navigate("/login")} className="text-zinc-400">Login</button>
<button className="bg-yellow-400 text-black px-4 py-2 rounded-xl text-sm">Daftar</button>
</>
)}

{/* DROPDOWN */}
{dropdownOpen && (

<div ref={dropdownRef} className="absolute right-0 top-full mt-3 w-72 rounded-xl bg-zinc-900 border border-white/10 shadow-xl z-50 p-5">

<div className="space-y-4">

{/* USER */}
<div className="flex items-center gap-3 pb-3 border-b border-white/5">
<User size={20} className="text-yellow-400"/>
<div>
<p className="text-xs text-white">{userEmail}</p>
</div>
</div>

{/* ROLE */}
<div>

<p className="text-[10px] text-zinc-500 uppercase mb-1">Member Status</p>

<div className="flex items-center gap-2">

{userRole === "VIP" ? (
<Crown size={14} className="text-fuchsia-400"/>
) : userRole === "Premium" ? (
<Zap size={14} className="text-yellow-400"/>
) : (
<ShieldCheck size={14} className="text-zinc-400"/>
)}

<span className="text-sm font-bold text-yellow-400">{userRole}</span>

</div>

</div>

{/* ADMIN MENU */}
{isAdmin && (

<div className="pt-3 border-t border-white/5 space-y-2">

<button onClick={()=>go("/admin")} className="w-full flex items-center gap-2 text-sm text-yellow-400">
<Settings size={14}/> Admin Dashboard
</button>

<button onClick={()=>go("/admin/tools")} className="w-full flex items-center gap-2 text-sm text-yellow-400">
<Wrench size={14}/> Tools Manager
</button>

<button onClick={()=>go("/admin/licenses")} className="w-full flex items-center gap-2 text-sm text-yellow-400">
<KeyRound size={14}/> Licenses Manager
</button>

<button onClick={()=>go("/admin/users")} className="w-full flex items-center gap-2 text-sm text-yellow-400">
<Users size={14}/> Users Manager
</button>

<button onClick={()=>go("/admin/analytics")} className="w-full flex items-center gap-2 text-sm text-yellow-400">
<BarChart3 size={14}/> Analytics
</button>

<button onClick={()=>go("/admin/revenue")} className="w-full flex items-center gap-2 text-sm text-yellow-400">
<BarChart3 size={14}/> Revenue
</button>

</div>

)}

{/* ACTION */}
<div className="pt-2 space-y-2">

<button
onClick={handleResetPassword}
className="text-zinc-400 hover:text-amber-500 text-sm"
>
{resetLoading ? "Mengirim..." : "Reset Password"}
</button>

{resetMessage && (
<div className="text-xs text-emerald-400">{resetMessage}</div>
)}

<button
onClick={handleLogout}
className="w-full flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-red-400 pt-2 border-t border-white/5"
>

<LogOut size={14}/> Logout

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