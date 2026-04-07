import { useEffect, useState } from "react"

export default function SuperGrokSharing() {

  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

      // 🔥 FIX UTAMA: VALIDASI ARRAY
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

        <div className="inline-flex items-center gap-2 px-15 py-2 mb-6 bg-white/5 border border-white/10 rounded-full">
          🚀 <span className="font-bold">SuperGrok PRO</span>
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

        <div className="flex justify-center gap-4 mt-8">
          <a href="#akun" className="px-6 py-3 bg-orange-500 hover:bg-orange-400 rounded-xl font-bold">
            Lihat Daftar Akun
          </a>
          <button className="px-6 py-3 border border-white/20 rounded-xl hover:bg-white hover:text-black transition">
            Hubungi Kami
          </button>
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
                    <span className="bg-yellow-500/20 px-3 py-1 rounded font-mono">
                      {acc.password}
                    </span>
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

        {/* ALERT */}
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
              Gak mau pakai akun sharing? beli akun privat aja, harga terjangkau, mulai dari 2rb aja. akses full milik Anda sendiri tanpa sharing
            </p>
            <button className="w-full bg-white text-black py-2 rounded-lg font-bold">
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
            <button className="w-full bg-orange-500 py-2 rounded-lg font-bold">
              Cek Dashboard
            </button>
          </div>

          <div className={`${cardStyle} p-6 text-center`}>
            <h3 className="font-bold mb-3 uppercase">TOOLS AI</h3>
            <p className="text-gray-400 text-sm mb-6">
             Mau ngonten jadi lebih gampang tanpa mikir prompt? Pakai Tools Generator Otomatis. Sekali klik, konten viral Anda siap tayang tanpa pusing!
            </p>
            <button className="w-full border border-white/20 py-2 rounded-lg font-bold">
              Cek Dashboard
            </button>
          </div>

        </div>

      </div>

    </div>
  )
}
