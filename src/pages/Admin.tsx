import React, { useEffect, useState } from "react"
import { supabase } from "../services/supabaseClient"
import { useNavigate } from "react-router-dom"

const ADMIN_EMAILS = [
  "wisnuhadi579@gmail.com"
]

export const Admin = () => {

  const navigate = useNavigate()

  const [licenses,setLicenses] = useState<any[]>([])
  const [search,setSearch] = useState("")

  const [stats,setStats] = useState({
    users:0,
    licenses:0,
    premium:0,
    vip:0
  })

  const [form,setForm] = useState({
    email:"",
    product:"",
    plan:"premium"
  })

  useEffect(()=>{

    const session = localStorage.getItem("userSession")

    if(!session){
      navigate("/login")
      return
    }

    const user = JSON.parse(session)

    if(!ADMIN_EMAILS.includes(user.email)){
      navigate("/dashboard")
      return
    }

    loadData()

  },[])

  const loadData = async ()=>{

    const { data } = await supabase
      .from("licenses")
      .select("*")
      .order("created_at",{ascending:false})

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

  /* ADD LICENSE */

  const addLicense = async ()=>{

    if(!form.email || !form.product){
      alert("Email dan product wajib diisi")
      return
    }

    await supabase.from("licenses").insert({
      email:form.email,
      product:form.product,
      plan:form.plan,
      status:"active"
    })

    setForm({
      email:"",
      product:"",
      plan:"premium"
    })

    loadData()
  }

  /* DELETE LICENSE */

  const deleteLicense = async (id:string)=>{

    if(!confirm("Hapus license ini?")) return

    await supabase
      .from("licenses")
      .delete()
      .eq("id",id)

    loadData()

  }

  /* FILTER */

  const filtered = licenses.filter(l =>
    l.email.toLowerCase().includes(search.toLowerCase())
  )

  return (

<div className="min-h-screen bg-black text-white p-10">

<h1 className="text-3xl font-bold mb-10">
Admin Control Center
</h1>

{/* STATS */}

<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">

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

{/* ADD LICENSE */}

<div className="bg-[#111] p-6 rounded-xl mb-10">

<h2 className="font-bold mb-4">
Add License
</h2>

<div className="grid md:grid-cols-4 gap-4">

<input
placeholder="email"
value={form.email}
onChange={e=>setForm({...form,email:e.target.value})}
className="bg-black border border-white/10 p-2 rounded"
/>

<input
placeholder="product (ex: car-restoration)"
value={form.product}
onChange={e=>setForm({...form,product:e.target.value})}
className="bg-black border border-white/10 p-2 rounded"
/>

<select
value={form.plan}
onChange={e=>setForm({...form,plan:e.target.value})}
className="bg-black border border-white/10 p-2 rounded"
>
<option value="premium">premium</option>
<option value="vip">vip</option>
</select>

<button
onClick={addLicense}
className="bg-yellow-500 text-black font-bold rounded"
>
Add
</button>

</div>

</div>

{/* SEARCH */}

<input
placeholder="Search email..."
value={search}
onChange={e=>setSearch(e.target.value)}
className="bg-[#111] border border-white/10 p-3 rounded mb-6 w-full"
/>

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
<th className="p-4 text-left">Action</th>
</tr>

</thead>

<tbody>

{filtered.map(l => (

<tr key={l.id} className="border-t border-white/5">

<td className="p-4">{l.email}</td>

<td className="p-4">{l.product}</td>

<td className="p-4">{l.plan}</td>

<td className="p-4">{l.status}</td>

<td className="p-4">
{new Date(l.created_at).toLocaleDateString()}
</td>

<td className="p-4">

<button
onClick={()=>deleteLicense(l.id)}
className="bg-red-600 px-3 py-1 rounded"
>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

  )

}
