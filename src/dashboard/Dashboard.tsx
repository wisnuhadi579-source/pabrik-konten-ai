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
const [popup,setPopup] = useState(null)
const [accessCode,setAccessCode] = useState("")
const [claimLoading,setClaimLoading] = useState(false)
const [claimMessage,setClaimMessage] = useState("")
const [userPlan,setUserPlan] = useState("free")

/* =========================
   LOAD LICENSES FUNCTION
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
/* =========================
   LOAD USER PLAN
========================= */

const loadUserPlan = async () => {

const session = localStorage.getItem("userSession")
if(!session) return

const user = JSON.parse(session)

const { data } = await supabase
.from("users")
.select("plan")
.eq("email", user.email)
.single()

if(data){
setUserPlan(data.plan || "free")
}

}

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
loadLicenses()
loadUserPlan()
},[])

/* 🔥 REALTIME LISTENER */

useEffect(()=>{

const channel = supabase
.channel("licenses-realtime")
.on(
  "postgres_changes",
  {
    event: "*",
    schema: "public",
    table: "licenses"
  },
  () => {
    console.log("🔥 License updated → reload")
    loadLicenses()
  }
)
.subscribe()

return () => {
  supabase.removeChannel(channel)
}

},[])

/* LOAD TOOLS */

const loadTools = async ()=>{

const { data } = await supabase
.from("tools")
.select("*")

if(!data || data.length === 0){
  setTools([])
  return
}

/* =========================
   FORMAT DATA
========================= */

const formatted = data.map(tool => ({
  ...tool,
  buyLink: tool.buy_link,
  tutorialLink: tool.tutorial_link,
  isComingSoon: tool.is_coming_soon
}))

/* =========================
   SORT TOOLS
========================= */

const sortedTools = formatted.sort((a:any, b:any) => {

  const order:any = {
    free: 1,
    premium: 2,
    vip: 3
  }

  return order[a.plan?.toLowerCase()] - order[b.plan?.toLowerCase()]

})

setTools(sortedTools)

}

useEffect(()=>{
loadTools()
},[])

/* 🔥 REALTIME TOOLS UPDATE */

useEffect(()=>{

const channel = supabase
.channel("tools-realtime")
.on(
"postgres_changes",
{
event:"*",
schema:"public",
table:"tools"
},
()=>{
console.log("🔥 Tools updated → reload")
loadTools()
}
)
.subscribe()

return ()=>{
supabase.removeChannel(channel)
}

},[])

/* FILTER */

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

/* TRACK TOOL */

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

/* OPEN TOOL */

const openTool = async (tool) => {

  try {

    if (!tool.url) {
      alert("Link tool tidak tersedia")
      return
    }

    // 🔥 BEDAKAN INTERNAL vs EXTERNAL
    if (tool.url.startsWith("http")) {
      window.open(tool.url, "_blank")
    } else {
      navigate(tool.url)
    }

  } catch (err) {

    console.error("Open tool error", err)

  }

}
/* =========================
   CLAIM ACCESS CODE
========================= */

const claimAccessCode = async () => {

try{

setClaimLoading(true)
setClaimMessage("")

const session = localStorage.getItem("userSession")
if(!session) return

const user = JSON.parse(session)

if(!accessCode){
setClaimMessage("Masukkan kode akses")
return
}

/* =========================
   CHECK CODE
========================= */

const { data: codeData, error: codeError } = await supabase
.from("access_codes")
.select("*")
.eq("code", accessCode.trim().toUpperCase())
.single()

if(codeError || !codeData){
setClaimMessage("Kode akses tidak valid")
return
}

/* =========================
   CHECK USED
========================= */

if(codeData.is_used){
setClaimMessage("Kode sudah digunakan")
return
}

/* =========================
   INSERT LICENSE
========================= */

await supabase
.from("licenses")
.insert({

email: user.email,
product: `${codeData.plan}-bundle`,
plan: codeData.plan,
status: "active"

})

/* =========================
   UPDATE USER PLAN
========================= */

await supabase
.from("users")
.update({
plan: codeData.plan
})
.eq("email", user.email)

/* =========================
   MARK CODE USED
========================= */

await supabase
.from("access_codes")
.update({
is_used: true,
used_by: user.email,
used_at: new Date().toISOString()
})
.eq("id", codeData.id)

/* =========================
   UPDATE SESSION
========================= */

const updatedSession = {
...user,
member: codeData.plan
}

localStorage.setItem(
"userSession",
JSON.stringify(updatedSession)
)

/* =========================
   RELOAD
========================= */

await loadLicenses()
await loadUserPlan()

setClaimMessage("Berhasil membuka akses 🔥")

}catch(err){

console.error(err)
setClaimMessage("Terjadi kesalahan")

}finally{

setClaimLoading(false)

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
{/* =========================
   PREMIUM CLAIM BOX
========================= */}

{userPlan === "free" && (

<div className="max-w-3xl mx-auto mb-8 px-4">

<div className="relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-[#0b0b0b] shadow-[0_0_80px_rgba(255,180,0,0.12)]">

{/* glow */}

<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,200,0,0.15),transparent_60%)] pointer-events-none"></div>

{/* top line */}

<div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[3px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>

<div className="relative z-10 px-5 md:px-6 py-4">

{/* title */}

<div className="text-center">

<h2 className="text-lg md:text-xl font-black italic uppercase tracking-wide text-white">

💎 Buka Semua Akses Premium

</h2>

<p className="text-zinc-400 text-sm mt-2">
Masukkan kode akses Premium/VIP untuk membuka seluruh tools eksklusif.
</p>

</div>

{/* input */}

<div className="mt-3 flex flex-col md:flex-row gap-3">

<input
value={accessCode}
onChange={(e)=>setAccessCode(e.target.value)}
placeholder="Ketik kode akses..."
className="
flex-1
bg-black
border
border-yellow-500/20
rounded-2xl
px-5
py-2
text-white
placeholder:text-zinc-500
outline-none
focus:border-yellow-400
"
/>

<button
onClick={claimAccessCode}
disabled={claimLoading}
className="
px-6
py-2
rounded-2xl
font-black
uppercase
tracking-wide
bg-gradient-to-r
from-yellow-400
to-orange-500
text-black
shadow-[0_10px_30px_rgba(255,180,0,0.35)]
hover:brightness-110
transition-all
"
>

{claimLoading ? "Loading..." : "Klaim"}

</button>

</div>

{/* message */}

{claimMessage && (

<div className="mt-4 text-center text-sm font-medium text-yellow-300">
{claimMessage}
</div>

)}

{/* footer */}

<div className="mt-5 text-center text-xs text-zinc-500">

Belum punya kode akses?

<a
href="https://lynk.id/USERNAMEKAMU"
target="_blank"
className="text-yellow-400 ml-1 hover:underline font-semibold"
>

Beli Paket Premium

</a>

</div>

</div>

</div>

</div>

)}

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

const purchased = (() => {

if (tool.plan === "free") return true
if (!licenses || licenses.length === 0) return false

// normalize
const userPlans = licenses.map(l => l.plan?.toLowerCase())
const toolPlan = tool.plan?.toLowerCase()

// 🔥 VIP → akses semua
if (userPlans.includes("vip")) return true

// 🔥 PREMIUM → akses premium + free
if (userPlans.includes("premium")) {
return toolPlan === "premium" || toolPlan === "free"
}

// 🔥 SINGLE → hanya tool tertentu
return licenses.some(l => 
l.product === (tool.product || tool.id)
)

})()
return (

<div key={tool.id} className={`group relative rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/25 transition-all duration-500 hover:border-yellow-400/60 hover:shadow-[0_40px_120px_rgba(255,215,0,0.35)] hover:-translate-y-2 ${expanded ? "border-yellow-400 shadow-[0_50px_140px_rgba(255,215,0,0.4)] scale-[1.02]" : ""}`}>

<div onClick={()=>setOpenCard(expanded?null:tool.id)} className="cursor-pointer">

<div className="p-2 relative">

<div className="relative border border-white/15 rounded-2xl overflow-hidden">

<div className="relative h-40 overflow-hidden">

<ImageSlider images={tool.images}/>

<div className={`absolute top-2 left-2 text-[10px] px-3 py-1 rounded-full font-bold ${
tool.plan?.toLowerCase()==="free"
? "bg-red-600"

: tool.plan?.toLowerCase()==="premium"
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

<h3 className="font-black italic uppercase tracking-normal leading-tight text-xl text-white">
{tool.name}
</h3>

<p className="text-xs uppercase tracking-[0.14em] text-zinc-500 mt-2">
{tool.description}
</p>

</div>

<ChevronDown className={`w-5 h-5 transition ${expanded ? "rotate-180 text-yellow-400" : ""}`}/>

</div>

</div>

</div>

<div className={`grid transition-all duration-500 ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>

<div className="overflow-hidden">

<div className="px-5 pb-5">

{tool.features?.map((f,i)=>(

<div key={i} className="bg-[#151515] border border-white/5 rounded-xl px-4 py-3 text-sm mb-2 hover:border-yellow-500/30 transition">
{f}
</div>

))}

{purchased ? (

<button
onClick={async (e)=>{
e.stopPropagation()

await trackEvent(tool, "open_tool")

if(tool.type === "course"){

  if(tool.tutorialLink){
    window.open(tool.tutorialLink, "_blank")
  }else{
    alert("Video belum tersedia")
  }

}else{

  await openTool(tool)

}

}}
className="w-full bg-gradient-to-r from-yellow-400 to-amber-600 text-black font-bold text-sm py-3 rounded-xl mt-4 shadow-[0_12px_30px_rgba(255,215,0,0.35)] hover:brightness-110 transition flex items-center justify-center gap-2"
>

BUKA APLIKASI <ChevronRight size={16}/>

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
