import React from "react";
import { Check, X, Zap, Crown, ShieldCheck } from "lucide-react";

export const Pricing = () => {
  const plans = [
    {
      name: "Gratis",
      price: "Rp 0",
      description: "Untuk mencoba fitur dasar",
      icon: <ShieldCheck className="text-zinc-400" size={32} />,
      features: {
        "Akses Tools Dasar": true,
        "Limit 3 Konten/Hari": true,
        "Kualitas Standar": true,
        "Grup Komunitas": false,
        "Update Eksklusif": false,
        "Support Prioritas": false,
      },
      button: "Gunakan Gratis",
      color: "zinc"
    },
    {
      name: "Premium",
      price: "Rp 99rb",
      period: "/bulan",
      description: "Pilihan terbaik untuk Creator",
      icon: <Zap className="text-yellow-400" size={32} />,
      features: {
        "Akses Semua Tools": true,
        "Limit 50 Konten/Hari": true,
        "Kualitas 4K Ready": true,
        "Grup Komunitas": true,
        "Update Eksklusif": true,
        "Support Prioritas": false,
      },
      button: "Pilih Premium",
      color: "yellow",
      popular: true
    },
    {
      name: "VIP",
      price: "Rp 249rb",
      period: "/bulan",
      description: "Untuk Agency & Power User",
      icon: <Crown className="text-fuchsia-400" size={32} />,
      features: {
        "Akses Semua Tools": true,
        "Unlimited Konten": true,
        "Kualitas 4K Ready": true,
        "Grup Komunitas": true,
        "Update Eksklusif": true,
        "Support Prioritas": true,
      },
      button: "Pilih VIP",
      color: "fuchsia"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">
            PILIH <span className="text-yellow-400">PLAN</span> ANDA
          </h1>
          <p className="text-zinc-500 max-w-xl mx-auto">
            Investasikan masa depan konten Anda dengan paket yang sesuai dengan kebutuhan produktivitas Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`relative p-8 rounded-3xl bg-[#0a0a0a] border transition-all duration-500 hover:-translate-y-2 ${
                plan.popular ? "border-yellow-400/50 shadow-[0_30px_100px_rgba(255,215,0,0.15)]" : "border-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
                  Paling Populer
                </div>
              )}

              <div className="mb-8">
                <div className="mb-4">{plan.icon}</div>
                <h3 className="text-2xl font-black uppercase italic tracking-tight mb-1">{plan.name}</h3>
                <p className="text-zinc-500 text-xs mb-6">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tighter">{plan.price}</span>
                  {plan.period && <span className="text-zinc-500 text-sm">{plan.period}</span>}
                </div>
              </div>

              <div className="space-y-4 mb-10">
                {Object.entries(plan.features).map(([feature, available], j) => (
                  <div key={j} className="flex items-center gap-3 text-sm">
                    {available ? (
                      <Check size={16} className="text-emerald-400" />
                    ) : (
                      <X size={16} className="text-zinc-700" />
                    )}
                    <span className={available ? "text-zinc-300" : "text-zinc-600"}>{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition ${
                plan.color === "yellow" 
                  ? "bg-yellow-400 text-black shadow-[0_10px_30px_rgba(255,215,0,0.3)] hover:scale-[1.02]" 
                  : plan.color === "fuchsia"
                  ? "bg-fuchsia-600 text-white shadow-[0_10px_30px_rgba(192,38,211,0.3)] hover:scale-[1.02]"
                  : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
              }`}>
                {plan.button}
              </button>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-32 overflow-x-auto">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-12 text-center">Tabel Perbandingan Detail</h2>
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-6 px-4 text-zinc-500 text-xs uppercase tracking-widest">Fitur</th>
                <th className="py-6 px-4 text-zinc-300 text-xs uppercase tracking-widest">Gratis</th>
                <th className="py-6 px-4 text-yellow-400 text-xs uppercase tracking-widest">Premium</th>
                <th className="py-6 px-4 text-fuchsia-400 text-xs uppercase tracking-widest">VIP</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                ["Akses Semua AI Tools", "Dasar", "Penuh", "Penuh"],
                ["Limit Generasi Konten", "3/Hari", "50/Hari", "Unlimited"],
                ["Kualitas Output", "720p", "4K", "4K+ Lossless"],
                ["Cloud Storage", "100MB", "10GB", "100GB"],
                ["Grup Komunitas", "❌", "✅", "✅"],
                ["Support", "Email", "Prioritas", "24/7 Personal"],
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="py-5 px-4 font-medium">{row[0]}</td>
                  <td className="py-5 px-4 text-zinc-500">{row[1]}</td>
                  <td className="py-5 px-4 text-zinc-300">{row[2]}</td>
                  <td className="py-5 px-4 text-zinc-300">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
