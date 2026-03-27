import { useEffect, useState } from "react"
import { supabase } from "../../services/supabaseClient"

export const AdminToolsManager = () => {

const emptyForm = {
name: "",
description: "",
plan: "free",
product: "",
images: [""],
labels: [""],
features: [""],
coming_soon: false
}

const [tools,setTools] = useState<any[]>([])
const [form,setForm] = useState<any>(emptyForm)
const [editing,setEditing] = useState<string | null>(null)

/* ================= LOAD ================= */

const loadTools = async ()=>{

const { data } = await supabase
.from("tools")
.select("*")
.order("created_at",{ascending:false})

setTools(data || [])

}

useEffect(()=>{

loadTools()

},[])

/* ================= SAFE ARRAY ================= */

const safeArray = (arr:any)=>{
if(!arr) return [""]
if(Array.isArray(arr)) return arr.length ? arr : [""]
return [""]
}

/* ================= START EDIT ================= */

const startEdit = (tool:any)=>{

setEditing(tool.id)

setForm({
name: tool.name || "",
description: tool.description || "",
plan: (tool.plan || "free").toLowerCase(),
product: tool.product || "",
images: safeArray(tool.images),
labels: safeArray(tool.labels),
features: safeArray(tool.features),
coming_soon: tool.coming_soon || false
})

}

/* ================= HANDLE ================= */

const handleChange = (e:any)=>{

const { name,value,type,checked } = e.target

setForm((prev:any)=>({
...prev,
[name]: type === "checkbox"
? checked
: (value || "").toLowerCase()
}))

}

/* ================= ARRAY ================= */

const handleArrayChange = (field:string,index:number,value:string)=>{

const updated = [...form[field]]
updated[index] = value || ""

setForm({
...form,
[field]: updated
})

}

const addField = (field:string)=>{

setForm({
...form,
[field]: [...form[field],""]
})

}

/* ================= SAVE ================= */

const saveTool = async ()=>{

const payload = {
...form,
plan: form.plan.toLowerCase()
}

if(editing){

await supabase
.from("tools")
.update(payload)
.eq("id",editing)

}else{

await supabase
.from("tools")
.insert([payload])

}

setForm(emptyForm)
setEditing(null)
loadTools()

}

/* ================= DELETE ================= */

const deleteTool = async (id:string)=>{

await supabase
.from("tools")
.delete()
.eq("id",id)

loadTools()

}

/* ================= UI ================= */

return (

<div className="max-w-7xl mx-auto p-6">

<h1 className="text-3xl font-bold mb-6">
Tools Manager
</h1>

{/* FORM */}

<div className="bg-zinc-900 p-6 rounded-xl mb-10 space-y-3">

<input
name="name"
value={form.name}
onChange={handleChange}
placeholder="Tool Name"
className="input"
/>

<input
name="description"
value={form.description}
onChange={handleChange}
placeholder="Description"
className="input"
/>

<input
name="product"
value={form.product}
onChange={handleChange}
placeholder="Product slug"
className="input"
/>

<select
name="plan"
value={form.plan}
onChange={handleChange}
className="input"
>
<option value="free">Free</option>
<option value="premium">Premium</option>
<option value="vip">VIP</option>
</select>

<label className="flex items-center gap-2">
<input
type="checkbox"
name="coming_soon"
checked={form.coming_soon}
onChange={handleChange}
/>
Coming Soon
</label>

{/* IMAGES */}

<div>
<p className="text-sm mb-1">Images</p>
{form.images.map((img:any,i:number)=>(
<input
key={i}
value={img}
onChange={(e)=>handleArrayChange("images",i,e.target.value)}
className="input mb-1"
/>
))}
<button onClick={()=>addField("images")} className="text-xs text-yellow-400">
+ Add Image
</button>
</div>

{/* LABELS */}

<div>
<p className="text-sm mb-1">Labels</p>
{form.labels.map((l:any,i:number)=>(
<input
key={i}
value={l}
onChange={(e)=>handleArrayChange("labels",i,e.target.value)}
className="input mb-1"
/>
))}
<button onClick={()=>addField("labels")} className="text-xs text-yellow-400">
+ Add Label
</button>
</div>

{/* FEATURES */}

<div>
<p className="text-sm mb-1">Features</p>
{form.features.map((f:any,i:number)=>(
<input
key={i}
value={f}
onChange={(e)=>handleArrayChange("features",i,e.target.value)}
className="input mb-1"
/>
))}
<button onClick={()=>addField("features")} className="text-xs text-yellow-400">
+ Add Feature
</button>
</div>

<button onClick={saveTool} className="btn mt-3">
{editing ? "Save Changes" : "Create Tool"}
</button>

</div>

{/* TABLE */}

<div className="bg-zinc-900 p-6 rounded-xl">

<h2 className="text-xl mb-4">Tools Database</h2>

<table className="w-full text-sm">

<thead>
<tr>
<th>Name</th>
<th>Plan</th>
<th>Product</th>
<th>Coming Soon</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{tools.map(t=>(

<tr key={t.id}>

<td>{t.name}</td>
<td>{t.plan}</td>
<td>{t.product}</td>
<td>{t.coming_soon ? "Yes":"No"}</td>

<td className="flex gap-2">

<button onClick={()=>startEdit(t)} className="btn-yellow">
Edit
</button>

<button onClick={()=>deleteTool(t.id)} className="btn-red">
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