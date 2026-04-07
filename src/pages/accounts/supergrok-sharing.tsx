import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function SuperGrokSharing() {

  const navigate = useNavigate()

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
      const res = await fetch(`${SUPABASE_URL}/rest/v1/accounts`, {
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
        },
      })

      const data = await res.json()

      if (Array.isArray(data)) {
        setAccounts(data)
      } else {
        setAccounts([])
      }

    } catch (err) {
      console.error(err)
      setAccounts([])
    } finally {
      setLoading(false)
    }
  }

  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="bg-[#050505] text-white min-h-screen">

      {/* HERO */}
      <div className="text-center pt-24 pb-16 px-6">

        <div className="inline-flex items-center gap-3 px-6 py-3 mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-xl">
          <div className="w-6 h-6 text-white">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
              <path d="M50,10 C27.9,10 10,27.9 10,50 C10,55 11,60 13,64 L 0,90 L 26,78 C32,85 41,90 50,90 C72.1,90 90,72.1 90,50 C90,45 89,40 87,36 L 100,10 L 74,22 C68,15 59,10 50,10 Z" />
            </svg>
          </div>

          <span className="text-2xl md:text-4xl font-black tracking-widest">
            SuperGrok
            <span className="ml-1 text-sm opacity-70">PRO</span>
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold">
          AKSES EKSKLUSIF <br />
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            GROK AI PREMIUM
          </span>
        </h1>

        <p className="text-gray-400 mt-6 max-w-xl mx-auto">
          Dapatkan kredensial instan untuk Grok Premium tanpa biaya mahal.
        </p>

      </div>

      {/* TABLE */}
      <div id="akun" className="max-w-6xl mx-auto px-6">

        <div className="flex justify-between mb-6 flex-col md:flex-row gap-4">
          <div>
            <h2 className="text-2xl font-bold uppercase">DAFTAR AKUN PREMIUM</h2>
            <p className="text-gray-400 text-sm">
              Gunakan kredensial di bawah ini untuk akses Grok Premium
            </p>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 px-4 py-1 rounded-full text-green-400 text-sm">
            ● SISTEM ONLINE
          </div>
        </div>

        {/* CARD */}
        <div className="rounded-2xl overflow-hidden border border-yellow-500/20 shadow-[0_0_80px_rgba(234,179,8,0.15)]">

          <table className="w-full">

            <thead className="bg-gradient-to-r from-yellow-500/20 to-orange-500/10 text-sm">
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

              {!loading && accounts.map((acc: any) => (

                <tr key={acc.id || acc.email} className="border-t border-white/5 hover:bg-white/5">

                  {/* EMAIL */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center text-yellow-400">
                        ✉️
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{acc.email}</span>

                        <button
                          onClick={() => copy(acc.email)}
                          className="text-gray-400 hover:text-white"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* PASSWORD */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="bg-yellow-500/20 px-3 py-1 rounded font-mono">
                        {acc.password}
                      </span>

                      <button
                        onClick={() => copy(acc.password)}
                        className="text-gray-400 hover:text-white"
                      >
                        📋
                      </button>
                    </div>
                  </td>

                  {/* MASA BERLAKU */}
                  <td className="p-4 text-center text-sm">
                    <div>
                      <div>30 Hari</div>
                      <div className="text-gray-500 text-xs">
                        {acc.expired_at || "-"}
                      </div>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="p-4 text-right">
                    <span className="bg-green-500 px-4 py-1 rounded-full text-xs font-bold">
                      ● AKTIF
                    </span>
                  </td>

                </tr>

              ))}

            </tbody>
          </table>
        </div>

        {/* ALERT */}
        <div className="mt-6 p-4 border border-red-500/30 bg-red-500/10 rounded-xl text-sm">
          <span className="text-red-400 font-bold">⚠ PERHATIAN :</span>{" "}
          DILARANG KERAS MENGUBAH PASSWORD AKUN GROK DIATAS (KETAHUAN AKAN LANGSUNG KAMI BLACKLIST)
        </div>

      </div>

      {/* UPSELL */}
      <div className="max-w-6xl mx-auto px-6 mt-24 mb-24">

        <h2 className="text-center text-xl font-bold mb-10 uppercase">
          TINGKATKAN AKSES AI ANDA
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {/* CARD */}
          <div className="group bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:border-yellow-500/40 hover:shadow-[0_0_60px_rgba(234,179,8,0.2)] transition">

            <div className="w-14 h-14 mx-auto mb-4 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-400">
              👤
            </div>

            <h3 className="font-bold mb-3">AKUN PRIVAT</h3>

            <p className="text-gray-400 text-sm mb-6">
              Miliki akun sendiri tanpa sharing, lebih aman dan stabil.
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-white text-black py-2 rounded-lg font-bold"
            >
              Cek Dashboard
            </button>
          </div>

          {/* CARD 2 */}
          <div className="relative bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-8 text-center shadow-[0_0_60px_rgba(234,179,8,0.2)]">

            <div className="absolute top-3 right-[-30px] rotate-45 bg-orange-500 px-6 text-xs font-bold">
              HEMAT
            </div>

            <div className="w-14 h-14 mx-auto mb-4 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-300">
              🎓
            </div>

            <h3 className="font-bold mb-3">TUTORIAL SUPERGROK</h3>

            <p className="text-gray-300 text-sm mb-6">
              Buat akun sendiri tanpa batas dan bisa dijadikan bisnis.
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-orange-500 py-2 rounded-lg font-bold"
            >
              Cek Dashboard
            </button>
          </div>

          {/* CARD */}
          <div className="group bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:border-yellow-500/40 hover:shadow-[0_0_60px_rgba(234,179,8,0.2)] transition">

            <div className="w-14 h-14 mx-auto mb-4 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-400">
              ✨
            </div>

            <h3 className="font-bold mb-3">TOOLS AI GENERATOR</h3>

            <p className="text-gray-400 text-sm mb-6">
              Generate konten otomatis tanpa mikir prompt.
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full border border-white/20 py-2 rounded-lg font-bold"
            >
              Cek Dashboard
            </button>
          </div>

        </div>

      </div>

    </div>
  )
}
