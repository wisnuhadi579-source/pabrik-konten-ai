import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

function Login({ onLogin }: any) {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
           🔥 DETERMINE PLAN (UPGRADED)
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
           🔥 UPDATE USERS TABLE (INI INTI STEP 3)
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
    <div className="flex items-center justify-center min-h-screen bg-black text-white">

      <div className="w-full max-w-md p-6 bg-zinc-900 rounded-lg">

        <h2 className="text-2xl font-bold mb-4 text-center">
          {authMode === "login" ? "Login" : "Register"}
        </h2>

        {error && (
          <div className="bg-red-500 p-2 mb-3 rounded text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 bg-zinc-800 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 bg-zinc-800 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleAuth}
          disabled={isLoading}
          className="w-full p-2 bg-yellow-500 text-black font-bold rounded"
        >
          {isLoading
            ? "Loading..."
            : authMode === "login"
            ? "Login"
            : "Register"}
        </button>

        <p className="text-sm mt-4 text-center">
          {authMode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
          <span
            className="text-yellow-400 cursor-pointer"
            onClick={() =>
              setAuthMode(authMode === "login" ? "register" : "login")
            }
          >
            {authMode === "login" ? "Daftar" : "Login"}
          </span>
        </p>

      </div>

    </div>
  );
}

export default Login;
