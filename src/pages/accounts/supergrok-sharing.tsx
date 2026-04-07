import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function SuperGrokSharing() {

  const navigate = useNavigate()

  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)

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

  setCopied(text)

  setTimeout(() => {
    setCopied(null)
  }, 1500)
}

  // 🔥 COMPONENT COPY BUTTON
 const CopyButton = ({ value }: { value: string }) => {

  const isCopied = copied === value

  return (
    <div className="relative flex items-center">

      <button
        onClick={() => copy(value)}
        onMouseEnter={() => setCopied((prev) => prev === value ? prev : "hover-" + value)}
        onMouseLeave={() => setCopied(null)}
        className="p-1 text-gray-400 hover:text-white transition"
      >
        {/* ICON FIX */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <rect x="2" y="2" width="13" height="13" rx="2" />
        </svg>
      </button>

      {/* TOOLTIP FIX (STATE BASED) */}
      {(copied === value || copied === "hover-" + value) && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 
          bg-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
          
          {isCopied ? "Berhasil disalin" : "Copy"}
        </div>
      )}

    </div>
  )
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
      <div className="max-w-6xl mx-auto px-6">

        <div className="flex justify-between mb-6 flex-col md:flex-row gap-4">
          <div>
            <h2 className="text-2xl font-bold uppercase">DAFTAR AKUN PREMIUM</h2>
            <p className="text-gray-400 text-sm">
              Gunakan kredensial di bawah ini untuk akses Grok Premium
            </p>
          </div>

          <div className="bg-green-500/10 border border-green-500/10 px-4 py-1 rounded-full text-green-500 text-sm">
            ● SISTEM ONLINE
          </div>
        </div>

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
                        <CopyButton value={acc.email} />
                      </div>
                    </div>
                  </td>

                  {/* PASSWORD */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="bg-yellow-500/20 px-3 py-1 rounded font-mono">
                        {acc.password}
                      </span>
                      <CopyButton value={acc.password} />
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
     <section className="mt-20 text-center">

  <h2 className="text-2xl font-bold mb-2">
    TINGKATKAN AKSES AI ANDA
  </h2>

  <p className="text-gray-400 mb-10">
    Dapatkan solusi eksklusif untuk pengalaman digital yang tak terbatas.
  </p>

  <div className="grid md:grid-cols-3 gap-6">

    {/* CARD 1 */}
    <div className="group relative rounded-2xl border border-white/10 
    bg-gradient-to-b from-white/5 to-white/0 
    p-8 transition-all duration-500 
    hover:scale-[1.03] hover:border-yellow-500/30 
    hover:shadow-[0_0_40px_rgba(255,170,0,0.15)]">

      {/* ICON */}
      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 flex items-center justify-center 
        rounded-full bg-yellow-500/10 
        border border-yellow-500/20 
        shadow-inner shadow-yellow-500/10">

          <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 12c2.5 0 4-1.5 4-3.5S14.5 5 12 5s-4 1.5-4 3.5S9.5 12 12 12z"/>
            <path d="M4 20c0-3 3-5 8-5s8 2 8 5"/>
          </svg>

        </div>
      </div>

      <h3 className="text-lg font-bold mb-2">AKUN PRIVAT</h3>

      <p className="text-gray-400 text-sm mb-6">
        Miliki akun sendiri tanpa sharing, lebih aman dan stabil.
      </p>

      <button
        onClick={() => navigate("/dashboard")}
        className="w-full py-3 rounded-lg bg-white text-black font-semibold 
        hover:bg-gray-200 transition">
        Cek Dashboard
      </button>

    </div>


    {/* CARD 2 (HIGHLIGHT) */}
    <div className="group relative rounded-2xl border border-yellow-500/30 
    bg-gradient-to-b from-yellow-500/10 to-transparent 
    p-8 transition-all duration-500 
    hover:scale-[1.05] 
    shadow-[0_0_60px_rgba(255,170,0,0.2)]">

      {/* RIBBON */}
      <div className="absolute top-0 right-0 bg-orange-500 text-xs px-3 py-1 
      rounded-bl-lg font-bold tracking-wide shadow-lg">
        HEMAT
      </div>

      {/* ICON */}
      <div className="mb-6 flex justify-center">
        <div className="w-18 h-18 flex items-center justify-center 
        rounded-full bg-yellow-500/20 
        border border-yellow-500/40 
        shadow-[0_0_30px_rgba(255,170,0,0.3)]">

          <svg className="w-9 h-9 text-yellow-300" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 2L15 8l6 .9-4.5 4.4 1 6.7L12 17l-5.5 3 1-6.7L3 8.9 9 8z"/>
          </svg>

        </div>
      </div>

      <h3 className="text-lg font-bold mb-2">TUTORIAL SUPERGROK</h3>

      <p className="text-gray-300 text-sm mb-6">
        Buat akun sendiri tanpa batas dan bisa dijadikan bisnis.
      </p>

      <button
        onClick={() => navigate("/dashboard")}
        className="w-full py-3 rounded-lg 
        bg-gradient-to-r from-orange-500 to-yellow-500 
        text-black font-bold 
        hover:brightness-110 transition shadow-lg">
        Cek Dashboard
      </button>

    </div>


    {/* CARD 3 */}
    <div className="group relative rounded-2xl border border-white/10 
    bg-gradient-to-b from-white/5 to-transparent 
    p-8 transition-all duration-500 
    hover:scale-[1.03] hover:border-yellow-500/30 
    hover:shadow-[0_0_40px_rgba(255,170,0,0.15)]">

      {/* ICON */}
      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 flex items-center justify-center 
        rounded-full bg-yellow-500/10 
        border border-yellow-500/20">

          <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M5 12h14M12 5v14"/>
          </svg>

        </div>
      </div>

      <h3 className="text-lg font-bold mb-2">TOOLS AI GENERATOR</h3>

      <p className="text-gray-400 text-sm mb-6">
        Generate konten otomatis tanpa mikir prompt.
      </p>

      <button
        onClick={() => navigate("/dashboard")}
        className="w-full py-3 rounded-lg border border-white/20 
        hover:border-yellow-500/50 hover:bg-white/5 transition">
        Cek Dashboard
      </button>

     </div>
          ))}

        </div>

      </section>

    </div>
  )
}
