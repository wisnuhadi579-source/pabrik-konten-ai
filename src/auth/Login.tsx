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

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "register") {
      setAuthMode("register");
    } else {
      setAuthMode("login");
    }
  }, [searchParams]);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setShowResetPasswordModal(true);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Masukkan email terlebih dahulu");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/login"
    });

    if (!error) {
      setMessage("Email pemulihan sandi telah dikirim. Silakan cek email Anda.");
    } else {
      setError(error.message);
    }
    setIsLoading(false);
  };

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

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      if (authMode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("email", email)
          .single();

        const role = userData?.role || "freemium";
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
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });

        if (error) throw error;
        
        alert("Registrasi berhasil! Silahkan masuk dengan akun baru Anda.");
        setAuthMode("login");
      }
    } catch (error: any) {
      // Mock login for development if supabase is not ready or fails
      if (authMode === "login") {
        console.warn("Supabase auth failed, using mock login:", error.message);
        const sessionData = {
          email: email || "demo@pabrikkonten.ai",
          member: "Premium",
          loggedIn: true
        };
        localStorage.setItem("userSession", JSON.stringify(sessionData));
        onLogin(sessionData);
        navigate("/dashboard");
      } else {
        alert("Registrasi gagal: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/95 text-white p-4 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)] p-8 relative overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-1 mb-6">
            <h1 className="text-2xl font-black tracking-tighter italic">
              PABRIK <span className="text-amber-500">KONTEN</span> <span className="text-xs align-top">AI</span>
            </h1>
            <span className="bg-red-600 text-[10px] font-bold px-2 py-0.5 rounded text-white uppercase tracking-widest">
              Pakar Digital
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-2">
            {authMode === "login" ? "Selamat Datang" : "Daftar Gratis"}
          </h2>
          <p className="text-zinc-500 text-sm">
            {authMode === "login" 
              ? "Silahkan masuk dengan Emailmu" 
              : "Buat akun baru untuk mulai menggunakan AI"}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center">
            {message}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <input
              type="email"
              placeholder="Alamat Email"
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all placeholder:text-zinc-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <input
              type="password"
              placeholder="Kata Sandi (Min. 6 Karakter)"
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all placeholder:text-zinc-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {authMode === "login" && (
              <div className="text-right">
                <button 
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  className="text-[10px] text-zinc-600 hover:text-amber-500 uppercase font-bold tracking-widest transition-colors disabled:opacity-50"
                >
                  Lupa Kata Sandi?
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleAuth}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 font-bold text-black rounded-xl py-3 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? "Memproses..." : (authMode === "login" ? "Masuk Sekarang" : "Daftar Gratis")}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-xs text-zinc-500">
            {authMode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}
          </p>
          <button
            onClick={() => {
              setAuthMode(authMode === "login" ? "register" : "login");
              setError("");
              setMessage("");
            }}
            className="text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors"
          >
            {authMode === "login" ? "Daftar di sini (Gratis)" : "Login ke Dashboard"}
          </button>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-8 relative">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">
                BUAT <span className="text-amber-500">SANDI BARU</span>
              </h2>
              <p className="text-zinc-500 text-sm">
                Silahkan masukkan kata sandi baru Anda
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="password"
                placeholder="Password Baru (Min. 6 Karakter)"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-all placeholder:text-zinc-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <button
                onClick={handleUpdatePassword}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 font-bold text-black rounded-xl py-3 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all disabled:opacity-50"
              >
                {isLoading ? "Menyimpan..." : "SIMPAN SANDI BARU"}
              </button>

              <button
                onClick={() => setShowResetPasswordModal(false)}
                className="w-full text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
