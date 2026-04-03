import React, { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
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

const [isLoggedIn,setIsLoggedIn] = useState(false)
const [loading,setLoading] = useState(true)
const [licenses,setLicenses] = useState([])
const [tools,setTools] = useState([])

const [search,setSearch] = useState("")
const [filterOpen,setFilterOpen] = useState(false)
const [activeCategory,setActiveCategory] = useState("Semua Tools")
const [openCard,setOpenCard] = useState(null)

/* =========================
   LOAD LICENSES
========================= */

const loadLicenses = async () => {

const session = localStorage.getItem("userSession")
if(!session) return

const user = JSON.parse(session)

const { data } = await supabase
.from("licenses")
.select("*")
.eq("email", user.email)
.eq("status", "active")

setLicenses(data || [])

}

/* SESSION */

useEffect(()=>{

const session = localStorage.getItem("userSession")

if(!session){
navigate("/login?mode=login")
}else{
setIsLoggedIn(true)
}

setLoading(false)

},[navigate])

useEffect(()=>{
loadLicenses()
},[])

/* REALTIME LICENSE */

useEffect(()=>{

const channel = supabase
.channel("licenses-realtime")
.on("postgres_changes",
{ event: "*", schema: "public", table: "licenses" },
() => loadLicenses()
)
.subscribe()

return ()=> supabase.removeChannel(channel)

},[])

/* LOAD TOOLS */

const loadTools = async ()=>{

const { data } = await supabase.from("tools").select("*")

if(!data){
setTools([])
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

useEffect(()=>{ loadTools() },[])

/* REALTIME TOOLS */

useEffect(()=>{

const channel = supabase
.channel("tools-realtime")
.on("postgres_changes",
{ event:"*", schema:"public", table:"tools" },
()=> loadTools()
)
.subscribe()

return ()=> supabase.removeChannel(channel)

},[])

/* FILTER */

const filtered = useMemo(()=>{

return tools.filter(tool=>{

const matchSearch = tool.name.toLowerCase().includes(search.toLowerCase())

const matchCategory =
activeCategory==="Semua Tools" ||
tool.labels?.includes(activeCategory)

return matchSearch && matchCategory

})

},[search,activeCategory,tools])

/* =========================
   🔥 TRACK EVENT (FIX)
========================= */

const trackEvent = async (tool, type) => {

try{

const session = localStorage.getItem("userSession")
if(!session) return

const user = JSON.parse(session)

await supabase.from("tool_events").insert({
tool_id: tool.id,
user_email: user.email,
event_type: type
})

}catch(e){
console.error("Analytics error",e)
}

}

/* =========================
   OPEN TOOL (NO DOUBLE TRACK)
========================= */

const openTool = async (tool) => {

try{
await trackEvent(tool, "open_tool")
window.open(tool.url, "_blank")
}catch(err){
console.error(err)
}

}

if(loading) return null
if(!isLoggedIn) return null

return (

<div className="min-h-screen bg-black text-white relative overflow-hidden">

{/* UI TIDAK DIUBAH SAMA SEKALI */}

<div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

{filtered.map(tool=>{

const expanded = openCard===tool.id

const purchased = (() => {

if (tool.plan === "Free") return true
if (!licenses?.length) return false

const userPlans = licenses.map(l => l.plan?.toLowerCase())
const toolPlan = tool.plan?.toLowerCase()

if (userPlans.includes("vip")) return true

if (userPlans.includes("premium")) {
return toolPlan === "premium" || toolPlan === "free"
}

return licenses.some(l => l.product === (tool.product || tool.id))

})()

return (

<div key={tool.id}>

{purchased ? (

<button
onClick={async (e)=>{
e.stopPropagation()
await openTool(tool)
}}
className="w-full bg-gradient-to-r from-yellow-400 to-amber-600 text-black font-bold text-sm py-3 rounded-xl mt-4"
>
BUKA APLIKASI
</button>

) : (

<button
onClick={async (e)=>{
e.stopPropagation()
await trackEvent(tool, "buy_click")
window.open(tool.buyLink, "_blank")
}}
className="w-full bg-gray-700 text-gray-200 font-bold text-sm py-3 rounded-xl mt-4"
>
BELI AKSES
</button>

)}

<button
onClick={async (e)=>{
e.stopPropagation()
await trackEvent(tool, "tutorial_click")

if(tool.tutorialLink){
window.open(tool.tutorialLink, "_blank")
}else{
alert("Tutorial belum tersedia")
}
}}
className="w-full bg-red-600 text-white text-sm py-3 rounded-xl mt-3"
>
<Play size={14}/>
TUTORIAL VIDEO
</button>

</div>

)

})}

</div>

</div>

)

}