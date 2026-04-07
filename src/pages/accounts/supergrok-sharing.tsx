import { useEffect, useState } from "react";

export default function SuperGrokSharing() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const SUPABASE_URL = "https://ajtefnkjdzavwacgqkri.supabase.co";
  const API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdGVmbmtqZHphdndhY2dxa3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MzE2NjIsImV4cCI6MjA4NTIwNzY2Mn0.KjQDTGLPuaDsZM5dSipNYZcfr45CuRooFNSCRXDdGuY";

  // 🔒 CHECK LOGIN
  useEffect(() => {
    try {
      const session = localStorage.getItem("userSession");

      if (!session) {
        window.location.hash = "#/login";
        return;
      }

      const parsed = JSON.parse(session);

      if (!parsed || !parsed.email) {
        window.location.hash = "#/login";
      }
    } catch (e) {
      window.location.hash = "#/login";
    }
  }, []);

  // 🔥 FETCH DATA
  useEffect(() => {
    async function fetchAccounts() {
      try {
        const res = await fetch(
          SUPABASE_URL +
            "/rest/v1/accounts?product=eq.grok_premium&status=eq.active",
          {
            headers: {
              apikey: API_KEY,
              Authorization: "Bearer " + API_KEY,
            },
          }
        );

        const data = await res.json();

        if (data && Array.isArray(data)) {
          setAccounts(data);
        } else {
          setAccounts([]);
        }
      } catch (e) {
        console.error(e);
        setError("Gagal mengambil data akun");
      }

      setLoading(false);
    }

    fetchAccounts();
  }, []);

  const copy = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(label + " disalin");
  };

  // ❌ ERROR UI
  if (error) {
    return (
      <div className="text-white p-10 text-center">
        <h2 className="text-red-400 text-xl font-bold">ERROR</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans">
      
      {/* HERO */}
      <div className="text-center pt-24 pb-16 px-6">

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
          <span className="text-sm font-semibold">🚀 SuperGrok PRO</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 uppercase">
          AKSES EKSKLUSIF <br />
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            GROK AI PREMIUM
          </span>
        </h1>

        <p className="text-gray-400 max-w-xl mx-auto mb-8">
          Akses akun Grok Premium tanpa biaya mahal.
        </p>

      </div>

      {/* TABLE */}
      <div className="max-w-6xl mx-auto px-6">

        <div className="flex justify-between mb-4">
          <h2 className="font-bold">DAFTAR AKUN PREMIUM</h2>
          <span className="text-green-400">● ONLINE</span>
        </div>

        <div className="border border-yellow-500/20 rounded-2xl overflow-hidden">

          <table className="w-full">
            <thead className="bg-yellow-500/10">
              <tr>
                <th className="p-4">EMAIL</th>
                <th className="p-4">PASSWORD</th>
                <th className="p-4">EXPIRED</th>
                <th className="p-4 text-right">STATUS</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan="4" className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading && accounts.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-6 text-center">
                    Tidak ada akun
                  </td>
                </tr>
              )}

              {accounts.map((acc) => (
                <tr key={acc.id}>
                  <td className="p-4">{acc.email}</td>

                  <td className="p-4">
                    <span className="bg-yellow-500/20 px-2 py-1 rounded">
                      {acc.password}
                    </span>
                  </td>

                  <td className="p-4">{acc.expired_at}</td>

                  <td className="p-4 text-right">
                    <span className="bg-green-500 px-2 py-1 rounded">
                      AKTIF
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-red-400 text-sm">
          ⚠️ Dilarang mengubah password akun
        </div>

      </div>

    </div>
  );
}
