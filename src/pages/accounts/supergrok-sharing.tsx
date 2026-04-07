<div className="bg-[#050505] text-white min-h-screen font-sans">

  {/* HERO PREMIUM */}
  <div className="text-center pt-24 pb-16 px-6">

    {/* BADGE */}
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
      <span className="text-sm font-semibold">🚀 SuperGrok PRO</span>
    </div>

    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 uppercase leading-tight">
      AKSES EKSKLUSIF <br />
      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
        GROK AI PREMIUM
      </span>
    </h1>

    <p className="text-gray-400 max-w-xl mx-auto mb-8">
      Dapatkan kredensial instan untuk Grok dengan fitur premium tanpa biaya mahal.
    </p>

    <div className="flex justify-center gap-4 flex-wrap">
      <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-bold">
        📋 Lihat Daftar Akun
      </button>
      <button className="border border-white/20 px-6 py-3 rounded-xl">
        💬 Hubungi Kami
      </button>
    </div>
  </div>

  {/* TABLE HEADER */}
  <div className="max-w-6xl mx-auto px-6">

    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-2xl font-bold">DAFTAR AKUN PREMIUM</h2>
        <p className="text-gray-400 text-sm">
          Gunakan akun di bawah untuk akses Grok Premium
        </p>
      </div>

      <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-full text-sm">
        ● SISTEM ONLINE
      </div>
    </div>

    {/* TABLE */}
    <div className="rounded-2xl overflow-hidden border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-transparent">

      <table className="w-full text-left">
        <thead className="bg-yellow-500/10">
          <tr>
            <th className="p-4">EMAIL AKUN</th>
            <th className="p-4">PASSWORD</th>
            <th className="p-4">MASA BERLAKU</th>
            <th className="p-4 text-right">STATUS</th>
          </tr>
        </thead>

        <tbody>

          {accounts.map((acc) => (
            <tr key={acc.id} className="border-b border-white/10">

              <td className="p-4 font-semibold">
                {acc.email}
              </td>

              <td className="p-4">
                <span className="bg-yellow-500/20 px-3 py-1 rounded-lg font-mono">
                  {acc.password}
                </span>
              </td>

              <td className="p-4 text-gray-400">
                {acc.expired_at}
              </td>

              <td className="p-4 text-right">
                <span className="bg-green-500 px-3 py-1 rounded-full text-xs font-bold">
                  ● AKTIF
                </span>
              </td>

            </tr>
          ))}

        </tbody>
      </table>
    </div>

    {/* WARNING */}
    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm font-bold">
      ⚠️ DILARANG MENGUBAH PASSWORD AKUN (AKAN BLACKLIST)
    </div>

  </div>

  {/* UPSELL SECTION */}
  <div className="max-w-6xl mx-auto px-6 py-20">

    <h2 className="text-center text-2xl font-bold mb-10">
      TINGKATKAN AKSES AI ANDA
    </h2>

    <div className="grid md:grid-cols-3 gap-6">

      {/* CARD 1 */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
        <h3 className="font-bold mb-3">AKUN PRIVAT</h3>
        <p className="text-gray-400 text-sm mb-4">
          Tanpa sharing, full kontrol akun Anda.
        </p>
        <button className="bg-white text-black px-4 py-2 rounded-lg w-full">
          CEK DASHBOARD
        </button>
      </div>

      {/* CARD 2 */}
      <div className="bg-orange-500/10 border border-orange-500 p-6 rounded-2xl text-center">
        <h3 className="font-bold mb-3">TUTORIAL SUPERGROK</h3>
        <p className="text-gray-400 text-sm mb-4">
          Buat akun sendiri selamanya.
        </p>
        <button className="bg-orange-500 px-4 py-2 rounded-lg w-full">
          CEK DASHBOARD
        </button>
      </div>

      {/* CARD 3 */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center">
        <h3 className="font-bold mb-3">TOOLS AI GENERATOR</h3>
        <p className="text-gray-400 text-sm mb-4">
          Konten otomatis tanpa ribet.
        </p>
        <button className="border border-white px-4 py-2 rounded-lg w-full">
          CEK DASHBOARD
        </button>
      </div>

    </div>

  </div>

</div>
