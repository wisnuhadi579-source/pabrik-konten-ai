import React,{useEffect,useState} from "react"
import { supabase } from "../../services/supabaseClient"

export const AdminToolsPro = () => {

const [tools,setTools] = useState<any[]>([])
const [editing,setEditing] = useState<any>(null)

const emptyForm = {
id:"",
name:"",
product:"",
description:"",
plan:"Free",
url:"",
buy_link:"",
images:"",
labels:"",
features:"",
tutorial_link:"",
is_coming_soon:false
}

const [form,setForm] = useState<any>(emptyForm)

const loadTools = async () => {

const {data} = await supabase
.from("tools")
.select("*")
.order("created_at",{ascending:false})

setTools(data || [])

}

useEffect(()=>{

loadTools()

},[])

/* SAVE TOOL */

const saveTool = async () => {

const payload = {

...form,

images: JSON.parse(form.images || "[]"),
labels: JSON.parse(form.labels || "[]"),
features: JSON.parse(form.features || "[]")

}

if(editing){

await supabase
.from("tools")
.update(payload)
.eq("id",editing)

}else{

await supabase
.from("tools")
.insert(payload)

}

setForm(emptyForm)
setEditing(null)

loadTools()

}

/* EDIT TOOL */

const editTool = (tool:any) => {

setEditing(tool.id)

setForm({

...tool,

images: JSON.stringify(tool.images || []),
labels: JSON.stringify(tool.labels || []),
features: JSON.stringify(tool.features || [])

})

}

/* DELETE TOOL */

const deleteTool = async (id:string) => {

if(!confirm("Delete tool?")) return

await supabase
.from("tools")
.delete()
.eq("id",id)

loadTools()

}

return (

<div className="min-h-screen bg-black text-white p-10">

<h1 className="text-3xl font-bold mb-8">
ADMIN TOOL MANAGER PRO
</h1>

{/* FORM */}

<div className="bg-[#111] p-6 rounded-xl mb-12">

<h2 className="text-xl font-semibold mb-6">
{editing ? "Edit Tool" : "Create Tool"}
</h2>

<div className="grid grid-cols-2 gap-4">

<input placeholder="id"
value={form.id}
onChange={e=>setForm({...form,id:e.target.value})}
/>

<input placeholder="name"
value={form.name}
onChange={e=>setForm({...form,name:e.target.value})}
/>

<input placeholder="product"
value={form.product}
onChange={e=>setForm({...form,product:e.target.value})}
/>

<input placeholder="plan (Free / Premium / VIP)"
value={form.plan}
onChange={e=>setForm({...form,plan:e.target.value})}
/>

<input placeholder="tool url"
value={form.url}
onChange={e=>setForm({...form,url:e.target.value})}
/>

<input placeholder="buy link"
value={form.buy_link}
onChange={e=>setForm({...form,buy_link:e.target.value})}
/>

<textarea
placeholder='images JSON ["url1","url2"]'
value={form.images}
onChange={e=>setForm({...form,images:e.target.value})}
/>

<textarea
placeholder='labels JSON ["Creator","Designer"]'
value={form.labels}
onChange={e=>setForm({...form,labels:e.target.value})}
/>

<textarea
placeholder='features JSON ["Feature A","Feature B"]'
value={form.features}
onChange={e=>setForm({...form,features:e.target.value})}
/>

<textarea
placeholder="description"
value={form.description}
onChange={e=>setForm({...form,description:e.target.value})}
/>

</div>

<button
onClick={saveTool}
className="mt-6 bg-yellow-500 text-black px-6 py-2 rounded"
>

{editing ? "UPDATE TOOL" : "CREATE TOOL"}

</button>

</div>

{/* TOOL TABLE */}

<div className="bg-[#111] p-6 rounded-xl">

<h2 className="text-xl font-semibold mb-4">
Tools
</h2>

<table className="w-full">

<thead>

<tr className="border-b border-white/10">

<th className="text-left">ID</th>
<th className="text-left">Name</th>
<th className="text-left">Plan</th>
<th>Edit</th>
<th>Delete</th>

</tr>

</thead>

<tbody>

{tools.map(tool=>(

<tr key={tool.id} className="border-b border-white/5">

<td>{tool.id}</td>
<td>{tool.name}</td>
<td>{tool.plan}</td>

<td>

<button
onClick={()=>editTool(tool)}
className="bg-blue-500 px-3 py-1 rounded"
>

Edit

</button>

</td>

<td>

<button
onClick={()=>deleteTool(tool.id)}
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