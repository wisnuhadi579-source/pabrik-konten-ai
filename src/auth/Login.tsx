import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import { supabase } from "../services/supabaseClient";

export default function Login({ onLogin }: any) {

const navigate = useNavigate();
const [searchParams] = useSearchParams();

const [authMode, setAuthMode] = useState<"login" | "register">("login");

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [newPassword, setNewPassword] = useState("");

const [isLoading, setIsLoading] = useState(false);

const [message, setMessage] = useState("");
const [error, setError] = useState("");

const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

/* =========================
DETECT LOGIN / REGISTER
========================= */

useEffect(() => {

const mode = searchParams.get("mode");

if (mode === "register") {
setAuthMode("register");
} else {
setAuthMode("login");
}

}, [searchParams]);

/* =========================
DETECT PASSWORD RECOVERY
========================= */

useEffect(() => {

const { data: listener } = supabase.auth.onAuthStateChange(
async (event) => {

if (event === "PASSWORD_RECOVERY") {
setShowResetPasswordModal(true);
}

}
);

return () => {
listener.subscription.unsubscribe();
};

}, []);

/* =========================
FORGOT PASSWORD
========================= */

const handleForgotPassword = async () => {

if (!email) {
setError("Masukkan email terlebih dahulu");
return;
}

setIsLoading(true);
setError("");
setMessage("");

const { error } = await supabase.auth.resetPasswordForEmail(email, {

redirectTo: `${window.location.origin}/reset-password`

});

if (!error) {

setMessage("Email pemulihan sandi telah dikirim. Silakan cek email Anda.");

} else {

setError(error.message);

}

setIsLoading(false);

};

/* =========================
UPDATE PASSWORD
========================= */

const handleUpdatePassword = async () => {

if (!newPassword || newPassword.length < 6) {
setError("Password minimal 6 karakter");
return;
}

setIsLoading(true);
setError("");
setMessage("");

const { error } = await supabase.auth.updateUser({

password: newPassword

});

if (!error) {

setMessage("Password berhasil diperbarui. Silahkan login kembali.");

setShowResetPasswordModal(false);

setAuthMode("login");

} else {

setError(error.message);

}

setIsLoading(false);

};

/* =========================
LOGIN / REGISTER
========================= */

const handleAuth = async () => {

setIsLoading(true);
setError("");

try {

if (authMode === "login") {

const { error } = await supabase.auth.signInWithPassword({

email,
password

});

if (error) throw error;

const { data: userData } = await supabase
.from("users")
.select("plan")
.eq("email", email)
.single();

const role = userData?.plan || "free";

let memberStatus = "Gratis";

if (role === "premium") memberStatus = "Premium";
if (role === "vip") memberStatus = "VIP";

const sessionData = {

email: email,
member: memberStatus,
loggedIn: true

};

localStorage.setItem("userSession", JSON.stringify(sessionData));

onLogin(sessionData);

navigate("/dashboard");

} else {

/* REGISTER USER */

const { error } = await supabase.auth.signUp({

email,
password

});

if (error) {

if(error.message.includes("User already registered")){

throw new Error(
"Akun sudah terdaftar. Silakan klik 'Lupa Kata Sandi' untuk membuat password."
)

}

throw error;

}

/* SIMPAN USER KE DATABASE */

await supabase
.from("users")
.upsert({

email: email,
plan: "free"

}, { onConflict: "email" });

alert("Registrasi berhasil! Silahkan login.");

setAuthMode("login");

}

} catch (error: any) {

setError(error.message);

} finally {

setIsLoading(false);

}

};

/* =========================
UI
========================= */

return (

<div className="min-h-screen flex items-center justify-center bg-black/95 text-white p-4">

<div className="w-full max-w-md bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-2xl p-8 relative">

<button
onClick={() => navigate("/")}
className="absolute top-4 right-4 text-zinc-500 hover:text-white"

>

<X size={24} />
</button>

<div className="text-center mb-8">

<div className="flex flex-col items-center leading-none select-none">

<div className="flex items-start gap-2 font-black tracking-tight">

<span className="text-white text-2xl">
PABRIK
</span>

<span className="text-yellow-400 text-2xl">
KONTEN
</span>

<span className="relative -top-2 text-yellow-400 text-xs border border-yellow-400 rounded-md px-1 py-[1px]">
AI
<span className="absolute -top-1 -right-1 text-yellow-400 text-[8px]">✦</span>
</span>

</div>

<div className="bg-red-600 text-white text-xs font-bold px-3 py-[2px] mt-1 rounded">
Pakar Digital
</div>

</div>

<h2 className="text-2xl font-bold mt-8">

{authMode === "login" ? "Selamat Datang" : "Daftar Gratis"}

</h2>

<p className="text-zinc-500 text-sm">

{authMode === "login"
? "Silahkan masuk dengan Emailmu"
: "Buat akun baru untuk mulai menggunakan AI"}

</p>

</div>

{error && (

<div className="mb-6 text-red-400 text-xs text-center">
{error}
</div>
)}

{message && (

<div className="mb-6 text-green-400 text-xs text-center">
{message}
</div>
)}

<div className="space-y-4">

<input
type="email"
placeholder="Alamat Email"
className="w-full bg-black border border-white/10 rounded-xl px-4 py-3"
value={email}
onChange={(e) => setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Kata Sandi (Min 6 karakter)"
className="w-full bg-black border border-white/10 rounded-xl px-4 py-3"
value={password}
onChange={(e) => setPassword(e.target.value)}
/>

{authMode === "login" && (

<div className="text-right">

<button
onClick={handleForgotPassword}
className="text-xs text-amber-500 font-bold"

>

Lupa Kata Sandi?

</button>

</div>

)}

<button
onClick={handleAuth}
disabled={isLoading}
className="w-full bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-black rounded-xl py-3"

>

{isLoading ? "Memproses..." : authMode === "login"
? "Masuk Sekarang"
: "Daftar Gratis"}

</button>

</div>

<div className="text-center mt-8">

<button
onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
className="text-amber-500 font-bold"

>

{authMode === "login"
? "Daftar di sini (Gratis)"
: "Login ke Dashboard"}

</button>

</div>

</div>

{showResetPasswordModal && (

<div className="fixed inset-0 flex items-center justify-center bg-black/90">

<div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-8">

<h2 className="text-2xl font-black text-center mb-6">

BUAT <span className="text-amber-500">SANDI BARU</span>

</h2>

<input
type="password"
placeholder="Password Baru"
className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 mb-4"
value={newPassword}
onChange={(e) => setNewPassword(e.target.value)}
/>

<button
onClick={handleUpdatePassword}
className="w-full bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-black rounded-xl py-3"

>

SIMPAN SANDI BARU

</button>

</div>

</div>

)}

</div>

);
}
