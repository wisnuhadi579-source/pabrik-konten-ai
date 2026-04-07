import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom" // ✅ TAMBAHAN

export default function SuperGrokSharing() {

  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate() // ✅ TAMBAHAN

  const SUPABASE_URL = "https://ajtefnkjdzavwacgqkri.supabase.co"
  const API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdGVmbmtqZHphdndhY2dxa3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MzE2NjIsImV4cCI6MjA4NTIwNzY2Mn0.KjQDTGLPuaDsZM5dSipNYZcfr45CuRooFNSCRXDdGuY"

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/accounts`,
        {
          headers: {
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      )

      const data = await res.json()

      console.log("SUPABASE RESPONSE:", data)

      if (Array.isArray(data)) {
        setAccounts(data)
      } else {
        console.error("Bukan array:", data)
        setAccounts([])
      }

    } catch (err) {
      console.error("FETCH ERROR:", err)
      setAccounts([])
    } finally {
      setLoading(false)
    }
  }

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    alert(label + " disalin")
  }

  const cardStyle =
    "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"

  const glowStyle =
    "shadow-[0_0_40px_rgba(217,119,6,0.15)] border border-yellow-500/20"

  return (
    <div className="bg-[#050505] text-white min-h-screen">

      {/* HERO */}
      <div className="text-center pt-24 pb-16 px-6">

        <div className="inline-flex items-center gap-2.5 px-5 py-2 mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl hover:border-white/20 transition-all duration-500 group">

          <div className="w-6 h-6 group-hover:scale-110 transition-transform duration-500 text-white">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
              <path d="M50,10 C27.9,10 10,27.9 10,50 C10,55 11,60 13,64 L 0,90 L 26,78 C32,85 41,90 50,90 C72.1,90 90,72.1 90,50 C90,45 89,40 87,36 L 100,10 L 74,22 C68,15 59,10 50,10 Z M50,22 C58,22 65,26 69,32 L 64,36 C61,31 56,28 50,28 C37.8,28 28,37.8 28,50 C28,56 31,61 36,64 L 32,69 C26,65 22,58 22,50 C22,34.5 34.5,22 50,22 Z" />
            </svg>
          </div>

          <span className="text-2xl md:text-3xl font-black tracking-widest text-white flex items-center">
            SuperGrok
            <span className="ml-1 text-sm md:text-base align-top opacity-70">
              PRO
            </span>
          </span>

        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold uppercase leading-tight">
          AKSES EKSKLUSIF <br />
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            GROK AI PREMIUM
          </span>
        </h1>

        <p className="text-gray-400 mt-6 max-w-xl mx-auto">
          Dapatkan kredensial instan untuk Grok Premium tanpa biaya mahal.
        </p>

       <div className="flex items-center justify-center gap-4 mt-6">
<button
  onClick={() => {
    const el = document.getElementById("akun")
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }}
  className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 shadow-lg hover:shadow-yellow-500/30 hover:scale-105"
>
  Lihat Daftar Akun
</button>
<a
  href="https://wa.me/6285738477737?text=Halo%20Pakar%20Digital,%20saya%20mau%20nanya"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-green-500/30 bg-green-600/10 text-white font-semibold hover:bg-green-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-green-500/30"
>
  {/* ICON WHATSAPP */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="w-5 h-5 fill-current"
  >
    <path d="M16.04 2.003c-7.732 0-14 6.268-14 14 0 2.47.645 4.877 1.87 6.999L2 30l7.202-1.888a13.93 13.93 0 006.838 1.78h.006c7.732 0 14-6.268 14-14s-6.268-14-14.006-14zm7.985 19.63c-.337.945-1.985 1.82-2.74 1.94-.703.11-1.58.157-2.548-.15-.587-.186-1.34-.435-2.31-.84-4.07-1.757-6.73-6.08-6.937-6.36-.206-.28-1.66-2.21-1.66-4.22 0-2.01 1.05-3 1.42-3.41.37-.41.81-.51 1.08-.51.27 0 .54.002.78.014.25.012.59-.095.92.69.34.79 1.15 2.73 1.25 2.93.1.2.17.44.03.71-.14.27-.21.44-.41.67-.2.23-.42.51-.6.68-.2.2-.41.42-.18.82.23.4 1.03 1.7 2.21 2.76 1.52 1.36 2.8 1.78 3.2 1.98.4.2.63.17.86-.1.23-.27.97-1.13 1.23-1.52.26-.39.53-.32.89-.19.36.13 2.28 1.08 2.67 1.28.39.2.65.3.75.46.1.16.1.93-.24 1.88z"/>
  </svg>

  Hubungi Kami
</a>
        </div>

      </div>

      {/* TABLE */}
      <div id="akun" className="max-w-6xl mx-auto px-6">

        <div className="flex justify-between mb-6 flex-col md:flex-row gap-4">
          <div>
            <h2 className="text-2xl font-bold uppercase">DAFTAR AKUN PREMIUM</h2>
            <p className="text-gray-400 text-sm">
              Gunakan kredensial berikut untuk akses Grok Premium
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
                <th className="p-4 text-center">PASSWORD</th>
                <th className="p-4 text-center">MASA BERLAKU</th>
                <th className="p-4 text-right">STATUS</th>
              </tr>
            </thead>

            <tbody>

              {loading && (
                <tr>
                  <td colSpan={4} className="text-center p-6">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading && accounts.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-6 text-yellow-400">
                    Tidak ada data akun
                  </td>
                </tr>
              )}

              {!loading && Array.isArray(accounts) && accounts.map((acc: any) => (

                <tr key={acc.id || acc.email} className="border-t border-white/5 hover:bg-white/5 transition">

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                        📧
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-bold">{acc.email}</span>
                        <button
                          onClick={() => copy(acc.email, "Email")}
                          className="text-gray-400 hover:text-white text-xs"
                        >
                          copy
                        </button>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="bg-yellow-500/20 px-3 py-1 rounded font-mono">
                        {acc.password}
                      </span>
                      <button
                        onClick={() => copy(acc.password, "Password")}
                        className="text-gray-400 hover:text-white text-xs"
                      >
                        copy
                      </button>
                    </div>
                  </td>

                  <td className="p-4 text-center text-sm">
                    {acc.expired_at || "-"}
                  </td>

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

        <div className="mt-6 p-4 border border-red-500/20 bg-red-500/5 rounded-xl text-sm uppercase tracking-wide">
          <span className="text-red-500 font-bold">PERHATIAN :</span>{" "}
          DILARANG KERAS MENGUBAH PASSWORD AKUN GROK DIATAS (KETAHUAN AKAN LANGSUNG KAMI BLACKLIST)
        </div>

      </div>

      {/* UPSELL */}
      <div className="max-w-6xl mx-auto px-6 mt-24 mb-24">

        <h2 className="text-center text-xl font-bold mb-10 uppercase">
          TINGKATKAN AKSES SUPERGROK ANDA
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className={`${cardStyle} p-6 text-center`}>
            <h3 className="font-bold mb-3 uppercase">AKUN PRIVAT</h3>
            <p className="text-gray-400 text-sm mb-6">
              Gak mau pakai akun sharing? beli akun privat aja, lebih stabil, harga terjangkau, mulai dari 2rb aja. akses full milik Anda sendiri tanpa sharing akun
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-white text-black py-2 rounded-lg font-bold"
            >
              Cek Dashboard
            </button>
          </div>

          <div className={`${cardStyle} p-6 text-center relative overflow-hidden`}>
            <div className="absolute top-3 right-[-35px] rotate-45 bg-orange-500 px-8 text-xs font-bold">
              HEMAT
            </div>

            <h3 className="font-bold mb-3 uppercase">TUTORIAL SUPERGROK</h3>
            <p className="text-gray-400 text-sm mb-6">
              Mau lebih hemat? Buat akun sendiri aja, unlimited tanpa harus beli-beli akun lagi, bahkan kamu bisa dapet cuan dari jualan akun SuperGrok 
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-white text-black py-2 rounded-lg font-bold"
            >
              Cek Dashboard
            </button>
          </div>

          <div className={`${cardStyle} p-6 text-center`}>
            <h3 className="font-bold mb-3 uppercase">TOOLS AI</h3>
            <p className="text-gray-400 text-sm mb-6">
              Mau ngonten jadi lebih gampang tanpa mikir prompt? Pakai Tools Generator Otomatis. Sekali klik, konten viral Anda siap tayang tanpa pusing!
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-white text-black py-2 rounded-lg font-bold"
            >
              Cek Dashboard
            </button>
          </div>

        </div>

      </div>

    </div>
  )
}
