import { useEffect, useState } from "react";

type Account = {
  id: string;
  email: string;
  password: string;
  expired_at: string;
  status: string;
};

const SUPABASE_URL = "https://ajtefnkjdzavwacgqkri.supabase.co";
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdGVmbmtqZHphdndhY2dxa3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MzE2NjIsImV4cCI6MjA4NTIwNzY2Mn0.KjQDTGLPuaDsZM5dSipNYZcfr45CuRooFNSCRXDdGuY";

export default function SuperGrokSharing() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔒 CEK LOGIN SAJA (FREE ACCESS)
  useEffect(() => {
    try {
      const session = localStorage.getItem("userSession");

      let email = null;

      if (session) {
        const data = JSON.parse(session);
        email = data?.email;
      }

      if (!email) {
        window.location.hash = "#/login";
      }
    } catch (err) {
      console.error("SESSION ERROR:", err);
      window.location.hash = "#/login";
    }
  }, []);

  // 🔥 FETCH ACCOUNT DARI SUPABASE
  useEffect(() => {
    async function fetchAccounts() {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/accounts?product=eq.grok_premium&status=eq.active`,
          {
            headers: {
              apikey: API_KEY,
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );

        const data = await res.json();

        console.log("ACCOUNTS:", data);

        if (!Array.isArray(data)) {
          throw new Error("Response bukan array");
        }

        setAccounts(data);
      } catch (err: any) {
        console.error("FETCH ERROR:", err);
        setError("Gagal mengambil data akun");
      }

      setLoading(false);
    }

    fetchAccounts();
  }, []);

  // 📋 COPY
  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(label + " disalin");
  };

  // ❌ ERROR UI
  if (error) {
    return (
      <div className="text-white p-10 text-center">
        <h2 className="text-red-400 text-xl font-bold mb-4">ERROR</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans">
      {/* NAVBAR */}
      <div className="sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-center items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-8 py-3">
          <div
            onClick={() => (window.location.hash = "#/")}
            className="cursor-pointer relative inline-flex items-center"
          >
            <div className="bg-gradient-to-b from-red-500 to-red-700 px-2 py-[2px] rounded-sm">
              <span className="text-gray-100 font-black text-sm uppercase">
                Pakar Digital
              </span>
            </div>
            <span className="absolute -top-0.5 -right-8 text-[10px] text-yellow-400 border border-yellow-400 rounded px-1 font-bold bg-black">
              APP
            </span>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div className="pt-16 pb-24 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 uppercase">
          AKSES EKSKLUSIF <br />
          <span className="text-amber-400">GROK AI PREMIUM</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Gunakan akun sharing untuk akses Grok Premium langsung.
        </p>
      </div>

      {/* TABLE */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4">Email</th>
                <th className="p-4">Password</th>
                <th className="p-4">Expired</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading && accounts.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-yellow-400">
                    Belum ada akun tersedia
                  </td>
                </tr>
              )}

              {accounts.map((acc) => (
                <tr key={acc.id} className="border-b border-white/5">
                  <td className="p-4 font-bold">
                    {acc.email}
                    <button
                      onClick={() => copy(acc.email, "Email")}
                      className="ml-2 text-xs text-gray-400"
                    >
                      copy
                    </button>
                  </td>

                  <td className="p-4">
                    <span className="bg-amber-400/10 px-3 py-1 rounded-lg font-mono">
                      {acc.password}
                    </span>
                    <button
                      onClick={() => copy(acc.password, "Password")}
                      className="ml-2 text-xs text-gray-400"
                    >
                      copy
                    </button>
                  </td>

                  <td className="p-4 text-sm text-gray-400">
                    {acc.expired_at || "-"}
                  </td>

                  <td className="p-4 text-right">
                    <span className="bg-green-600 px-3 py-1 rounded-full text-xs font-bold">
                      AKTIF
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* WARNING */}
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm font-bold">
          ⚠️ Dilarang mengubah password akun. Pelanggaran akan diblacklist.
        </div>
      </div>
    </div>
  );
}
