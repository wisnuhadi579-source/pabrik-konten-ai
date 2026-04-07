import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  supabase,
  getUserLicenses,
  canAccessTool,
} from "../../services/supabaseClient"

export default function SuperGrokCourse() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  const cardStyle =
    "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"

  const glowStyle =
    "shadow-[0_0_40px_rgba(217,119,6,0.15)] border border-yellow-500/20"

  // 🔐 CHECK ACCESS
  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        navigate("/login")
        return
      }

      const licenses = await getUserLicenses(user.id)

      const allowed = canAccessTool(licenses, {
        id: "supergrok-course",
        product: "supergrok-course",
        plan: "Single",
      })

      setHasAccess(allowed)
      setLoading(false)
    }

    checkAccess()
  }, [navigate])

  // ⏳ LOADING SCREEN
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  // 🔒 BLOCK AKSES
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white text-center px-6 bg-[#050505]">
        <h2 className="text-3xl font-bold mb-4">🔒 Akses Terkunci</h2>
        <p className="text-gray-400 mb-6">
          Anda belum membeli akses course ini
        </p>

        <button
          onClick={() => navigate("/pricing")}
          className="px-6 py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:scale-105 transition"
        >
          Beli Akses
        </button>
      </div>
    )
  }

  return (
    <div className="bg-[#050505] text-white min-h-screen">

      {/* HERO */}
      <div className="text-center pt-24 pb-16 px-6">

        <div className="inline-flex items-center gap-2.5 px-5 py-2 mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl hover:border-white/20 transition-all duration-500 group">

          <div className="w-6 h-6 group-hover:scale-110 transition-transform duration-500 text-white">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
              <path d="M50,10 C27.9,10 10,27.9 10,50 C10,55 11,60 13,64 L 0,90 L 26,78 C32,85 41,90 50,90 C72.1,90 90,72.1 90,50 C90,45 89,40 87,36 L 100,10 L 74,22 C68,15 59,10 50,10 Z" />
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
          Pelajari cara membuat akun SuperGrok sendiri sepuasnya tanpa harus beli akun terus
        </p>

        <div className="flex items-center justify-center gap-4 mt-6">

          {/* BUTTON SCROLL */}
          <button
            onClick={() => {
              const el = document.getElementById("course")
              if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY - 80
                window.scrollTo({ top: y, behavior: "smooth" })
              }
            }}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 shadow-lg hover:shadow-yellow-500/30 hover:scale-105"
          >
            Mulai Belajar
          </button>

          {/* WHATSAPP */}
          <a
            href="https://wa.me/6285738477737?text=Halo%20Pakar%20Digital,%20saya%20mau%20nanya"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-green-500/30 bg-green-600/10 text-white font-semibold hover:bg-green-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-green-500/30"
          >
            <svg viewBox="0 0 32 32" className="w-5 h-5 fill-current">
              <path d="M16.04 2.003c-7.732 0-14 6.268-14 14 0 2.47.645 4.877 1.87 6.999L2 30l7.202-1.888a13.93 13.93 0 006.838 1.78h.006c7.732 0 14-6.268 14-14s-6.268-14-14.006-14z"/>
            </svg>
            Hubungi Kami
          </a>

        </div>

      </div>

      {/* COURSE */}
      <div id="course" className="max-w-6xl mx-auto px-6">

        <div className="flex justify-between mb-6 flex-col md:flex-row gap-4">
          <div>
            <h2 className="text-2xl font-bold uppercase">VIDEO COURSE</h2>
            <p className="text-gray-400 text-sm">
              Tonton tutorial lengkap SuperGrok Premium
            </p>
          </div>

          <div className="flex items-center gap-2 text-green-400 text-sm">
            ● AKSES TERSEDIA
          </div>
        </div>

        <div className={`${cardStyle} ${glowStyle} overflow-hidden p-4`}>

          {/* VIDEO */}
          <div className="relative w-full h-[500px] overflow-hidden rounded-xl border border-yellow-500/20">

            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/sMTQeD8ClpM?rel=0&modestbranding=1&controls=1&showinfo=0&iv_load_policy=3&disablekb=1&fs=0"
              title="SuperGrok Course"
              allowFullScreen
            />

            <div className="absolute bottom-0 left-0 w-full h-[60px] bg-black/90 backdrop-blur-md pointer-events-none"></div>

          </div>

          <div className="mt-6">
            <h3 className="font-bold text-lg mb-2">
              🎓 Tutorial SuperGrok Full Guide
            </h3>
            <p className="text-gray-400 text-sm">
              Di video ini kamu akan belajar cara membuat akun SuperGrok sendiri,
              menghindari limit, dan bahkan bisa menjadikannya sebagai peluang bisnis.
            </p>
          </div>

        </div>

        {/* WARNING */}
        <div className="mt-6 p-4 border border-red-500/20 bg-red-500/5 rounded-xl text-sm uppercase tracking-wide">
          <span className="text-red-500 font-bold">PERHATIAN :</span>{" "}
          DILARANG MENYEBARKAN VIDEO INI TANPA IZIN. PELANGGARAN AKAN DI BLACKLIST.
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
              Beli akun privat lebih stabil tanpa sharing.
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
              Belajar buat akun sendiri dan bahkan bisa dijual kembali.
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
              Gunakan AI tools untuk konten otomatis.
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
