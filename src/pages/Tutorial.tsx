import React from "react";
import { Play, BookOpen, HelpCircle, ChevronRight, Video, FileText } from "lucide-react";

export const Tutorial = () => {
  const tutorials = [
    {
      title: "Cara Menggunakan AI Ads Generator",
      duration: "05:20",
      category: "Affiliator",
      thumbnail: "https://picsum.photos/seed/tut1/800/450"
    },
    {
      title: "Optimasi Cinematic Prompts untuk Otomotif",
      duration: "08:45",
      category: "Creator",
      thumbnail: "https://picsum.photos/seed/tut2/800/450"
    },
    {
      title: "Strategi Konten Viral 2026",
      duration: "12:10",
      category: "Strategy",
      thumbnail: "https://picsum.photos/seed/tut3/800/450"
    }
  ];

  const faqs = [
    {
      q: "Apakah tools ini bisa digunakan di HP?",
      a: "Ya, platform kami sepenuhnya responsif dan dapat diakses melalui browser di smartphone Anda."
    },
    {
      q: "Bagaimana cara klaim akses premium?",
      a: "Anda dapat memasukkan kode voucher yang telah dibeli di menu 'Beli Akses' pada setiap tool card."
    },
    {
      q: "Apakah ada grup komunitas?",
      a: "Tentu! Setelah menjadi member Premium/VIP, Anda akan mendapatkan link undangan ke grup eksklusif kami."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">
            PUSAT <span className="text-yellow-400">TUTORIAL</span>
          </h1>
          <p className="text-zinc-500 max-w-xl">
            Pelajari cara memaksimalkan setiap AI Tools untuk meningkatkan produktivitas konten Anda.
          </p>
        </div>

        {/* Video Tutorials */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-8">
            <Video className="text-yellow-400" size={24} />
            <h2 className="text-xl font-bold uppercase tracking-widest">Video Tutorials</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {tutorials.map((tut, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 mb-4">
                  <img src={tut.thumbnail} alt={tut.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-black">
                      <Play fill="currentColor" size={20} />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-[10px] font-bold">
                    {tut.duration}
                  </div>
                </div>
                <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest mb-1">{tut.category}</p>
                <h3 className="font-bold group-hover:text-yellow-400 transition">{tut.title}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Documentation & FAQ */}
        <div className="grid md:grid-cols-2 gap-16">
          <section>
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="text-yellow-400" size={24} />
              <h2 className="text-xl font-bold uppercase tracking-widest">Dokumentasi</h2>
            </div>
            <div className="space-y-4">
              {["Panduan Dasar Platform", "Integrasi API", "Tips Prompt Engineering", "Manajemen Akun"].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-yellow-400/50 cursor-pointer transition">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-zinc-500" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                  <ChevronRight size={16} className="text-zinc-600" />
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="text-yellow-400" size={24} />
              <h2 className="text-xl font-bold uppercase tracking-widest">FAQ</h2>
            </div>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <h4 className="font-bold text-yellow-400 mb-2">Q: {faq.q}</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">A: {faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
