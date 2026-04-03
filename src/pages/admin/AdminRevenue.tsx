import { useEffect, useState } from "react"
import { supabase } from "../../services/supabaseClient"

export const AdminRevenue = () => {

const [loading,setLoading] = useState(true)

const [kpi,setKpi] = useState({
totalRevenue:0,
todayRevenue:0,
premiumUsers:0,
vipUsers:0
})

const [byPlan,setByPlan] = useState<any[]>([])
const [daily,setDaily] = useState<any[]>([])

/* 💰 PRICE CONFIG */
const PRICE = {
single:49000,
premium:99000,
vip:199000
}

const loadRevenue = async () => {

setLoading(true)

const { data:licenses } = await supabase
.from("licenses")
.select("*")

/* =====================
   TOTAL REVENUE
===================== */

let totalRevenue = 0
let todayRevenue = 0

let premiumUsers = 0
let vipUsers = 0

const today = new Date().toLocaleDateString()

licenses?.forEach(l => {

const plan = l.plan?.toLowerCase()

const price = PRICE[plan] || 0

totalRevenue += price

const date = new Date(l.created_at).toLocaleDateString()

if(date === today){
todayRevenue += price
}

if(plan === "premium") premiumUsers++
if(plan === "vip") vipUsers++

})

setKpi({
totalRevenue,
todayRevenue,
premiumUsers,
vipUsers
})

/* =====================
   REVENUE BY PLAN
===================== */

const planMap:any = {}

licenses?.forEach(l=>{

const plan = l.plan?.toLowerCase()
const price = PRICE[plan] || 0

planMap[plan] = (planMap[plan] || 0) + price

})

const planArr = Object.entries(planMap)
.map(([plan,total])=>({plan,total}))

setByPlan(planArr)

/* =====================
   DAILY REVENUE
===================== */

const dayMap:any = {}

licenses?.forEach(l=>{

const date = new Date(l.created_at).toLocaleDateString()
const price = PRICE[l.plan?.toLowerCase()] || 0

dayMap[date] = (dayMap[date] || 0) + price

})

const dailyArr = Object.entries(dayMap)
.map(([date,total])=>({date,total}))
.sort((a:any,b:any)=> new Date(a.date).getTime() - new Date(b.date).getTime())

setDaily(dailyArr)

setLoading(false)

}

useEffect(()=>{
loadRevenue()
},[])

/* FORMAT RUPIAH */
const format = (n:number) => {
return "Rp " + n.toLocaleString("id-ID")
}

return (

<div className="max-w-7xl mx-auto p-6">

<h1 className="text-3xl font-bold mb-8">
Revenue Dashboard 💰
</h1>

{/* KPI */}

<div className="grid md:grid-cols-4 gap-6 mb-10">

<div className="card">
<h3>Total Revenue</h3>
<p>{format(kpi.totalRevenue)}</p>
</div>

<div className="card">
<h3>Today Revenue</h3>
<p>{format(kpi.todayRevenue)}</p>
</div>

<div className="card">
<h3>Premium Users</h3>
<p>{kpi.premiumUsers}</p>
</div>

<div className="card">
<h3>VIP Users</h3>
<p>{kpi.vipUsers}</p>
</div>

</div>

{/* REVENUE BY PLAN */}

<div className="bg-zinc-900 p-6 rounded-xl mb-10">

<h2 className="text-xl font-semibold mb-4">
Revenue by Plan
</h2>

{byPlan.map(p=>(
<div key={p.plan} className="flex justify-between border-b border-white/10 py-2">
<span>{p.plan}</span>
<span>{format(p.total)}</span>
</div>
))}

</div>

{/* DAILY */}

<div className="bg-zinc-900 p-6 rounded-xl">

<h2 className="text-xl font-semibold mb-4">
Daily Revenue
</h2>

{daily.map(d=>(
<div key={d.date} className="flex justify-between border-b border-white/10 py-2">
<span>{d.date}</span>
<span>{format(d.total)}</span>
</div>
))}

</div>

</div>

)

}