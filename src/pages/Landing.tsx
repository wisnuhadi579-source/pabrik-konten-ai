import React from "react";
import { useNavigate } from "react-router-dom";
import { Zap, ShieldCheck, Crown, ChevronRight, Play, Sparkles, Rocket, Target } from "lucide-react";

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-400/30">
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/5 blur-[120px] pointer-events-none rounded-full"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase tracking-widest mb-8 animate-pulse">
            <Sparkles size={12} /> The Future of Content Creation
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8">
            BANGUN KONTEN <br />
            <span className="text-yellow-400">10X LEBIH CEPAT</span>
          </h1>
          
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Platform AI Tools terintegrasi untuk Creator, Affiliator, dan Digital Builder. 
            Otomatisasi workflow konten Anda dengan teknologi AI tercanggih.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-10 py-4 bg-yellow-400 text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-transform shadow-[0_20px_50px_rgba(255,215,0,0.3)] flex items-center gap-2 group"
            >
              Mulai Sekarang <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/tutorial")}
              className="px-10 py-4 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-white/10 transition flex items-center gap-2"
            >
              <Play size={18} fill="currentColor" /> Lihat Demo
            </button>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 border-y border-white/5 bg-[#050505]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 group-hover:border-yellow-400 transition">
                <Rocket className="text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold italic uppercase tracking-tight">Otomatisasi Kilat</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Buat ratusan konten dalam hitungan menit. Dari riset hingga posting, biarkan AI bekerja untuk Anda.
              </p>
            </div>
            <div className="space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/20 group-hover:border-fuchsia-400 transition">
                <Target className="text-fuchsia-400" />
              </div>
              <h3 className="text-xl font-bold italic uppercase tracking-tight">Targeting Akurat</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Sistem AI kami menganalisis tren terkini untuk memastikan konten Anda relevan dan berpotensi viral.
              </p>
            </div>
            <div className="space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:border-emerald-400 transition">
                <Zap className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold italic uppercase tracking-tight">Kualitas Premium</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Hasil output AI yang natural dan profesional, siap digunakan untuk brand besar maupun personal branding.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-16">
            INTIP <span className="text-yellow-400">POWERFUL TOOLS</span> KAMI
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-yellow-400/50 transition group relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-400/5 blur-3xl rounded-full group-hover:bg-yellow-400/10 transition"></div>
              <h4 className="text-yellow-400 font-black uppercase tracking-widest text-xs mb-4">Affiliator Suite</h4>
              <h3 className="text-2xl font-bold mb-4">AI Ads Generator</h3>
              <p className="text-zinc-500 text-sm mb-6">Buat script iklan yang menjual hanya dengan memasukkan link produk. Terintegrasi dengan tren TikTok & Reels.</p>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-yellow-400 rounded-full"></div> Script Iklan Viral</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-yellow-400 rounded-full"></div> Analisis Kompetitor</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-yellow-400 rounded-full"></div> Hook Generator</li>
              </ul>
            </div>
            
            <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-fuchsia-400/50 transition group relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-fuchsia-400/5 blur-3xl rounded-full group-hover:bg-fuchsia-400/10 transition"></div>
              <h4 className="text-fuchsia-400 font-black uppercase tracking-widest text-xs mb-4">Creator Pro</h4>
              <h3 className="text-2xl font-bold mb-4">Cinematic Prompts</h3>
              <p className="text-zinc-500 text-sm mb-6">Hasilkan gambar dan video cinematic kelas dunia dengan sistem prompt engineering otomatis kami.</p>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-fuchsia-400 rounded-full"></div> Automotive Focus</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-fuchsia-400 rounded-full"></div> Lighting Optimization</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-fuchsia-400 rounded-full"></div> 4K Resolution Ready</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-b from-transparent to-yellow-400/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-8">
            SIAP JADI <span className="text-yellow-400">CREATOR MASA DEPAN?</span>
          </h2>
          <p className="text-zinc-500 mb-12">Bergabunglah dengan ribuan creator lainnya yang sudah menggunakan Pabrik Konten AI.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-12 py-5 bg-yellow-400 text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-transform shadow-[0_20px_50px_rgba(255,215,0,0.3)]"
          >
            Mulai Sekarang - Gratis
          </button>
        </div>
      </div>
    </div>
  );
};
