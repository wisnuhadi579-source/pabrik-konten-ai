import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Zap,
  Crown,
  ChevronRight,
  Sparkles,
  Rocket,
  Target,
  Check,
  X,
  ShieldCheck
} from "lucide-react";

export const Landing = () => {

  const navigate = useNavigate();

  /* =========================
     PRICING DATA
  ========================= */

  const plans = [

    {
      name: "Gratis",

      link: "/#/dashboard",

      price: "Rp 0",

      description: "Coba tools gratis tanpa bayar",

      icon: <ShieldCheck className="text-zinc-400" size={32} />,

      features: {
        "Free Akses Selamanya": true,
        "Akses Tools Terbatas": true,
        "Akses Group Komunitas": true,
        "Akses Semua Tools Premium": false,
        "Akses Semua Tools VIP": false,
      },

      button: "Gunakan Gratis",
      color: "zinc"
    },

    {
      name: "Premium",

      link: "https://lynk.id/ISI-LINK-PREMIUM",

      oldPrice: "Rp 149rb",
      discount: "Diskon Rp 100.000",

      price: "Rp 49rb",
      period: "/Selamanya",

      description: "🔥 Paket hemat paling banyak dipilih",

      icon: <Zap className="text-yellow-400" size={32} />,

      features: {
        "Akses Semua Tools Gratis": true,
        "Akses Semua Tools Premium": true,
        "Tanpa Biaya Bulanan": true,
        "Akses Group Komunitas": true,
        "Free Update Premium": false,
      },

      button: "Pilih Premium",
      color: "yellow"
    },

    {
      name: "VIP",

      link: "https://lynk.id/ISI-LINK-VIP",

      oldPrice: "Rp 249rb",
      discount: "Diskon Rp 150.000",

      price: "Rp 99rb",
      period: "/Selamanya",

      description: "🚀 Full akses semua tools + future update",

      icon: <Crown className="text-fuchsia-400" size={32} />,

      features: {
        "Akses Semua Tools Gratis": true,
        "Akses Semua Tools Premium": true,
        "Akses Semua Tools VIP": true,
        "Tanpa Beli Token": true,
        "Free Update Semua Tools Baru": true,
      },

      button: "Pilih VIP",
      color: "fuchsia",
      popular: true
    }

  ];

  return (

    <div className="min-h-screen bg-black text-white selection:bg-yellow-400/30">

      {/* =========================
          HERO SECTION
      ========================= */}

      <div className="relative pt-16 pb-16 md:pt-24 md:pb-32 overflow-hidden">
        {/* GLOW */}

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-yellow-500/5 blur-[120px] pointer-events-none rounded-full"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">

          {/* BADGE */}

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 animate-pulse">

            <Sparkles size={12} />

            PLATFORM AI TOOLS UNTUK CREATOR DIGITAL

          </div>

          {/* TITLE */}

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8">

            BUAT KONTEN <br />

            <span className="text-yellow-400">

              LEBIH CEPAT <br />

            </span>

            TANPA RIBET

          </h1>

          {/* DESCRIPTION */}

          <p className="text-zinc-400 text-lg max-w-3xl mx-auto mb-12 leading-relaxed">

            Akses puluhan AI Tools premium untuk bikin konten viral,
            script iklan, prompt cinematic, copywriting,
            riset ide konten, dan kebutuhan creator digital lainnya
            dalam satu dashboard.

          </p>

          {/* CTA */}

          <div className="flex justify-center">

            <button
              onClick={() => navigate("/login")}
              className="px-10 py-5 bg-yellow-400 text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-transform shadow-[0_20px_50px_rgba(255,215,0,0.3)] flex items-center gap-2 group"
            >

              Mulai Sekarang

              <ChevronRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />

            </button>

          </div>

        </div>

      </div>

      {/* =========================
          BENEFITS
      ========================= */}

      <div className="py-14 md:py-24 border-y border-white/5 bg-[#050505]">
        <div className="max-w-6xl mx-auto px-6">

          <div className="grid md:grid-cols-3 gap-6 md:gap-12">

            {/* BENEFIT 1 */}

            <div className="space-y-4 group">

              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 group-hover:border-yellow-400 transition">

                <Rocket className="text-yellow-400" />

              </div>

              <h3 className="text-2xl font-black italic uppercase tracking-tight">

                Hemat Waktu

              </h3>

              <p className="text-zinc-500 text-sm leading-relaxed">

                Tidak perlu mikir ide dari nol.
                AI membantu membuat konten lebih cepat dan efisien.

              </p>

            </div>

            {/* BENEFIT 2 */}

            <div className="space-y-4 group">

              <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/20 group-hover:border-fuchsia-400 transition">

                <Target className="text-fuchsia-400" />

              </div>

              <h3 className="text-2xl font-black italic uppercase tracking-tight">

                Siap Viral

              </h3>

              <p className="text-zinc-500 text-sm leading-relaxed">

                Gunakan tools berbasis tren terbaru untuk meningkatkan kualitas dan engagement konten.

              </p>

            </div>

            {/* BENEFIT 3 */}

            <div className="space-y-4 group">

              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:border-emerald-400 transition">

                <Zap className="text-emerald-400" />

              </div>

              <h3 className="text-2xl font-black italic uppercase tracking-tight">

                All In One Dashboard

              </h3>

              <p className="text-zinc-500 text-sm leading-relaxed">

                Semua tools creator digital dalam satu tempat.
                Praktis tanpa perlu beli tools satu-satu.

              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =========================
          TOOLS PREVIEW
      ========================= */}

      <div className="py-14 md:py-24">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-8 md:mb-16">
            TOOLS <span className="text-yellow-400">PALING FAVORIT</span>

          </h2>

          <div className="grid md:grid-cols-2 gap-8 text-left">

            {/* CARD 1 */}

            <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-yellow-400/50 transition group relative overflow-hidden">

              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-400/5 blur-3xl rounded-full group-hover:bg-yellow-400/10 transition"></div>

              <h4 className="text-yellow-400 font-black uppercase tracking-widest text-xs mb-4">

                AFFILIATE TOOLS

              </h4>

              <h3 className="text-2xl font-bold mb-4">

                AI Ads Generator

              </h3>

              <p className="text-zinc-500 text-sm mb-6">

                Buat script iklan viral hanya dari link produk.
                Cocok untuk TikTok Shop, Shopee Affiliate, dan Reels.

              </p>

              <ul className="space-y-2 text-xs text-zinc-400">

                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                  Hook Viral Otomatis
                </li>

                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                  Analisa Produk
                </li>

                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                  Copywriting Siap Pakai
                </li>

              </ul>

            </div>

            {/* CARD 2 */}

            <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-fuchsia-400/50 transition group relative overflow-hidden">

              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-fuchsia-400/5 blur-3xl rounded-full group-hover:bg-fuchsia-400/10 transition"></div>

              <h4 className="text-fuchsia-400 font-black uppercase tracking-widest text-xs mb-4">

                AI VISUAL TOOLS

              </h4>

              <h3 className="text-2xl font-bold mb-4">

                Cinematic Prompt Generator

              </h3>

              <p className="text-zinc-500 text-sm mb-6">

                Generate prompt cinematic berkualitas tinggi untuk AI Image & AI Video generator.

              </p>

              <ul className="space-y-2 text-xs text-zinc-400">

                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-fuchsia-400 rounded-full"></div>
                  Prompt Siap Pakai
                </li>

                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-fuchsia-400 rounded-full"></div>
                  Lighting & Camera AI
                </li>

                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-fuchsia-400 rounded-full"></div>
                  4K Cinematic Ready
                </li>

              </ul>

            </div>

          </div>

        </div>

      </div>

      {/* =========================
          PRICING SECTION
      ========================= */}

      <div className="py-16 md:py-28 bg-[#050505] border-t border-white/5">

        <div className="max-w-6xl mx-auto px-6">

          {/* HEADER */}

          <div className="text-center mb-8 md:mb-20">

            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-5">

              PILIH <span className="text-yellow-400">AKSES</span> ANDA

            </h2>

            <p className="text-zinc-500 max-w-2xl mx-auto">

              Pilih paket yang paling sesuai dengan kebutuhan kamu.
              Tanpa biaya bulanan. Bayar sekali akses selamanya.

            </p>

          </div>

          {/* GRID */}

          <div className="grid md:grid-cols-3 gap-8">

            {plans.map((plan, i) => (

              <div
                key={i}
                className={`relative p-8 rounded-3xl bg-[#0a0a0a] border transition-all duration-500 hover:-translate-y-2 ${
                  plan.popular
                    ? "border-yellow-400/50 shadow-[0_30px_100px_rgba(255,215,0,0.15)]"
                    : "border-white/10"
                }`}
              >

                {/* BADGE */}

                {plan.popular && (

                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">

                    PALING POPULER

                  </div>

                )}

                {/* CONTENT */}

                <div className="mb-8">

                  <div className="mb-4">
                    {plan.icon}
                  </div>

                  <h3 className="text-2xl font-black uppercase italic tracking-tight mb-1">

                    {plan.name}

                  </h3>

                  <p className="text-zinc-500 text-xs mb-6">

                    {plan.description}

                  </p>

                  {/* OLD PRICE */}

                  {plan.oldPrice && (

                    <div className="flex items-center gap-2 mb-1">

                      <span className="text-zinc-500 line-through text-lg font-bold">

                        {plan.oldPrice}

                      </span>

                      <span className="bg-red-500/20 border border-red-500/30 text-red-400 text-[11px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">

                        {plan.discount}

                      </span>

                    </div>

                  )}

                  {/* NEW PRICE */}

                  <div className="flex items-baseline gap-1">

                    <span className="text-4xl font-black tracking-tighter">

                      {plan.price}

                    </span>

                    {plan.period && (

                      <span className="text-zinc-500 text-sm">

                        {plan.period}

                      </span>

                    )}

                  </div>

                </div>

                {/* FEATURES */}

                <div className="space-y-4 mb-10">

                  {Object.entries(plan.features).map(([feature, available], j) => (

                    <div key={j} className="flex items-center gap-3 text-sm">

                      {available ? (

                        <Check size={16} className="text-emerald-400" />

                      ) : (

                        <X size={16} className="text-zinc-700" />

                      )}

                      <span className={available ? "text-zinc-300" : "text-zinc-600"}>

                        {feature}

                      </span>

                    </div>

                  ))}

                </div>

                {/* BUTTON */}

                <button

                  onClick={() => {

                    if (plan.link.startsWith("http")) {

                      window.open(plan.link, "_blank");

                    } else {

                      window.location.href = plan.link;

                    }

                  }}

                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition hover:brightness-110 ${
                    plan.color === "yellow"
                      ? "bg-yellow-400 text-black shadow-[0_10px_30px_rgba(255,215,0,0.3)] hover:scale-[1.02]"
                      : plan.color === "fuchsia"
                      ? "bg-fuchsia-600 text-white shadow-[0_10px_30px_rgba(192,38,211,0.3)] hover:scale-[1.02]"
                      : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                  }`}
                >

                  {plan.button}

                </button>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );

};
