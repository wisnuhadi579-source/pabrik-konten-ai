import { useEffect, useState } from "react"
import { supabase } from "../../services/supabaseClient"

export const AdminToolsManager = () => {

const emptyTool = {
id:"",
name:"",
product:"",
description:"",
plan:"Free",
url:"",
buy_link:"",
tutorial_link:"",
images:[""],
labels:[""],
features:[""],
is_coming_soon:false
}

const [tools,setTools] = useState<any[]>([])
const [search,setSearch] = useState("")
const [editing,setEditing] = useState<any | null>(null)

const [form,setForm] = useState<any>(emptyTool)

/* LOAD TOOLS */

const loadTools = async ()=>{

const {data} = await supabase
.from("tools")
.select("*")
.order("created_at",{ascending:false})

setTools(data || [])

}

useEffect(()=>{

loadTools()

},[])

/* HANDLE INPUT */

const handleChange = (field:string,value:any)=>{

setForm({...form,[field]:value})

}

/* ARRAY UPDATE */

const updateArray = (field:string,index:number,value:string)=>{

const copy=[...form[field]]
copy[index]=value
setForm({...form,[field]:copy})

}

const addArray = (field:string)=>{

setForm({...form,[field]:[...form[field],""]})

}

/* CREATE TOOL */

const createTool = async ()=>{

await supabase
.from("tools")
.insert(form)

setForm(emptyTool)

loadTools()

}

/* DELETE TOOL */

const deleteTool = async (id:string)=>{

if(!confirm("Delete tool?")) return

await supabase
.from("tools")
.delete()
.eq("id",id)

loadTools()

}

/* EDIT TOOL */

const startEdit = (tool:any)=>{

setEditing(tool.id)
setForm(tool)

}

const saveEdit = async ()=>{

await supabase
.from("tools")
.update(form)
.eq("id",editing)

setEditing(null)
setForm(emptyTool)

loadTools()

}

/* FILTER */

const filtered = tools.filter(t =>
t.name.toLowerCase().includes(search.toLowerCase())
)

return (

<div className="max-w-7xl mx-auto p-6">

<h1 className="text-3xl font-bold mb-6">
Tools Manager ELITE
</h1>

{/* CREATE / EDIT FORM */}

<div className="bg-zinc-900 border border-white/10 rounded-xl p-6 mb-10">

<h2 className="text-xl font-semibold mb-4">

{editing ? "Edit Tool" : "Create Tool"}

</h2>

<div className="grid md:grid-cols-2 gap-4">

<input
value={form.name}
onChange={e=>handleChange("name",e.target.value)}
placeholder="Tool Name"
className="input"
/>

<input
value={form.product}
onChange={e=>handleChange("product",e.target.value)}
placeholder="Product Slug"
className="input"
/>

<textarea
value={form.description}
onChange={e=>handleChange("description",e.target.value)}
placeholder="Description"
className="input col-span-2"
/>

<select
value={form.plan}
onChange={e=>handleChange("plan",e.target.value)}
className="input"
>
<option>Free</option>
<option>Premium</option>
<option>VIP</option>
</select>

<input
value={form.url}
onChange={e=>handleChange("url",e.target.value)}
placeholder="Tool URL"
className="input"
/>

<input
value={form.buy_link}
onChange={e=>handleChange("buy_link",e.target.value)}
placeholder="Buy Link"
className="input"
/>

<input
value={form.tutorial_link}
onChange={e=>handleChange("tutorial_link",e.target.value)}
placeholder="Tutorial Link"
className="input"
/>

</div>

{/* IMAGES */}

<div className="mt-6">

<h3 className="font-semibold mb-2">Images</h3>

{form.images.map((img:string,i:number)=>(
<input
key={i}
value={img}
onChange={e=>updateArray("images",i,e.target.value)}
placeholder="Image URL"
className="input mb-2"
/>
))}

<button onClick={()=>addArray("images")} className="btn-yellow">
Add Image
</button>

</div>

{/* LABELS */}

<div className="mt-6">

<h3 className="font-semibold mb-2">Labels</h3>

{form.labels.map((label:string,i:number)=>(
<input
key={i}
value={label}
onChange={e=>updateArray("labels",i,e.target.value)}
placeholder="Label"
className="input mb-2"
/>
))}

<button onClick={()=>addArray("labels")} className="btn-yellow">
Add Label
</button>

</div>

{/* FEATURES */}

<div className="mt-6">

<h3 className="font-semibold mb-2">Features</h3>

{form.features.map((f:string,i:number)=>(
<input
key={i}
value={f}
onChange={e=>updateArray("features",i,e.target.value)}
placeholder="Feature"
className="input mb-2"
/>
))}

<button onClick={()=>addArray("features")} className="btn-yellow">
Add Feature
</button>

</div>

<label className="flex gap-2 mt-4">

<input
type="checkbox"
checked={form.is_coming_soon}
onChange={()=>handleChange("is_coming_soon",!form.is_coming_soon)}
/>

Coming Soon

</label>

<button
onClick={editing ? saveEdit : createTool}
className="btn-yellow mt-6"
>

{editing ? "Save Changes" : "Create Tool"}

</button>

</div>

{/* TOOL DATABASE */}

<h2 className="text-xl font-semibold mb-4">
Tools Database
</h2>

<input
value={search}
onChange={e=>setSearch(e.target.value)}
placeholder="Search Tool"
className="input mb-4"
/>

<div className="bg-zinc-900 border border-white/10 rounded-xl">

<table className="w-full text-sm">

<thead className="border-b border-white/10">

<tr className="text-left">

<th className="p-3">Name</th>
<th>Plan</th>
<th>Product</th>
<th>Coming Soon</th>
<th>Created</th>
<th>Action</th>

</tr>

</thead>

<tbody>

{filtered.map(tool=>(
<tr key={tool.id} className="border-b border-white/5">

<td className="p-3">{tool.name}</td>
<td>{tool.plan}</td>
<td>{tool.product}</td>
<td>{tool.is_coming_soon ? "Yes":"No"}</td>
<td>{new Date(tool.created_at).toLocaleDateString()}</td>

<td className="flex gap-2">

<button
onClick={()=>startEdit(tool)}
className="bg-yellow-500 text-black px-3 py-1 rounded text-xs"
>
Edit
</button>

<button
onClick={()=>deleteTool(tool.id)}
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