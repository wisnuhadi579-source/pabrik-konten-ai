import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, LogOut, User, Zap, ShieldCheck, Crown, Menu, X, Settings, Wrench } from "lucide-react";
import { supabase } from "../services/supabaseClient";

/* ADMIN EMAIL LIST */

const ADMIN_EMAILS = [
"wisnuhadi579@gmail.com"
];

/* NORMALIZE EMAIL */

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

/* SESSION LOAD */

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

/* LOGOUT */

const handleLogout = () => {

localStorage.removeItem("userSession");
setIsLoggedIn(false);
setDropdownOpen(false);
navigate("/");

};

/* RESET PASSWORD */

const handleResetPassword = async () => {

setResetLoading(true);
setResetMessage("");

const user = await supabase.auth.getUser();

if (!user?.data?.user?.email) {

setResetMessage("Sesi tidak ditemukan. Silakan login kembali.");
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

setResetMessage("Link reset password sudah dikirim. Silakan cek inbox email Anda.");

} else {

setResetMessage("Gagal mengirim email reset password.");

}

setResetLoading(false);

};

/* NAV MENU */

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

/* ADMIN DETECTION */

const isAdmin = ADMIN_EMAILS
.map(e => normalizeEmail(e))
.includes(normalizeEmail(userEmail));

return (

<div className="sticky top-0 z-[100] backdrop-blur-md bg-black/70 border-b border-white/10">

{mobileMenuOpen && (

<div
className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
onClick={() => setMobileMenuOpen(false)}
/>

)}

{/* MOBILE DRAWER */}

<div className={`fixed top-0 left-0 h-full w-72 bg-zinc-900 border-r border-white/10 shadow-xl z-[120] transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>

<div className="p-6">

<div className="flex items-center justify-between mb-8">

<div className="flex flex-col items-center leading-none select-none">

<div className="flex items-start gap-2 font-black tracking-tight">

<span className="text-white text-lg">PABRIK</span>
<span className="text-yellow-400 text-lg">KONTEN</span>

<span className="relative -top-2 text-yellow-400 text-xs border border-yellow-400 rounded-md px-1 py-[1px]">
AI
<span className="absolute -top-1 -right-1 text-yellow-400 text-[8px]">✦</span>
</span>

</div>

<div className="bg-red-600 text-white text-xs font-bold px-3 py-[2px] mt-1 rounded">
Pakar Digital
</div>

</div>

<button
onClick={() => setMobileMenuOpen(false)}
className="text-zinc-500 hover:text-white transition"
>
<X size={20}/>
</button>

</div>

<div className="h-[1px] bg-white/5 mb-8"/>

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

</div>

</div>

</div>

{/* HEADER */}

<div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

{/* LEFT */}

<div className="flex items-center gap-4">

<button
onClick={() => setMobileMenuOpen(true)}
className="flex md:hidden text-zinc-400 hover:text-white transition"
>
<Menu size={22}/>
</button>

<div
onClick={() => navigate("/")}
className="cursor-pointer flex flex-col items-center leading-none select-none"
>

<div className="flex items-start gap-2 font-black tracking-tight">

<span className="text-white text-lg md:text-xl">PABRIK</span>
<span className="text-yellow-400 text-lg md:text-xl">KONTEN</span>

<span className="relative -top-2 text-yellow-400 text-xs border border-yellow-400 rounded-md px-1 py-[1px]">
AI
<span className="absolute -top-1 -right-1 text-yellow-400 text-[8px]">✦</span>
</span>

</div>

<div className="bg-red-600 text-white text-xs font-bold px-3 py-[2px] mt-1 rounded">
Pakar Digital
</div>

</div>

</div>

{/* MENU DESKTOP */}

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

{/* RIGHT */}

<div className="relative flex items-center gap-3">

{isLoggedIn ? (

<button
onClick={() => setDropdownOpen(!dropdownOpen)}
className="bg-[#111] border border-white/10 px-4 py-2 rounded-xl hover:border-yellow-400 transition text-sm flex items-center gap-2"
>

Akun Saya
<ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}/>

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
className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold px-4 py-2 rounded-xl text-sm transition"
>
Daftar Gratis
</button>

</>

)}

{/* ACCOUNT DROPDOWN */}

{dropdownOpen && (

<div className="absolute right-0 top-full mt-3 w-72 rounded-xl bg-zinc-900 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-50 p-5">

<div className="space-y-4">

<div className="flex items-center gap-3 pb-3 border-b border-white/5">

<div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
<User size={20} className="text-yellow-400"/>
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

<button
onClick={() => navigate("/admin")}
className="w-full flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300"
>

<Settings size={14}/> Admin Panel

</button>

<button
onClick={() => navigate("/admin/tools")}
className="w-full flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300"
>

<Wrench size={14}/> Tool Manager

</button>

</div>

)}

<div className="pt-2 space-y-2">

<button
onClick={handleResetPassword}
className="w-full text-left text-zinc-400 hover:text-amber-500 text-sm transition-colors py-1"
>

{resetLoading ? "Mengirim..." : "Reset Password"}

</button>

{resetMessage && (

<div className="text-xs text-emerald-400">
{resetMessage}
</div>

)}

<button
onClick={handleLogout}
className="w-full flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-red-400 transition pt-2 border-t border-white/5"
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
