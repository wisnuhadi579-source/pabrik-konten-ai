import { useState, useEffect } from "react"
import { supabase } from "../../services/supabaseClient"

export const AdminToolsPro = () => {

const [tools,setTools] = useState<any[]>([])

/* FORM STATE */

const [form,setForm] = useState({

id:"",
product:"",
name:"",
description:"",
plan:"Free",

url:"",
buy_link:"",
tutorial_link:"",

images:[""],
labels:[""],
features:[""],

is_coming_soon:false

})

/* LOAD TOOLS */

useEffect(()=>{

loadTools()

},[])

const loadTools = async()=>{

const {data} = await supabase
.from("tools")
.select("*")
.order("created_at",{ascending:false})

setTools(data || [])

}

/* INPUT CHANGE */

const handleChange = (e:any)=>{

const {name,value,type,checked} = e.target

setForm({

...form,
[name]: type==="checkbox" ? checked : value

})

}

/* ARRAY CHANGE */

const handleArrayChange = (field:string,index:number,value:string)=>{

const arr = [...(form as any)[field]]

arr[index] = value

setForm({...form,[field]:arr})

}

/* ADD ARRAY ITEM */

const addArrayField = (field:string)=>{

const arr = [...(form as any)[field], ""]

setForm({...form,[field]:arr})

}

/* REMOVE ARRAY ITEM */

const removeArrayField = (field:string,index:number)=>{

const arr = [...(form as any)[field]]

arr.splice(index,1)

setForm({...form,[field]:arr})

}

/* CREATE TOOL */

const createTool = async()=>{

await supabase
.from("tools")
.insert([form])

setForm({

id:"",
product:"",
name:"",
description:"",
plan:"Free",

url:"",
buy_link:"",
tutorial_link:"",

images:[""],
labels:[""],
features:[""],

is_coming_soon:false

})

loadTools()

}

return (

<div className="max-w-6xl mx-auto py-14">

<h1 className="text-4xl font-black mb-10">
ADMIN TOOL MANAGER PRO
</h1>

<div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-8">

<h2 className="text-xl font-bold mb-6">
Create Tool
</h2>

<div className="grid grid-cols-2 gap-6">

{/* ID */}

<input
name="id"
placeholder="tool id"
value={form.id}
onChange={handleChange}
className="bg-black border border-white/10 p-3 rounded"
/>

{/* PRODUCT */}

<input
name="product"
placeholder="product id"
value={form.product}
onChange={handleChange}
className="bg-black border border-white/10 p-3 rounded"
/>

{/* NAME */}

<input
name="name"
placeholder="tool name"
value={form.name}
onChange={handleChange}
className="bg-black border border-white/10 p-3 rounded"
/>

{/* PLAN */}

<select
name="plan"
value={form.plan}
onChange={handleChange}
className="bg-black border border-white/10 p-3 rounded"
>

<option>Free</option>
<option>Premium</option>
<option>VIP</option>

</select>

{/* URL */}

<input
name="url"
placeholder="tool url"
value={form.url}
onChange={handleChange}
className="bg-black border border-white/10 p-3 rounded"
/>

{/* BUY LINK */}

<input
name="buy_link"
placeholder="buy link"
value={form.buy_link}
onChange={handleChange}
className="bg-black border border-white/10 p-3 rounded"
/>

{/* TUTORIAL */}

<input
name="tutorial_link"
placeholder="tutorial link"
value={form.tutorial_link}
onChange={handleChange}
className="bg-black border border-white/10 p-3 rounded"
/>

</div>

{/* DESCRIPTION */}

<textarea
name="description"
placeholder="description"
value={form.description}
onChange={handleChange}
className="w-full mt-6 bg-black border border-white/10 p-3 rounded"
/>

{/* IMAGES */}

<div className="mt-8">

<h3 className="font-bold mb-2">Images</h3>

{form.images.map((img,index)=>(

<div key={index} className="flex gap-2 mb-2">

<input
value={img}
placeholder="image url"
onChange={(e)=>handleArrayChange("images",index,e.target.value)}
className="flex-1 bg-black border border-white/10 p-2 rounded"
/>

<button
onClick={()=>removeArrayField("images",index)}
className="px-3 bg-red-600 rounded"
>
X
</button>

</div>

))}

<button
onClick={()=>addArrayField("images")}
className="mt-2 px-4 py-2 bg-yellow-500 text-black rounded"
>
+ Add Image
</button>

</div>

{/* LABELS */}

<div className="mt-8">

<h3 className="font-bold mb-2">Labels</h3>

{form.labels.map((label,index)=>(

<div key={index} className="flex gap-2 mb-2">

<input
value={label}
placeholder="label"
onChange={(e)=>handleArrayChange("labels",index,e.target.value)}
className="flex-1 bg-black border border-white/10 p-2 rounded"
/>

<button
onClick={()=>removeArrayField("labels",index)}
className="px-3 bg-red-600 rounded"
>
X
</button>

</div>

))}

<button
onClick={()=>addArrayField("labels")}
className="mt-2 px-4 py-2 bg-yellow-500 text-black rounded"
>
+ Add Label
</button>

</div>

{/* FEATURES */}

<div className="mt-8">

<h3 className="font-bold mb-2">Features</h3>

{form.features.map((f,index)=>(

<div key={index} className="flex gap-2 mb-2">

<input
value={f}
placeholder="feature"
onChange={(e)=>handleArrayChange("features",index,e.target.value)}
className="flex-1 bg-black border border-white/10 p-2 rounded"
/>

<button
onClick={()=>removeArrayField("features",index)}
className="px-3 bg-red-600 rounded"
>
X
</button>

</div>

))}

<button
onClick={()=>addArrayField("features")}
className="mt-2 px-4 py-2 bg-yellow-500 text-black rounded"
>
+ Add Feature
</button>

</div>

{/* COMING SOON */}

<div className="mt-8 flex items-center gap-3">

<input
type="checkbox"
name="is_coming_soon"
checked={form.is_coming_soon}
onChange={handleChange}
/>

<label>Coming Soon</label>

</div>

<button
onClick={createTool}
className="mt-8 px-6 py-3 bg-yellow-500 text-black rounded-xl font-bold"
>
CREATE TOOL
</button>

</div>

{/* TOOL LIST */}

<div className="mt-12">

<h2 className="text-xl font-bold mb-4">
Tools Database
</h2>

<div className="space-y-2">

{tools.map(tool=>(

<div
key={tool.id}
className="bg-[#0c0c0c] border border-white/10 p-4 rounded"
>

{tool.name}

</div>

))}

</div>

</div>

</div>

)

}
