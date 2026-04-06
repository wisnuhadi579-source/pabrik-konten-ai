import { useEffect, useState } from "react";

type Account = {
  id: string;
  email: string;
  password: string;
  expired_at: string;
  status: string;
};

export default function SuperGrokSharing() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔒 PROTEKSI LOGIN + LICENSE
  useEffect(() => {
    async function checkAccess() {
      const session = localStorage.getItem("userSession");

      let email = null;

      if (session) {
        try {
          const data = JSON.parse(session);
          email = data?.email;
        } catch {}
      }

      if (!email) {
        window.location.hash = "#/login";
        return;
      }

      const res = await fetch(
        `https://YOUR_SUPABASE_URL/rest/v1/licenses?email=eq.${email}&product=eq.grok_premium`,
        {
          headers: {
            apikey: "YOUR_ANON_KEY",
          },
        }
      );

      const data = await res.json();

      if (!data.length) {
        alert("Anda belum memiliki akses Grok Premium");
        window.location.hash = "#/dashboard";
      }
    }

    checkAccess();
  }, []);

  // 🔥 FETCH ACCOUNT DARI SUPABASE
  useEffect(() => {
    async function fetchAccounts() {
      const res = await fetch(
        `https://YOUR_SUPABASE_URL/rest/v1/accounts?product=eq.grok_premium&status=eq.active`,
        {
          headers: {
            apikey: "YOUR_ANON_KEY",
          },
        }
      );

      const data = await res.json();
      setAccounts(data);
      setLoading(false);
    }

    fetchAccounts();
  }, []);

  // 📋 COPY FUNCTION
  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(label + " disalin");
  };

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans">
      {/* NAVBAR */}
      <div className="sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-center items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-8 py-3">
          <div
            onClick={() => (window.location.hash = "#/")}
            className="cursor-pointer relative inline-flex items-center"
          >
            <div className="bg-gradient-to-b from-red-500 to-red-700 px-2 py-[2px] rounded-sm">
              <span className="text-gray-100 font-black text-sm uppercase">
                Pakar Digital
              </span>
            </div>
            <span className="absolute -top-0.5 -right-8 text-[10px] text-yellow-400 border border-yellow-400 rounded px-1 font-bold bg-black">
              APP
            </span>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div className="pt-16 pb-24 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 uppercase">
          Akses Eksklusif <br />
          <span className="text-amber-400">Grok AI Premium</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Gunakan akun sharing untuk akses Grok Premium langsung.
        </p>
      </div>

      {/* TABLE */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4">Email</th>
                <th className="p-4">Password</th>
                <th className="p-4">Expired</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              )}

              {accounts.map((acc) => (
                <tr key={acc.id} className="border-b border-white/5">
                  <td className="p-4 font-bold">
                    {acc.email}
                    <button
                      onClick={() => copy(acc.email, "Email")}
                      className="ml-2 text-xs text-gray-400"
                    >
                      copy
                    </button>
                  </td>

                  <td className="p-4">
                    <span className="bg-amber-400/10 px-3 py-1 rounded-lg font-mono">
                      {acc.password}
                    </span>
                    <button
                      onClick={() => copy(acc.password, "Password")}
                      className="ml-2 text-xs text-gray-400"
                    >
                      copy
                    </button>
                  </td>

                  <td className="p-4 text-sm text-gray-400">
                    {acc.expired_at}
                  </td>

                  <td className="p-4 text-right">
                    <span className="bg-green-600 px-3 py-1 rounded-full text-xs font-bold">
                      AKTIF
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* WARNING */}
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm font-bold">
          ⚠️ Dilarang mengubah password akun. Pelanggaran akan diblacklist.
        </div>
      </div>
    </div>
  );
}
