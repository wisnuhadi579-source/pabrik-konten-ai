import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function SuperGrokSharing() {

  const navigate = useNavigate()

  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)

  const SUPABASE_URL = "https://ajtefnkjdzavwacgqkri.supabase.co"
  const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdGVmbmtqZHphdndhY2dxa3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MzE2NjIsImV4cCI6MjA4NTIwNzY2Mn0.KjQDTGLPuaDsZM5dSipNYZcfr45CuRooFNSCRXDdGuY"

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
      setAccounts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setAccounts([])
    } finally {
      setLoading(false)
    }
  }

  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 1500)
  }

  const CopyButton = ({ value }: { value: string }) => {
    const isCopied = copied === value

    return (
      <div className="relative group">

        <button
          onClick={() => copy(value)}
          className="p-1 text-gray-400 hover:text-white"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" fill="none">
            <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2"/>
            <rect x="2" y="2" width="13" height="13" rx="2" strokeWidth="2"/>
          </svg>
        </button>

        <div className="absolute -top-8 left-1/2 -translate-x-1/2 
        opacity-0 group-hover:opacity-100 transition 
        bg-black text-white text-xs px-2 py-1 rounded">

          {isCopied ? "Berhasil disalin" : "Copy"}

        </div>

      </div>
    )
  }

  return (
    <div className="bg-[#050505] text-white min-h-screen">

      {/* HERO */}
      <div className="text-center pt-24 pb-16 px-6">

        <div className="inline-flex items-center gap-3 px-6 py-3 mb-8 
        bg-white/5 border border-white/10 rounded-full shadow-xl">

          <span className="text-3xl md:text-4xl font-black tracking-widest">
            SuperGrok <span className="text-sm opacity-70">PRO</span>
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
      <div className="max-w-6xl mx-auto px-6">

        <div className="rounded-2xl overflow-hidden border border-yellow-500/20 
        shadow-[0_0_80px_rgba(234,179,8,0.15)]">

          <table className="w-full">

            <thead className="bg-gradient-to-r from-yellow-500/20 to-orange-500/10 text-sm">
              <tr>
                <th className="p-4 text-left">EMAIL</th>
                <th className="p-4 text-center">PASSWORD</th>
                <th className="p-4 text-center">EXPIRED</th>
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

              {!loading && accounts.map((acc) => (

                <tr key={acc.id || acc.email} className="border-t border-white/5 hover:bg-white/5">

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {acc.email}
                      <CopyButton value={acc.email} />
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <span className="bg-yellow-500/20 px-3 py-1 rounded font-mono">
                        {acc.password}
                      </span>
                      <CopyButton value={acc.password} />
                    </div>
                  </td>

                  <td className="p-4 text-center text-sm">
                    {acc.expired_at || "-"}
                  </td>

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
          DILARANG KERAS MENGUBAH PASSWORD AKUN GROK DIATAS
        </div>

      </div>

      {/* UPSELL */}
      <section className="mt-20 text-center px-6">

        <h2 className="text-2xl font-bold mb-10">
          TINGKATKAN AKSES AI ANDA
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {/* CARD */}
          {[
            "AKUN PRIVAT",
            "TUTORIAL SUPERGROK",
            "TOOLS AI GENERATOR"
          ].map((title, i) => (

            <div
              key={i}
              className="group relative rounded-2xl border border-white/10 
              bg-gradient-to-b from-white/5 to-transparent 
              p-8 transition-all duration-500 
              hover:scale-[1.05] hover:border-yellow-500/30 
              hover:shadow-[0_0_60px_rgba(255,170,0,0.2)]"
            >

              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 flex items-center justify-center 
                rounded-full bg-yellow-500/10 border border-yellow-500/20">

                  <span className="text-yellow-400 text-xl">★</span>

                </div>
              </div>

              <h3 className="text-lg font-bold mb-2">{title}</h3>

              <button
                onClick={() => navigate("/dashboard")}
                className="mt-6 w-full py-3 rounded-lg bg-yellow-500 text-black font-bold">
                Cek Dashboard
              </button>

            </div>

          ))}

        </div>

      </section>

    </div>
  )
}
