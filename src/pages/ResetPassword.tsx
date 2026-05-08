import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

export default function ResetPassword() {

const navigate = useNavigate();

const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");

const handleUpdatePassword = async () => {

setLoading(true);
setMessage("");

const { error } = await supabase.auth.updateUser({
password
});

if (error) {
setMessage(error.message);
} else {
setMessage("Password berhasil diubah!");

setTimeout(() => {
navigate("/login");
}, 2000);
}

setLoading(false);
};

return (

<div className="min-h-screen bg-black text-white flex items-center justify-center">

<div className="bg-zinc-900 p-8 rounded-xl w-full max-w-md">

<h1 className="text-2xl font-bold mb-6">
Reset Password
</h1>

<input
type="password"
placeholder="Password baru"
value={password}
onChange={(e) => setPassword(e.target.value)}
className="w-full p-3 rounded bg-black border border-zinc-700 mb-4"
/>

<button
onClick={handleUpdatePassword}
disabled={loading}
className="w-full bg-yellow-400 text-black font-bold py-3 rounded"
>

{loading ? "Loading..." : "Update Password"}

</button>

{message && (
<p className="mt-4 text-sm text-center">
{message}
</p>
)}

</div>

</div>

);

}
