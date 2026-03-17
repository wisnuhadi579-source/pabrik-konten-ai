import React,{useEffect,useState} from "react"
import { supabase } from "../../services/supabaseClient"

export const AdminToolsElite = () => {

const [tools,setTools] = useState<any[]>([])
const [editing,setEditing] = useState<string | null>(null)

const emptyForm = {
id:"",
name:"",
product:"",
description:"",
plan:"Free",
url:"",
buy_link:"",
tutorial_link:"",
is_coming_soon:false,
images:[],
labels:[],
features:[]
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
...form
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
images: tool.images || [],
labels: tool.labels || [],
features: tool.features || []
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

/* ADD ITEMS */

const addImage = () => {
setForm({...form,images:[...form.images,""]})
}

const addLabel = () => {
setForm({...form,labels:[...form.labels,""]})
}

const addFeature = () => {
setForm({...form,features:[...form.features,""]})
}

/* UPDATE ARRAY ITEMS */

const updateImage = (value:string,index:number)=>{
const arr=[...form.images]
arr[index]=value
setForm({...form,images:arr})
}

const updateLabel = (value:string,index:number)=>{
const arr=[...form.labels]
arr[index]=value
setForm({...form,labels:arr})
}

const updateFeature = (value:string,index:number)=>{
const arr=[...form.features]
arr[index]=value
setForm({...form,features:arr})
}

return (

<div className="min-h-screen bg-black text-white p-10">

<h1 className="text-3xl font-bold mb-8">
ADMIN TOOL MANAGER ELITE
</h1>

<div className="grid grid-cols-2 gap-10">

{/* LEFT SIDE FORM */}

<div className="bg-[#111] p-6 rounded-xl">

<h2 className="text-xl font-semibold mb-6">
{editing ? "Edit Tool" : "Create Tool"}
</h2>

<input
className="w-full mb-3 p-2 bg-black border"
placeholder="Tool ID"
value={form.id}
onChange={e=>setForm({...form,id:e.target.value})}
/>

<input
className="w-full mb-3 p-2 bg-black border"
placeholder="Tool Name"
value={form.name}
onChange={e=>setForm({...form,name:e.target.value})}
/>

<input
className="w-full mb-3 p-2 bg-black border"
placeholder="Product ID"
value={form.product}
onChange={e=>setForm({...form,product:e.target.value})}
/>

<input
className="w-full mb-3 p-2 bg-black border"
placeholder="Plan (Free/Premium/VIP)"
value={form.plan}
onChange={e=>setForm({...form,plan:e.target.value})}
/>

<input
className="w-full mb-3 p-2 bg-black border"
placeholder="Tool URL"
value={form.url}
onChange={e=>setForm({...form,url:e.target.value})}
/>

<input
className="w-full mb-3 p-2 bg-black border"
placeholder="Buy Link"
value={form.buy_link}
onChange={e=>setForm({...form,buy_link:e.target.value})}
/>

<textarea
className="w-full mb-3 p-2 bg-black border"
placeholder="Description"
value={form.description}
onChange={e=>setForm({...form,description:e.target.value})}
/>

{/* IMAGES */}

<h3 className="mt-4 font-semibold">Images</h3>

{form.images.map((img:any,i:number)=>(

<input
key={i}
className="w-full mb-2 p-2 bg-black border"
placeholder="Image URL"
value={img}
onChange={e=>updateImage(e.target.value,i)}
/>

))}

<button
onClick={addImage}
className="bg-gray-700 px-3 py-1 rounded mb-4"
>
+ Add Image
</button>

{/* LABELS */}

<h3 className="font-semibold">Labels</h3>

{form.labels.map((lab:any,i:number)=>(

<input
key={i}
className="w-full mb-2 p-2 bg-black border"
placeholder="Label"
value={lab}
onChange={e=>updateLabel(e.target.value,i)}
/>

))}

<button
onClick={addLabel}
className="bg-gray-700 px-3 py-1 rounded mb-4"
>
+ Add Label
</button>

{/* FEATURES */}

<h3 className="font-semibold">Features</h3>

{form.features.map((f:any,i:number)=>(

<input
key={i}
className="w-full mb-2 p-2 bg-black border"
placeholder="Feature"
value={f}
onChange={e=>updateFeature(e.target.value,i)}
/>

))}

<button
onClick={addFeature}
className="bg-gray-700 px-3 py-1 rounded"
>
+ Add Feature
</button>

<button
onClick={saveTool}
className="mt-6 w-full bg-yellow-500 text-black py-2 rounded"
>
{editing ? "UPDATE TOOL" : "CREATE TOOL"}
</button>

</div>

{/* RIGHT SIDE PREVIEW */}

<div>

<h2 className="text-xl font-semibold mb-4">
Tool Preview
</h2>

<div className="rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/25 p-4">

{form.images[0] && (

<img
src={form.images[0]}
className="w-full h-40 object-cover rounded-xl mb-4"
/>

)}

<div className="flex gap-2 mb-2">

{form.labels.map((l:any,i:number)=>(

<span
key={i}
className="bg-yellow-500 text-black text-xs px-2 py-1 rounded"
>

{l}

</span>

))}

</div>

<h3 className="font-bold text-lg text-yellow-400">
{form.name || "Tool Name"}
</h3>

<p className="text-sm text-gray-400 mb-3">
{form.description || "Tool description"}
</p>

<div className="space-y-2">

{form.features.map((f:any,i:number)=>(

<div
key={i}
className="bg-[#151515] border border-white/10 p-2 rounded"
>

{f}

</div>

))}

</div>

</div>

</div>

</div>

</div>

)

}
