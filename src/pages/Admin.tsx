import React, { useEffect, useState } from "react"
import { supabase } from "../services/supabaseClient"
import { useNavigate } from "react-router-dom"

const ADMIN_EMAILS = [
"wisnuhadi579@gmail.com"
]

export const Admin = () => {

const navigate = useNavigate()

const [licenses,setLicenses] = useState([])
const [stats,setStats] = useState({
users:0,
licenses:0,
premium:0,
vip:0
})

useEffect(()=>{

const session = localStorage.getItem("userSession")

if(!session){
navigate("/login")
return
}

const user = JSON.parse(session)

if(!ADMIN_EMAILS.includes(user.email)){
navigate("/")
return
}

loadData()

},[])

const loadData = async ()=>{

const { data } = await supabase
.from("licenses")
.select("*")

if(!data) return

setLicenses(data)

const uniqueUsers = [...new Set(data.map(l=>l.email))]

const premium = data.filter(l=>l.plan==="premium").length
const vip = data.filter(l=>l.plan==="vip").length

setStats({
users:uniqueUsers.length,
licenses:data.length,
premium,
vip
})

}

return (

<div className="min-h-screen bg-black text-white p-10">

<h1 className="text-3xl font-bold mb-10">
Admin Dashboard
</h1>

{/* STATS */}

<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">

<div className="bg-[#111] p-6 rounded-xl">
<p className="text-gray-400 text-sm">Users</p>
<p className="text-2xl font-bold">{stats.users}</p>
</div>

<div className="bg-[#111] p-6 rounded-xl">
<p className="text-gray-400 text-sm">Licenses</p>
<p className="text-2xl font-bold">{stats.licenses}</p>
</div>

<div className="bg-[#111] p-6 rounded-xl">
<p className="text-gray-400 text-sm">Premium</p>
<p className="text-2xl font-bold text-yellow-400">{stats.premium}</p>
</div>

<div className="bg-[#111] p-6 rounded-xl">
<p className="text-gray-400 text-sm">VIP</p>
<p className="text-2xl font-bold text-purple-400">{stats.vip}</p>
</div>

</div>

{/* TABLE */}

<div className="bg-[#111] rounded-xl overflow-hidden">

<table className="w-full text-sm">

<thead className="bg-[#1a1a1a] text-gray-400">

<tr>
<th className="p-4 text-left">Email</th>
<th className="p-4 text-left">Product</th>
<th className="p-4 text-left">Plan</th>
<th className="p-4 text-left">Status</th>
<th className="p-4 text-left">Date</th>
</tr>

</thead>

<tbody>

{licenses.map((l)=> (

<tr key={l.id} className="border-t border-white/5">

<td className="p-4">{l.email}</td>

<td className="p-4">{l.product}</td>

<td className="p-4">
<span className={
l.plan==="vip"
? "text-purple-400"
: "text-yellow-400"
}>
{l.plan}
</span>
</td>

<td className="p-4">{l.status}</td>

<td className="p-4">
{new Date(l.created_at).toLocaleDateString()}
</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

)

}