import { useEffect, useState } from "react"
import { supabase } from "../../services/supabaseClient"

export const AdminAnalytics = () => {

const [stats,setStats] = useState({

tools:0,
freeTools:0,
premiumTools:0,
vipTools:0,

licenses:0,
premiumUsers:0,
vipUsers:0,

/* 🔥 NEW */
revenue:0,
orders:0,
avgOrder:0,
topProduct:"-"

})

/* LOAD ANALYTICS */

const loadAnalytics = async () => {

const { data:tools } = await supabase
.from("tools")
.select("*")

const { data:licenses } = await supabase
.from("licenses")
.select("*")

const { data:payments } = await supabase
.from("payments")
.select("*")

/* =========================
   TOOLS
========================= */

const toolsCount = tools?.length || 0

const freeTools = tools?.filter(t => t.plan === "Free").length || 0
const premiumTools = tools?.filter(t => t.plan === "Premium").length || 0
const vipTools = tools?.filter(t => t.plan === "VIP").length || 0

/* =========================
   LICENSES
========================= */

const licensesCount = licenses?.length || 0

const premiumUsers = licenses?.filter(l => l.plan === "premium").length || 0
const vipUsers = licenses?.filter(l => l.plan === "vip").length || 0

/* =========================
   💰 PAYMENTS ANALYTICS
========================= */

const orders = payments?.length || 0

const revenue = payments?.reduce((acc, p) => {
return acc + (p.amount || 0)
},0) || 0

const avgOrder = orders > 0 ? Math.round(revenue / orders) : 0

/* 🔥 TOP PRODUCT */

const productMap:any = {}

payments?.forEach(p=>{
if(!productMap[p.product]) productMap[p.product] = 0
productMap[p.product]++
})

let topProduct = "-"

if(Object.keys(productMap).length > 0){
topProduct = Object.entries(productMap)
.sort((a:any,b:any)=>b[1]-a[1])[0][0]
}

/* ========================= */

setStats({

tools:toolsCount,
freeTools,
premiumTools,
vipTools,

licenses:licensesCount,
premiumUsers,
vipUsers,

/* NEW */
revenue,
orders,
avgOrder,
topProduct

})

}

useEffect(()=>{

loadAnalytics()

},[])

return (

<div className="max-w-7xl mx-auto p-6">

<h1 className="text-3xl font-bold mb-8">
Platform Analytics
</h1>

{/* TOOLS */}

<h2 className="text-xl font-semibold mb-4">
Tools Statistics
</h2>

<div className="grid md:grid-cols-4 gap-6 mb-10">

<div className="card">
<h3>Total Tools</h3>
<p>{stats.tools}</p>
</div>

<div className="card">
<h3>Free Tools</h3>
<p>{stats.freeTools}</p>
</div>

<div className="card">
<h3>Premium Tools</h3>
<p>{stats.premiumTools}</p>
</div>

<div className="card">
<h3>VIP Tools</h3>
<p>{stats.vipTools}</p>
</div>

</div>

{/* LICENSES */}

<h2 className="text-xl font-semibold mb-4">
License Statistics
</h2>

<div className="grid md:grid-cols-3 gap-6 mb-10">

<div className="card">
<h3>Total Licenses</h3>
<p>{stats.licenses}</p>
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

{/* 🔥 NEW SECTION (TAMBAHAN DATA TANPA UBAH STYLE) */}

<h2 className="text-xl font-semibold mb-4">
Revenue Analytics
</h2>

<div className="grid md:grid-cols-4 gap-6">

<div className="card">
<h3>Total Revenue</h3>
<p>Rp {stats.revenue.toLocaleString()}</p>
</div>

<div className="card">
<h3>Total Orders</h3>
<p>{stats.orders}</p>
</div>

<div className="card">
<h3>Avg Order</h3>
<p>Rp {stats.avgOrder.toLocaleString()}</p>
</div>

<div className="card">
<h3>Top Product</h3>
<p>{stats.topProduct}</p>
</div>

</div>

</div>

)

}