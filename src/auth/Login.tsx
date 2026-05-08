import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, X } from "lucide-react";
import { supabase } from "../services/supabaseClient";

function Login({ onLogin }: any) {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* =========================
     SHOW / HIDE PASSWORD
  ========================= */

  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async () => {

    setIsLoading(true);
    setError("");

    try {

      if (authMode === "login") {

        /* =========================
           LOGIN
        ========================= */

        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (loginError) throw loginError;

        /* =========================
           GET USER
        ========================= */

        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) throw userError;

        const user = userData?.user;

        if (!user) throw new Error("User tidak ditemukan");

        /* =========================
           AUTO LINK LICENSE
        ========================= */

        await supabase
          .from("licenses")
          .update({ user_id: user.id })
          .eq("email", user.email)
          .is("user_id", null);

        /* =========================
           GET LICENSES
        ========================= */

        const { data: licenses } = await supabase
          .from("licenses")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active");

        /* =========================
           DETERMINE PLAN
        ========================= */

        let memberStatus = "free";

        if (licenses && licenses.length > 0) {

          if (licenses.some((l: any) => l.plan === "vip")) {
            memberStatus = "vip";
          } else if (licenses.some((l: any) => l.plan === "premium")) {
            memberStatus = "premium";
          } else {
            memberStatus = "single";
          }
        }

        /* =========================
           UPDATE USERS TABLE
        ========================= */

        await supabase
          .from("users")
          .upsert({
            id: user.id,
            email: user.email,
            plan: memberStatus
          });

        /* =========================
           SAVE SESSION
        ========================= */

        const sessionData = {
          user_id: user.id,
          email: user.email,
          member: memberStatus,
          loggedIn: true
        };

        localStorage.setItem("userSession", JSON.stringify(sessionData));

        onLogin(sessionData);

        navigate("/dashboard");

      } else {

        /* =========================
           REGISTER
        ========================= */

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password
        });

        if (signUpError) {

          if (signUpError.message.includes("User already registered")) {
            throw new Error(
              "Akun sudah terdaftar. Silakan klik 'Lupa Kata Sandi'."
            );
          }

          throw signUpError;
        }

        /* =========================
           INSERT USER
        ========================= */

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

      console.error(error);
      setError(error.message || "Terjadi kesalahan");

    } finally {

      setIsLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      {/* CARD */}

      <div className="relative w-full max-w-sm rounded-3xl border border-zinc-800 bg-[#0f1017] p-7 shadow-[0_0_40px_rgba(255,180,0,0.08)]">

        {/* CLOSE BUTTON */}

        <button
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-all"
        >
          <X size={18} />
        </button>

        {/* LOGO */}

<div className="flex justify-center mb-6">

  <div className="relative inline-flex items-center">

    {/* Logo utama */}

    <div className="bg-gradient-to-b from-red-500 to-red-700 px-3 py-[4px] rounded-sm">

      <span className="text-gray-100 font-black text-lg">
        Pakar Digital
      </span>

    </div>

    {/* Badge APP */}

    <span
      className="
        absolute
        -top-1
        -right-9
        text-[10px]
        text-yellow-400
        border
        border-yellow-400
        rounded
        px-1
        font-bold
        bg-black
      "
    >
      APP
    </span>

  </div>

</div>

        {/* TITLE */}

        <h2 className="text-3xl font-bold text-white text-center mb-2">
          {authMode === "login" ? "Selamat Datang" : "Daftar Akun"}
        </h2>

        {/* SUBTITLE */}

        <p className="text-zinc-400 text-sm text-center mb-6">

          {authMode === "login"
            ? "Silahkan masuk dengan Emailmu"
            : "Buat akun gratis untuk mulai akses tools"}

        </p>

        {/* ERROR */}

        {error && (
          <div className="bg-red-500 text-white text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* EMAIL */}

        <input
          type="email"
          placeholder="Masukkan email"
          className="w-full bg-[#e9edf5] text-black rounded-xl px-4 py-3 mb-4 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}

        <div className="relative mb-3">

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password"
            className="w-full bg-[#e9edf5] text-black rounded-xl px-4 py-3 pr-12 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500"
          >

            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}

          </button>

        </div>

        {/* FORGOT PASSWORD */}

        {authMode === "login" && (

          <div className="text-right mb-5">

            <span
              className="text-[11px] text-yellow-400 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              LUPA KATA SANDI?
            </span>

          </div>

        )}

        {/* BUTTON */}

        <button
          onClick={handleAuth}
          disabled={isLoading}
          className="w-full rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 py-3 text-white font-bold shadow-lg hover:scale-[1.02] transition-all"
        >

          {isLoading
            ? "Loading..."
            : authMode === "login"
            ? "Masuk Sekarang"
            : "Daftar Sekarang"}

        </button>

        {/* FOOTER */}

        <div className="mt-6 text-center">

          {authMode === "login" ? (

            <>

              <p className="text-zinc-500 text-sm mb-2">
                Belum punya akun?
              </p>

              <span
                className="text-yellow-400 font-bold text-sm cursor-pointer hover:underline"
                onClick={() => setAuthMode("register")}
              >
                Daftar di sini (Gratis)
              </span>

            </>

          ) : (

            <>

              <p className="text-zinc-500 text-sm mb-2">
                Sudah punya akun?
              </p>

              <span
                className="text-yellow-400 font-bold text-sm cursor-pointer hover:underline"
                onClick={() => setAuthMode("login")}
              >
                LOGIN DISINI
              </span>

            </>

          )}

        </div>

      </div>

    </div>

  );
}

export default Login;
