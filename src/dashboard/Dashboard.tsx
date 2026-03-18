import React, { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import fallbackTools from "../config/tools.json"
import { supabase } from "../services/supabaseClient"
import { Search, ChevronDown, ChevronRight, Play } from "lucide-react"

const TOOL_CATEGORIES = [
"Semua Tools",
"Creator",
"Affiliator",
"Influencer",
"Seller",
"Vlogger",
"Blogger",
"Designer",
"Fotografer",
"Videografer"
]

/* IMAGE SLIDER */

const ImageSlider = ({ images }) => {

const [index,setIndex] = useState(0)

useEffect(()=>{

if(!images || images.length <=1) return

const timer = setInterval(()=>{
setIndex(prev => (prev+1) % images.length)
},3000)

return ()=>clearInterval(timer)

},[images])

return (

<div className="relative w-full h-full overflow-hidden">

{images?.map((img,i)=>(

<img
key={i}
src={img}
className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
i===index ? "opacity-100" : "opacity-0"
}`}
/>

))}

<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"/>

</div>

)

}

export const Dashboard = () => {

const navigate = useNavigate()

/* STATES */

const [isLoggedIn,setIsLoggedIn] = useState(false)
const [loading,setLoading] = useState(true)
const [licenses,setLicenses] = useState([])
const [tools,setTools] = useState([])

const [search,setSearch] = useState("")
const [filterOpen,setFilterOpen] = useState(false)
const [activeCategory,setActiveCategory] = useState("Semua Tools")
const [openCard,setOpenCard] = useState(null)
const [popup,setPopup] = useState(null)

/* SESSION CHECK */

useEffect(()=>{

const session = localStorage.getItem("userSession")

if(!session){
navigate("/login?mode=login")
}else{
setIsLoggedIn(true)
}

setLoading(false)

},[navigate])

/* LOAD LICENSES */

useEffect(()=>{

const loadLicenses = async ()=>{

const session = localStorage.getItem("userSession")
if(!session) return

const user = JSON.parse(session)

const { data } = await supabase
.from("licenses")
.select("product,plan")
.eq("email", user.email)

setLicenses(data || [])

}

loadLicenses()

},[])

/* LOAD TOOLS FROM SUPABASE */

useEffect(()=>{

const loadTools = async ()=>{

const { data } = await supabase
.from("tools")
.select("*")

if(!data || data.length === 0){
setTools(fallbackTools)
return
}

const formatted = data.map(tool => ({
...tool,
buyLink: tool.buy_link,
tutorialLink: tool.tutorial_link,
isComingSoon: tool.is_coming_soon
}))

setTools(formatted)

}

loadTools()

},[])

/* FILTER TOOLS */

const filtered = useMemo(()=>{

return tools.filter(tool=>{

const matchSearch =
tool.name.toLowerCase().includes(search.toLowerCase())

const matchCategory =
activeCategory==="Semua Tools" ||
tool.labels?.includes(activeCategory)

return matchSearch && matchCategory

})

},[search,activeCategory,tools])

/* LICENSE ENGINE */

const licenseProducts = useMemo(()=>{

const set = new Set()

licenses.forEach(l=>{
if(l?.product){
set.add(l.product)
}
})

return set

},[licenses])

const isPurchased = (tool)=>{

const productId = tool.product || tool.id

if(tool.plan==="Free") return true

if(licenseProducts.has("vip-all")) return true

if(
licenseProducts.has("premium-all") &&
tool.plan === "Premium"
){
return true
}

if(licenseProducts.has(productId)) return true

return false

}

/* TRACK TOOL OPEN */

const trackOpen = async (tool) => {

try{

const session = localStorage.getItem("userSession")

if(!session) return

const user = JSON.parse(session)

await supabase.from("tool_events").insert({

tool_id: tool.id,
user_email: user.email,
event_type: "open_tool"

})

}catch(e){

console.error("Analytics error",e)

}

}

/* OPEN TOOL WITH TOKEN */

const openTool = async (tool) => {

try{

const session = localStorage.getItem("userSession")
if(!session) return

const user = JSON.parse(session)

const res = await fetch("/functions/generate-token",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email:user.email,
product:tool.product || tool.id
})
})

const data = await res.json()

if(!data.token){
alert("Access denied")
return
}

const url = `${tool.url}?token=${data.token}`

window.open(url)

}catch(err){

console.error("Token error",err)

}

}

if(loading) return null
if(!isLoggedIn) return null

return (

<div className="min-h-screen bg-black text-white relative overflow-hidden">

<div className="absolute left-1/2 top-[450px] -translate-x-1/2 w-[900px] h-[400px] bg-yellow-500/10 blur-[200px] pointer-events-none"></div>

<div className="text-center mt-14 mb-10">

<h1 className="text-3xl md:text-4xl font-black tracking-tight">
Build Content Faster With
<span className="text-yellow-400"> AI Tools</span>
</h1>

<p className="text-zinc-500 text-sm mt-3 max-w-xl mx-auto">
Creator, Affiliator, dan Digital Builder dapat membuat konten,
iklan, dan automation lebih cepat dengan sistem AI terintegrasi.
</p>

</div>

<div className="flex justify-center">

<div className="w-[420px] relative">

<Search className="absolute left-3 top-3 w-4 h-4 text-gray-500"/>

<input
value={search}
onChange={e=>setSearch(e.target.value)}
placeholder="Cari fitur..."
className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl pl-9 py-2 focus:border-yellow-500"
/>

</div>

</div>

<div className="flex justify-center mt-4 gap-3 relative">

<button
onClick={()=>setFilterOpen(!filterOpen)}
className="bg-[#111] border border-white/10 px-6 py-2 rounded-xl text-xs uppercase tracking-widest hover:border-yellow-400 transition"

>

FILTER TOOLS ▾ </button>

<div className="bg-yellow-500 text-black px-6 py-2 rounded-xl text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(255,215,0,0.35)]">
{activeCategory}
</div>

{filterOpen && (

<div className="absolute top-full mt-2 w-48 bg-[#0c0c0c] border border-white/10 rounded-xl shadow-xl z-50">

{TOOL_CATEGORIES.map(cat => (

<div
key={cat}
onClick={()=>{
setActiveCategory(cat)
setFilterOpen(false)
}}
className={`px-4 py-2 text-xs cursor-pointer uppercase tracking-widest hover:bg-white/5 transition ${
activeCategory===cat ? "text-yellow-400 font-semibold" : "text-gray-400"
}`}
>
{cat}
</div>

))}

</div>

)}

</div>

<div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

{filtered.map(tool=>{

const expanded = openCard===tool.id
const purchased = isPurchased(tool)

return (

<div
key={tool.id}
className={`group relative rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/25 transition-all duration-500 hover:border-yellow-400/60 hover:shadow-[0_40px_120px_rgba(255,215,0,0.35)] hover:-translate-y-2 ${
expanded ? "border-yellow-400 shadow-[0_50px_140px_rgba(255,215,0,0.4)] scale-[1.02]" : ""
}`}
>

<div onClick={()=>setOpenCard(expanded?null:tool.id)} className="cursor-pointer">

<div className="p-2 relative">

<div className="relative border border-white/15 rounded-2xl overflow-hidden">

<div className="relative h-40 overflow-hidden">

<ImageSlider images={tool.images}/>

<div className={`absolute top-2 left-2 text-[10px] px-3 py-1 rounded-full font-bold ${
tool.plan==="Free"
? "bg-red-600"
: tool.plan==="Premium"
? "bg-gradient-to-r from-yellow-500 to-orange-500 text-black"
: "bg-purple-600"
}`}>
{tool.plan?.toUpperCase()}
</div>

</div>

</div>

</div>

<div className="p-5">

<div className="flex justify-between items-start">

<div>

<h3 className="font-black italic uppercase tracking-tighter text-xl text-[#FFD700]">
{tool.name}
</h3>

<p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500 mt-2">
{tool.description}
</p>

</div>

<ChevronDown className={`w-5 h-5 transition ${expanded ? "rotate-180 text-yellow-400" : ""}`}/>

</div>

</div>

</div>

<div className={`grid transition-all duration-500 ${
expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
}`}>

<div className="overflow-hidden">

<div className="px-5 pb-5">

{tool.features?.map((f,i)=>(

<div
key={i}
className="bg-[#151515] border border-white/5 rounded-xl px-4 py-3 text-sm mb-2 hover:border-yellow-500/30 transition"
>
{f}
</div>

))}

{purchased ? (

<button
onClick={async (e)=>{
e.stopPropagation()
await trackOpen(tool)
await openTool(tool)
}}
className="w-full bg-gradient-to-r from-yellow-400 to-amber-600 text-black font-bold text-sm py-3 rounded-xl mt-4 shadow-[0_12px_30px_rgba(255,215,0,0.35)] hover:brightness-110 transition flex items-center justify-center gap-2"

>

BUKA APLIKASI <ChevronRight size={16}/>

</button>

) : (

<button
onClick={(e)=>{
e.stopPropagation()
setPopup(tool)
}}
className="w-full bg-gray-700 text-gray-200 font-bold text-sm py-3 rounded-xl mt-4"

>

BELI AKSES

</button>

)}

<button
onClick={(e)=>e.stopPropagation()}
className="w-full bg-red-600 text-white text-sm py-3 rounded-xl mt-3 shadow-[0_10px_25px_rgba(255,0,0,0.35)] hover:bg-red-700 transition flex items-center justify-center gap-2"

>

<Play size={14}/>
TUTORIAL VIDEO

</button>

</div>

</div>

</div>

</div>

)

})}

</div>

</div>

)

}
