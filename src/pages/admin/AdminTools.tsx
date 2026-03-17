import React,{useEffect,useState} from "react"
import { getTools,createTool,deleteTool } from "../../services/toolService"

export const AdminTools = () => {

const [tools,setTools] = useState([])
const [loading,setLoading] = useState(true)

const [form,setForm] = useState({
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
})

const load = async () => {

const data = await getTools()

setTools(data)

setLoading(false)

}

useEffect(()=>{

load()

},[])

const handleCreate = async () => {

const tool = {

...form,

images: JSON.parse(form.images || "[]"),
labels: JSON.parse(form.labels || "[]"),
features: JSON.parse(form.features || "[]")

}

await createTool(tool)

setForm({
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
})

load()

}

const handleDelete = async (id:string) => {

if(!confirm("Delete tool?")) return

await deleteTool(id)

load()

}

if(loading) return <div>Loading...</div>

return (

<div className="p-10 text-white">

<h1 className="text-3xl font-bold mb-6">
Admin Tool Manager
</h1>

{/* CREATE TOOL */}

<div className="bg-[#111] p-6 rounded-xl mb-10">

<h2 className="font-bold mb-4">
Add New Tool
</h2>

<div className="grid grid-cols-2 gap-4">

<input
placeholder="id"
value={form.id}
onChange={e=>setForm({...form,id:e.target.value})}
/>

<input
placeholder="name"
value={form.name}
onChange={e=>setForm({...form,name:e.target.value})}
/>

<input
placeholder="product"
value={form.product}
onChange={e=>setForm({...form,product:e.target.value})}
/>

<input
placeholder="plan"
value={form.plan}
onChange={e=>setForm({...form,plan:e.target.value})}
/>

<input
placeholder="url"
value={form.url}
onChange={e=>setForm({...form,url:e.target.value})}
/>

<input
placeholder="buy_link"
value={form.buy_link}
onChange={e=>setForm({...form,buy_link:e.target.value})}
/>

<textarea
placeholder='images JSON ["url1","url2"]'
value={form.images}
onChange={e=>setForm({...form,images:e.target.value})}
/>

<textarea
placeholder='labels JSON ["Creator","Blogger"]'
value={form.labels}
onChange={e=>setForm({...form,labels:e.target.value})}
/>

<textarea
placeholder='features JSON ["Feature 1","Feature 2"]'
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
onClick={handleCreate}
className="mt-4 bg-yellow-500 text-black px-6 py-2 rounded"
>

Create Tool

</button>

</div>

{/* TOOL LIST */}

<div className="bg-[#111] p-6 rounded-xl">

<h2 className="font-bold mb-4">
Tools List
</h2>

<table className="w-full">

<thead>

<tr className="text-left border-b border-white/10">

<th>ID</th>
<th>Name</th>
<th>Plan</th>
<th>Delete</th>

</tr>

</thead>

<tbody>

{tools.map((tool:any)=>(

<tr key={tool.id} className="border-b border-white/5">

<td>{tool.id}</td>
<td>{tool.name}</td>
<td>{tool.plan}</td>

<td>

<button
onClick={()=>handleDelete(tool.id)}
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