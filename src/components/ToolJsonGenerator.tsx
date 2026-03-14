import React, { useState } from "react"

export const ToolJsonGenerator: React.FC = () => {

const [tool,setTool] = useState({
name:"",
description:"",
plan:"Free",
url:"",
image1:"",
image2:"",
image3:"",
label1:"",
label2:"",
feature1:"",
feature2:"",
feature3:"",
tutorialLink:"",
singleAccessCode:"",
isComingSoon:false
})

const [jsonOutput,setJsonOutput] = useState("")

const generateJSON = () => {

const id = tool.name
.toLowerCase()
.replace(/[^a-z0-9\s]/g,"")
.replace(/\s+/g,"-")

const json = {
id,
name:tool.name,
description:tool.description,
plan:tool.plan,
url:tool.url,

images:[
tool.image1,
tool.image2,
tool.image3
].filter(Boolean),

labels:[
tool.label1,
tool.label2
].filter(Boolean),

features:[
tool.feature1,
tool.feature2,
tool.feature3
].filter(Boolean),

tutorialLink:tool.tutorialLink || "#",

singleAccessCode:tool.singleAccessCode,

isComingSoon:tool.isComingSoon
}

setJsonOutput(JSON.stringify(json,null,2))

}

const copyJSON = () => {

navigator.clipboard.writeText(jsonOutput)

alert("JSON copied")

}

return (

<div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">

<h3 className="text-xl font-bold">
Tool JSON Generator
</h3>

<input
placeholder="Tool Name"
onChange={(e)=>setTool({...tool,name:e.target.value})}
className="input"
/>

<input
placeholder="Description"
onChange={(e)=>setTool({...tool,description:e.target.value})}
className="input"
/>

<input
placeholder="Tool URL"
onChange={(e)=>setTool({...tool,url:e.target.value})}
className="input"
/>

<select
onChange={(e)=>setTool({...tool,plan:e.target.value})}
className="input"

>

<option>Free</option>
<option>Premium</option>
<option>VIP</option>

</select>

<input placeholder="Image 1" onChange={(e)=>setTool({...tool,image1:e.target.value})} className="input"/>
<input placeholder="Image 2" onChange={(e)=>setTool({...tool,image2:e.target.value})} className="input"/>
<input placeholder="Image 3" onChange={(e)=>setTool({...tool,image3:e.target.value})} className="input"/>

<input placeholder="Label 1" onChange={(e)=>setTool({...tool,label1:e.target.value})} className="input"/>
<input placeholder="Label 2" onChange={(e)=>setTool({...tool,label2:e.target.value})} className="input"/>

<input placeholder="Feature 1" onChange={(e)=>setTool({...tool,feature1:e.target.value})} className="input"/>
<input placeholder="Feature 2" onChange={(e)=>setTool({...tool,feature2:e.target.value})} className="input"/>
<input placeholder="Feature 3" onChange={(e)=>setTool({...tool,feature3:e.target.value})} className="input"/>

<input placeholder="Tutorial Link" onChange={(e)=>setTool({...tool,tutorialLink:e.target.value})} className="input"/>

<input placeholder="Single Access Code" onChange={(e)=>setTool({...tool,singleAccessCode:e.target.value})} className="input"/>

<label className="flex items-center gap-2 text-sm">
<input type="checkbox" onChange={(e)=>setTool({...tool,isComingSoon:e.target.checked})}/>
Coming Soon
</label>

<button
onClick={generateJSON}
className="bg-emerald-500 text-black font-bold w-full py-2 rounded-lg"

>

Generate JSON </button>

{jsonOutput && (

<>

<textarea
value={jsonOutput}
readOnly
className="w-full h-60 bg-black border border-white/10 rounded-lg p-3 text-xs"
/>

<button
onClick={copyJSON}
className="bg-white/10 hover:bg-white/20 w-full py-2 rounded-lg"
>

Copy JSON

</button>

</>

)}

</div>

)

}
