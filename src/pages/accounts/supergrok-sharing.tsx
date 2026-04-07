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

  const cardStyle =
  "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl";

const glowStyle =
  "shadow-[0_0_40px_rgba(217,119,6,0.15)] border border-yellow-500/20";
  
return (
<div className="bg-[#050505] text-white min-h-screen">

  {/* HERO */}
  <div className="text-center pt-24 pb-16 px-6">

    <div className="inline-flex items-center gap-2 px-5 py-2 mb-6 bg-white/5 border border-white/10 rounded-full">
      🚀 <span className="font-bold">SuperGrok PRO</span>
    </div>

    <h1 className="text-5xl md:text-7xl font-extrabold uppercase">
      AKSES EKSKLUSIF <br />
      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
        GROK AI PREMIUM
      </span>
    </h1>

    <p className="text-gray-400 mt-6 max-w-xl mx-auto">
      Dapatkan kredensial instan tanpa biaya mahal.
    </p>

    <div className="flex justify-center gap-4 mt-8">
      <a href="#akun" className="px-6 py-3 bg-orange-500 rounded-xl font-bold">
        Lihat Daftar Akun
      </a>
      <button className="px-6 py-3 border border-white/20 rounded-xl">
        Hubungi Kami
      </button>
    </div>

  </div>

  {/* TABLE */}
  <div id="akun" className="max-w-6xl mx-auto px-6">

    <div className="flex justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold">DAFTAR AKUN PREMIUM</h2>
        <p className="text-gray-400 text-sm">
          Gunakan kredensial berikut
        </p>
      </div>

      <div className="flex items-center gap-2 text-green-400 text-sm">
        ● SISTEM ONLINE
      </div>
    </div>

    <div className={`${cardStyle} ${glowStyle} overflow-hidden`}>

      <table className="w-full">
        <thead className="bg-white/5 text-gray-300 text-sm">
          <tr>
            <th className="p-4 text-left">EMAIL AKUN</th>
            <th className="p-4">PASSWORD</th>
            <th className="p-4">MASA BERLAKU</th>
            <th className="p-4 text-right">STATUS</th>
          </tr>
        </thead>

        <tbody>

          {accounts.map((acc) => (
            <tr key={acc.id} className="border-t border-white/5">

              {/* EMAIL */}
              <td className="p-4">
                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    📧
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold">{acc.email}</span>
                    <button
                      onClick={() => copy(acc.email, "Email")}
                      className="text-gray-400 hover:text-white"
                    >
                      copy
                    </button>
                  </div>

                </div>
              </td>

              {/* PASSWORD */}
              <td className="p-4 text-center">
                <span className="bg-yellow-500/20 px-3 py-1 rounded">
                  {acc.password}
                </span>
              </td>

              {/* EXPIRED */}
              <td className="p-4 text-center text-sm">
                {acc.expired_at}
              </td>

              {/* STATUS */}
              <td className="p-4 text-right">
                <span className="bg-green-500 px-3 py-1 rounded-xl text-xs font-bold">
                  AKTIF
                </span>
              </td>

            </tr>
          ))}

        </tbody>
      </table>
    </div>

    {/* ALERT */}
    <div className="mt-6 p-4 border border-red-500/20 bg-red-500/5 rounded-xl text-sm">
      <span className="text-red-500 font-bold">PERHATIAN :</span>{" "}
      DILARANG KERAS MENGUBAH PASSWORD AKUN (AKAN DI BLACKLIST)
    </div>

  </div>

  {/* UPSELL */}
  <div className="max-w-6xl mx-auto px-6 mt-24">

    <h2 className="text-center text-xl font-bold mb-10">
      TINGKATKAN AKSES AI ANDA
    </h2>

    <div className="grid md:grid-cols-3 gap-6">

      {/* CARD 1 */}
      <div className={`${cardStyle} p-6 text-center`}>
        <h3 className="font-bold mb-3">AKUN PRIVAT</h3>
        <p className="text-gray-400 text-sm mb-6">
          Tanpa sharing, full milik Anda
        </p>
        <button className="w-full bg-white text-black py-2 rounded-lg">
          Cek Dashboard
        </button>
      </div>

      {/* CARD 2 */}
      <div className={`${cardStyle} p-6 text-center relative`}>
        <div className="absolute top-2 right-[-30px] rotate-45 bg-orange-500 px-8 text-xs">
          HEMAT
        </div>

        <h3 className="font-bold mb-3">TUTORIAL SUPERGROK</h3>
        <p className="text-gray-400 text-sm mb-6">
          Buat akun sendiri unlimited
        </p>
        <button className="w-full bg-orange-500 py-2 rounded-lg">
          Cek Dashboard
        </button>
      </div>

      {/* CARD 3 */}
      <div className={`${cardStyle} p-6 text-center`}>
        <h3 className="font-bold mb-3">TOOLS AI</h3>
        <p className="text-gray-400 text-sm mb-6">
          Generator konten otomatis
        </p>
        <button className="w-full border border-white/20 py-2 rounded-lg">
          Cek Dashboard
        </button>
      </div>

    </div>

  </div>

</div>
