import { useEffect, useState } from "react"
import { supabase } from "../../services/supabaseClient"

export const AdminAnalytics = () => {

const [loading,setLoading] = useState(true)

/* KPI */
const [kpi,setKpi] = useState({
totalEvents:0,
openTool:0,
buyClick:0,
tutorialClick:0,
users:0,
conversion:0
})

/* TOP TOOLS */
const [topTools,setTopTools] = useState<any[]>([])

/* TOP USERS */
const [topUsers,setTopUsers] = useState<any[]>([])

/* DAILY */
const [daily,setDaily] = useState<any[]>([])

/* LOAD DATA */

const loadAnalytics = async () => {

setLoading(true)

/* EVENTS */
const { data:events } = await supabase
.from("tool_events")
.select("*")

/* LICENSES */
const { data:licenses } = await supabase
.from("licenses")
.select("*")

/* TOOLS (🔥 NEW) */
const { data:tools } = await supabase
.from("tools")
.select("*")

/* KPI */

const totalEvents = events?.length || 0

const openTool = events?.filter(e => e.event_type === "open_tool").length || 0
const buyClick = events?.filter(e => e.event_type === "buy_click").length || 0
const tutorialClick = events?.filter(e => e.event_type === "tutorial_click").length || 0

const users = new Set(events?.map(e => e.user_email)).size || 0

/* 🔥 CONVERSION RATE */
const conversion = buyClick > 0
? ((licenses?.length || 0) / buyClick * 100)
: 0

setKpi({
totalEvents,
openTool,
buyClick,
tutorialClick,
users,
conversion: Number(conversion.toFixed(1))
})

/* =====================
   TOP TOOLS (FIXED)
===================== */

const toolMap:any = {}

events?.forEach(e=>{
if(e.event_type === "open_tool"){
toolMap[e.tool_id] = (toolMap[e.tool_id] || 0) + 1
}
})

const topToolsArr = Object.entries(toolMap)
.map(([tool_id,count])=>{

const tool = tools?.find(t => t.id === tool_id)

return {
tool_id,
name: tool?.name || tool_id,
count
}

})
.sort((a:any,b:any)=>b.count - a.count)
.slice(0,5)

setTopTools(topToolsArr)

/* =====================
   TOP USERS
===================== */

const userMap:any = {}

events?.forEach(e=>{
userMap[e.user_email] = (userMap[e.user_email] || 0) + 1
})

const topUsersArr = Object.entries(userMap)
.map(([email,count])=>({email,count}))
.sort((a:any,b:any)=>b.count - a.count)
.slice(0,5)

setTopUsers(topUsersArr)

/* =====================
   DAILY ACTIVITY
===================== */

const dayMap:any = {}

events?.forEach(e=>{

const date = new Date(e.created_at).toLocaleDateString()

dayMap[date] = (dayMap[date] || 0) + 1

})

const dailyArr = Object.entries(dayMap)
.map(([date,count])=>({date,count}))
.sort((a:any,b:any)=> new Date(a.date).getTime() - new Date(b.date).getTime())

setDaily(dailyArr)

setLoading(false)

}

useEffect(()=>{
loadAnalytics()
},[])

return (

<div className="max-w-7xl mx-auto p-6">

<h1 className="text-3xl font-bold mb-8">
Analytics Dashboard PRO
</h1>

{/* KPI */}

<div className="grid md:grid-cols-6 gap-6 mb-10">

<div className="card">
<h3>Total Events</h3>
<p>{kpi.totalEvents}</p>
</div>

<div className="card">
<h3>Open Tool</h3>
<p>{kpi.openTool}</p>
</div>

<div className="card">
<h3>Buy Click</h3>
<p>{kpi.buyClick}</p>
</div>

<div className="card">
<h3>Tutorial Click</h3>
<p>{kpi.tutorialClick}</p>
</div>

<div className="card">
<h3>Active Users</h3>
<p>{kpi.users}</p>
</div>

<div className="card">
<h3>Conversion</h3>
<p>{kpi.conversion}%</p>
</div>

</div>

{/* TOP TOOLS */}

<div className="bg-zinc-900 p-6 rounded-xl mb-10">

<h2 className="text-xl font-semibold mb-4">
Top Tools
</h2>

{topTools.length === 0 && (
<p className="text-gray-400">No data yet</p>
)}

{topTools.map(t=>(
<div key={t.tool_id} className="flex justify-between border-b border-white/10 py-2">
<span>{t.name}</span>
<span>{t.count} opens</span>
</div>
))}

</div>

{/* TOP USERS */}

<div className="bg-zinc-900 p-6 rounded-xl mb-10">

<h2 className="text-xl font-semibold mb-4">
Top Users
</h2>

{topUsers.length === 0 && (
<p className="text-gray-400">No data yet</p>
)}

{topUsers.map(u=>(
<div key={u.email} className="flex justify-between border-b border-white/10 py-2">
<span>{u.email}</span>
<span>{u.count} actions</span>
</div>
))}

</div>

{/* DAILY */}

<div className="bg-zinc-900 p-6 rounded-xl">

<h2 className="text-xl font-semibold mb-4">
Daily Activity
</h2>

{daily.length === 0 && (
<p className="text-gray-400">No data yet</p>
)}

{daily.map(d=>(
<div key={d.date} className="flex justify-between border-b border-white/10 py-2">
<span>{d.date}</span>
<span>{d.count} events</span>
</div>
))}

</div>

</div>

)

}
