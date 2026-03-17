import { useEffect, useState } from "react"
import { supabase } from "../../services/supabaseClient"

export const AdminUsersManager = () => {

const [users,setUsers] = useState<any[]>([])
const [search,setSearch] = useState("")
const [loading,setLoading] = useState(true)

/* LOAD USERS */

const loadUsers = async () => {

setLoading(true)

const { data } = await supabase
.from("licenses")
.select("*")

if(!data){
setUsers([])
setLoading(false)
return
}

/* GROUP BY EMAIL */

const grouped:any = {}

data.forEach((license)=>{

if(!grouped[license.email]){

grouped[license.email] = {

email:license.email,
licenses:[],
plans:new Set()

}

}

grouped[license.email].licenses.push(license)
grouped[license.email].plans.add(license.plan)

})

const usersArray = Object.values(grouped).map((u:any)=>({

email:u.email,
licenseCount:u.licenses.length,
plans:Array.from(u.plans).join(", ")

}))

setUsers(usersArray)

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