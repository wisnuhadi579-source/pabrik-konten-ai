import { useEffect, useState } from "react"
import { supabase } from "../../services/supabaseClient"

export const AdminUsersManager = () => {

const [users,setUsers] = useState<any[]>([])
const [search,setSearch] = useState("")
const [loading,setLoading] = useState(true)

const [stats,setStats] = useState({
total:0,
free:0,
premium:0,
vip:0
})

/* LOAD USERS */

const loadUsers = async () => {

setLoading(true)

/* GET USERS */

const { data: userData } = await supabase
.from("users")
.select("*")

if(!userData){
setUsers([])
setLoading(false)
return
}

/* GET LICENSES */

const { data: licenseData } = await supabase
.from("licenses")
.select("*")

const grouped:any = {}

userData.forEach((user)=>{

grouped[user.email] = {

email:user.email,
licenses:[],
plans:new Set(),
plan:user.plan || "free"

}

})

if(licenseData){

licenseData.forEach((license)=>{

if(!grouped[license.email]) return

grouped[license.email].licenses.push(license)
grouped[license.email].plans.add(license.plan)

})

}

const usersArray = Object.values(grouped).map((u:any)=>({

email:u.email,
licenseCount:u.licenses.length,
plans:u.licenses.length > 0
? Array.from(u.plans).join(", ")
: "free"

}))

setUsers(usersArray)

/* =========================
CALCULATE STATS
========================= */

const stat = {

total: usersArray.length,

free: usersArray.filter(u => u.plans === "free").length,

premium: usersArray.filter(u => u.plans === "premium").length,

vip: usersArray.filter(u => u.plans === "vip").length

}

setStats(stat)

setLoading(false)

}

useEffect(()=>{

loadUsers()

},[])

/* SEARCH */

const filtered = users.filter(u =>
u.email.toLowerCase().includes(search.toLowerCase())
)

return (

<div className="max-w-7xl mx-auto p-6">

<h1 className="text-3xl font-bold mb-6">
Users Manager
</h1>

{/* =========================
USER STATS
========================= */}

<div className="grid grid-cols-4 gap-4 mb-6">

<div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
<div className="text-xs text-zinc-400">Total Users</div>
<div className="text-2xl font-bold">{stats.total}</div>
</div>

<div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
<div className="text-xs text-zinc-400">Free Users</div>
<div className="text-2xl font-bold">{stats.free}</div>
</div>

<div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
<div className="text-xs text-zinc-400">Premium Users</div>
<div className="text-2xl font-bold">{stats.premium}</div>
</div>

<div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
<div className="text-xs text-zinc-400">VIP Users</div>
<div className="text-2xl font-bold">{stats.vip}</div>
</div>

</div>

{/* SEARCH */}

<input
value={search}
onChange={e=>setSearch(e.target.value)}
placeholder="Search user..."
className="input mb-6"
/>

{/* USERS TABLE */}

<div className="bg-zinc-900 rounded-xl border border-white/10">

<table className="w-full text-sm">

<thead className="border-b border-white/10">

<tr className="text-left">

<th className="p-3">Email</th>
<th>Licenses</th>
<th>Plans</th>

</tr>

</thead>

<tbody>

{filtered.map((user)=>(

<tr key={user.email} className="border-b border-white/5">

<td className="p-3">
{user.email}
</td>

<td>
{user.licenseCount}
</td>

<td>
{user.plans}
</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

)

}
