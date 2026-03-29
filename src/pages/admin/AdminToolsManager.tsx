import { useEffect, useState } from "react"
import { supabase } from "../../services/supabaseClient"

export const AdminToolsManager = () => {

const [tools,setTools] = useState<any[]>([])
const [analytics,setAnalytics] = useState<any>({})

/* ================= LOAD ================= */

const loadData = async ()=>{

// ambil tools
const { data:toolsData } = await supabase
.from("tools")
.select("*")

// ambil event usage
const { data:events } = await supabase
.from("tool_events")
.select("*")

/* ================= PROCESS ================= */

const map:any = {}

toolsData?.forEach(t=>{
map[t.id] = {
...t,
users: new Set(),
totalOpen: 0
}
})

events?.forEach(e=>{

if(!map[e.tool_id]) return

map[e.tool_id].users.add(e.user_email)
map[e.tool_id].totalOpen++

})

/* ================= FINAL ================= */

const result = Object.values(map).map((t:any)=>({
...t,
usersCount: t.users.size
}))

// sort by popularity
result.sort((a:any,b:any)=>b.totalOpen - a.totalOpen)

setTools(result)

}

useEffect(()=>{
loadData()
},[])

/* 🔥 REALTIME */

useEffect(()=>{

const channel = supabase
.channel("tools-analytics")
.on("postgres_changes",
{ event:"*", schema:"public", table:"tool_events" },
()=>loadData()
)
.on("postgres_changes",
{ event:"*", schema:"public", table:"tools" },
()=>loadData()
)
.subscribe()

return ()=> supabase.removeChannel(channel)

},[])

/* ================= UI ================= */

return (

<div className="max-w-7xl mx-auto p-6">

<h1 className="text-3xl font-bold mb-6">
Tools Analytics
</h1>

<div className="bg-zinc-900 p-6 rounded-xl">

<h2 className="text-xl mb-4">
Tool Usage Overview
</h2>

<table className="w-full text-sm">

<thead>
<tr>
<th>Name</th>
<th>Plan</th>
<th>Users</th>
<th>Total Open</th>
<th>Status</th>
</tr>
</thead>

<tbody>

{tools.map(t=>(

<tr key={t.id} className="border-b border-white/5">

<td className="py-3">{t.name}</td>

<td>{t.plan}</td>

<td>{t.usersCount}</td>

<td>{t.totalOpen}</td>

<td>{t.is_coming_soon ? "Coming Soon" : "Active"}</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

)

}