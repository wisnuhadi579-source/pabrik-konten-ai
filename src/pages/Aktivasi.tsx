import { useEffect, useState } from "react";
import { CheckCircle, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Aktivasi() {
  const navigate = useNavigate();

  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  const [progress, setProgress] = useState(10);

  useEffect(() => {
    let interval: any;

    // Progress animation
    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 5;
      });
    }, 3000);

    // Jalankan sync-sheet
    const runActivation = async () => {
      try {
        await fetch("/sync-sheet");

        setProgress(100);

        setTimeout(() => {
          setStatus("success");
        }, 1000);
      } catch (err) {
        setStatus("error");
      }
    };

    // Delay agar spreadsheet sempat update
    setTimeout(() => {
      runActivation();
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-5 relative overflow-hidden">

      {/* Glow Background */}
      <div className="absolute w-[400px] h-[400px] bg-yellow-500/20 blur-[120px] rounded-full top-[-100px]"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-yellow-500/20 bg-[#0a0a0a] p-7 shadow-[0_0_80px_rgba(255,180,0,0.15)]">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-red-600 to-red-500 px-5 py-2 rounded-lg font-bold text-white text-xl shadow-lg">
            Pakar Digital
          </div>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          {status === "loading" && (
            <div className="relative">
              <Loader2 className="w-14 h-14 text-yellow-400 animate-spin" />
              <Sparkles className="w-5 h-5 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
          )}

          {status === "success" && (
            <CheckCircle className="w-16 h-16 text-green-400" />
          )}
        </div>

        {/* Title */}
        <h1 className="text-white text-3xl font-black text-center leading-tight">
          {status === "loading" && "Mengaktifkan Paket Premium"}
          {status === "success" && "Paket Berhasil Aktif"}
          {status === "error" && "Aktivasi Gagal"}
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-center mt-4 leading-relaxed">
          {status === "loading" &&
            "Mohon tunggu sekitar 1 menit. Sistem sedang menghubungkan pembelian kamu ke akun Pakar Digital App."}

          {status === "success" &&
            "Sekarang kamu bisa login atau daftar menggunakan email pembelian untuk menikmati akses premium."}

          {status === "error" &&
            "Terjadi kesalahan saat aktivasi paket. Silakan coba lagi beberapa saat."}
        </p>

        {/* Progress */}
        {status === "loading" && (
          <div className="mt-8">

            <div className="w-full h-3 bg-[#141414] rounded-full overflow-hidden border border-yellow-500/10">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-700"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="text-center text-yellow-400 text-sm mt-3 font-medium">
              {progress}% Memproses Aktivasi...
            </div>

          </div>
        )}

        {/* Buttons */}
        {status === "success" && (
          <div className="mt-8 space-y-3">

            <button
              onClick={() => navigate("/login")}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg shadow-[0_0_30px_rgba(255,180,0,0.35)] hover:scale-[1.02] transition-all"
            >
              MASUK KE DASHBOARD
            </button>

            <button
              onClick={() => navigate("/daftar")}
              className="w-full h-14 rounded-2xl border border-yellow-500/20 text-white font-semibold hover:bg-white/5 transition-all"
            >
              DAFTAR AKUN BARU
            </button>

          </div>
        )}

        {/* Error Button */}
        {status === "error" && (
          <div className="mt-8">

            <button
              onClick={() => window.location.reload()}
              className="w-full h-14 rounded-2xl bg-red-500 text-white font-bold"
            >
              COBA LAGI
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
