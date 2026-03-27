import { useEffect, useState } from "react"
import { supabase } from "../../services/supabaseClient"

export const AdminDashboard = () => {

const [stats,setStats] = useState({
tools:0,
licenses:0,
users:0,
premiumUsers:0,
vipUsers:0
})

const [latestTools,setLatestTools] = useState<any[]>([])
const [latestLicenses,setLatestLicenses] = useState<any[]>([])

/* =========================
   LOAD DASHBOARD
========================= */

const loadDashboard = async () => {

try{

const { data:tools, error:toolsError } = await supabase
.from("tools")
.select("*")

const { data:licenses, error:licensesError } = await supabase
.from("licenses")
.select("*")

if(toolsError || licensesError){
console.error("Dashboard load error", toolsError || licensesError)
return
}

/* STATS */

const toolsCount = tools?.length || 0
const licensesCount = licenses?.length || 0

const users = new Set(licenses?.map(l => l.email))

const premiumUsers = licenses?.filter(l => l.plan === "premium").length || 0
const vipUsers = licenses?.filter(l => l.plan === "vip").length || 0

setStats({
tools:toolsCount,
licenses:licensesCount,
users:users.size,
premiumUsers,
vipUsers
})

/* LATEST TOOLS */

const { data:latestT } = await supabase
.from("tools")
.select("*")
.order("created_at",{ascending:false})
.limit(5)

setLatestTools(latestT || [])

/* LATEST LICENSES */

const { data:latestL } = await supabase
.from("licenses")
.select("*")
.order("created_at",{ascending:false})
.limit(5)

setLatestLicenses(latestL || [])

}catch(err){
console.error("Dashboard fatal error", err)
}

}

/* =========================
   INIT LOAD
========================= */

useEffect(()=>{
loadDashboard()
},[])

/* =========================
   🔥 REALTIME LISTENER
========================= */

useEffect(()=>{

const channel = supabase
.channel("admin-dashboard-realtime")
.on(
"postgres_changes",
{
event:"*",
schema:"public",
table:"licenses"
},
()=>{
console.log("🔥 License change → reload dashboard")
loadDashboard()
}
)
.on(
"postgres_changes",
{
event:"*",
schema:"public",
table:"tools"
},
()=>{
console.log("🔥 Tool change → reload dashboard")
loadDashboard()
}
)
.subscribe()

return ()=>{
supabase.removeChannel(channel)
}

},[])

/* =========================
   UI
========================= */

return (

<div className="max-w-7xl mx-auto p-6">

<h1 className="text-3xl font-bold mb-8">
Admin Control Center
</h1>

{/* STATS */}

<div className="grid md:grid-cols-5 gap-6 mb-10">

<div className="card">
<h3>Tools</h3>
<p>{stats.tools}</p>
</div>

<div className="card">
<h3>Licenses</h3>
<p>{stats.licenses}</p>
</div>

<div className="card">
<h3>Users</h3>
<p>{stats.users}</p>
</div>

<div className="card">
<h3>Premium Users</h3>
<p>{stats.premiumUsers}</p>
</div>

<div className="card">
<h3>VIP Users</h3>
<p>{stats.vipUsers}</p>
</div>

</div>

{/* LATEST */}

<div className="grid md:grid-cols-2 gap-8">

<div className="bg-zinc-900 border border-white/10 rounded-xl p-6">

<h2 className="text-lg font-semibold mb-4">
Latest Tools
</h2>

{latestTools.map(tool=>(

<div key={tool.id} className="border-b border-white/10 py-2">

<p className="font-semibold">{tool.name}</p>
<p className="text-xs text-gray-400">{tool.plan}</p>

</div>

))}

</div>

<div className="bg-zinc-900 border border-white/10 rounded-xl p-6">

<h2 className="text-lg font-semibold mb-4">
Latest Licenses
</h2>

{latestLicenses.map(l=>(

<div key={l.id} className="border-b border-white/10 py-2">

<p className="font-semibold">{l.email}</p>
<p className="text-xs text-gray-400">{l.plan}</p>

</div>

))}

</div>

</div>

</div>

)

}