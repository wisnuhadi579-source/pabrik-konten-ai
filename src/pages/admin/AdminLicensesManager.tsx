import { useEffect, useState } from "react"
import { supabase } from "../../services/supabaseClient"

export const AdminLicensesManager = () => {

const [licenses,setLicenses] = useState<any[]>([])
const [loading,setLoading] = useState(true)

const [search,setSearch] = useState("")

const [email,setEmail] = useState("")
const [product,setProduct] = useState("")
const [plan,setPlan] = useState("single")

/* LOAD LICENSES */

const loadLicenses = async () => {

setLoading(true)

const { data } = await supabase
.from("licenses")
.select("*")
.order("created_at",{ascending:false})

setLicenses(data || [])

setLoading(false)

}

useEffect(()=>{

loadLicenses()

},[])

/* ADD LICENSE */

const addLicense = async ()=>{

if(!email || !product){
alert("Email & product required")
return
}

await supabase
.from("licenses")
.insert({

email,
product,
plan,
status:"active"

})

setEmail("")
setProduct("")
setPlan("single")

loadLicenses()

}

/* DELETE LICENSE */

const deleteLicense = async (id:string)=>{

if(!confirm("Delete license?")) return

await supabase
.from("licenses")
.delete()
.eq("id",id)

loadLicenses()

}

/* FILTER */

const filtered = licenses.filter(l =>
l.email.toLowerCase().includes(search.toLowerCase())
)

return (

<div className="max-w-7xl mx-auto p-6">

<h1 className="text-3xl font-bold mb-6">
License Manager
</h1>

{/* ADD LICENSE */}

<div className="bg-zinc-900 border border-white/10 rounded-xl p-6 mb-10">

<h2 className="text-xl font-semibold mb-4">
Add License
</h2>

<div className="grid md:grid-cols-4 gap-4">

<input
value={email}
onChange={e=>setEmail(e.target.value)}
placeholder="User Email"
className="input"
/>

<input
value={product}
onChange={e=>setProduct(e.target.value)}
placeholder="Product (ex: car-restoration)"
className="input"
/>

<select
value={plan}
onChange={(e)=>setPlan(e.target.value)}
className="input"
>
<option value="single">Single</option>
<option value="premium">Premium</option>
<option value="vip">VIP</option>
</select>
<button
onClick={addLicense}
className="btn-yellow"
>
Add License
</button>

</div>

</div>

{/* SEARCH */}

<input
value={search}
onChange={e=>setSearch(e.target.value)}
placeholder="Search email..."
className="input mb-4"
/>

{/* LICENSE TABLE */}

<div className="bg-zinc-900 rounded-xl border border-white/10">

<table className="w-full text-sm">

<thead className="border-b border-white/10">

<tr className="text-left">

<th className="p-3">Email</th>
<th>Product</th>
<th>Plan</th>
<th>Status</th>
<th>Date</th>
<th>Action</th>

</tr>

</thead>

<tbody>

{filtered.map(l=>(
<tr key={l.id} className="border-b border-white/5">

<td className="p-3">{l.email}</td>
<td>{l.product}</td>
<td>{l.plan}</td>
<td>{l.status}</td>
<td>{new Date(l.created_at).toLocaleDateString()}</td>

<td>

<button
onClick={()=>deleteLicense(l.id)}
className="bg-red-600 px-3 py-1 rounded text-xs"
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