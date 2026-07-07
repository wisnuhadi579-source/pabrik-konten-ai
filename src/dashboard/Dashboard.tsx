import React, { useState, useEffect, useMemo } from "react"
import {
useNavigate,
useParams
} from "react-router-dom"
import { supabase } from "../services/supabaseClient"
import {
Search,
ChevronDown,
ChevronRight,
Play
} from "lucide-react"


/* =========================
   IMAGE SLIDER TOOL CARD
========================= */

const ImageSlider = ({ images }) => {

const [index,setIndex] = useState(0)

useEffect(()=>{

if(!images || images.length <= 1) return

const timer = setInterval(()=>{
setIndex(prev => (prev + 1) % images.length)
},3000)

return ()=>clearInterval(timer)

},[images])

return (

<div className="
relative
w-full
h-full
overflow-hidden
rounded-2xl
bg-black
">

{images?.map((img,i)=>(

<img
key={i}
src={img}
className={`
absolute inset-0
w-full h-full
object-cover
transition-all duration-1000
${i === index
? "opacity-100 scale-105"
: "opacity-0 scale-100"
}
`}
/>

))}

<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"/>

</div>

)

}

/* =========================
   PROMO SLIDES
========================= */

const PROMO_SLIDES = [

{
image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiJtM0JJLiiEyOQTf9LxXG3NIj2KxX-KYtulnoJq6WQPhwp90FWkeoX3TEMPdIYdz3KfdbBRf6AIM4hF8nLS-iCgXRjvIzj-a12F_e7bq0lSyck30FAP7T2HBaV2rh3mnlnliMSfXWkXCnZHFN5M3KstFZlrKTErTro7ycZy5kWqMibt0ATEomDvgxqkYGm/s1774/baner%201.png",
},

{
image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi7XmmUC5uLBqlR0Lh5K20oObpNb4RnQfu57KAu7uHHx9aup1nJgindE9Za_qUtWJxDQlzJRDwU6jbza_VCuR-ADRM-rZ2jLTSDMI4xY3BxNhESNGg75IPS7Os21ge1swvD8G-3TL8nCNeCUwyVplJ9t3OzloIKN_QgqSsibD6B7s66MeetkmzdnuyPploE/s1774/banner%202.png",
},

{
image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjm7UJvqkdsjnKB-U0VIjdZgClsDOyB7J0eWMKN-57LPwEz8mLVaPn9K7lw49sOOpgBa8dQUVlRPLRNVAmNHM6A36bmT-hDwl71EnNIdRRvSxOrRI1n84aE08olVcdE1mNHy7a4551RY7gf0EcO0urh_uBhE_eozEIq9HFAAz2BjHNTcdQ8jCuXBkAJCUyU/s1774/baner%203.png",
},

{
image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjNfMsZZ1uQyr2o8qF8iSojJx91JnQDnA1AN6vshaWCIavVv2GoqnjbCxmxrrb92_C5YyoGD5Dkm2Qg1MeNgjQ-OW6UVJZCEg33iGkvrQFcgGbgbTAD62y2QupQYbG28cRYtrPhgOLKXP8W1BSFlTDD7Rzli99xTqmsx1Mzwfgo6ssgNT8AuoK4p14t45bW/s1774/banner%204.png",
}

]

/* =========================
   PROMO SLIDER
========================= */

const PromoSlider = () => {

const [index,setIndex] = useState(0)

useEffect(()=>{

const timer = setInterval(()=>{
setIndex(prev => (prev + 1) % PROMO_SLIDES.length)
},4500)

return ()=>clearInterval(timer)

},[])

return (

<div className="max-w-6xl mx-auto px-3 md:px-6 mt-4 mb-6">

<div
className="
relative
overflow-hidden
rounded-3xl
border border-yellow-500/20
bg-black
shadow-[0_0_60px_rgba(255,200,0,0.12)]
"
>

{PROMO_SLIDES.map((slide,i)=>(

<div
key={i}
className={`
absolute inset-0
transition-opacity duration-1000
${i === index ? "opacity-100 z-10" : "opacity-0"}
`}
>

{/* DESKTOP */}
<div className="
hidden md:flex
aspect-[16/5]
items-center
justify-center
bg-black
overflow-hidden
">

<img
src={slide.image}
className={`
w-full
h-full
object-contain
transition-transform
duration-[5000ms]
drop-shadow-[0_0_40px_rgba(255,200,0,0.18)]
${i === index ? "scale-[1.03]" : "scale-100"}
`}
/>

</div>

{/* MOBILE */}
<div className="
block md:hidden
h-[210px]
bg-black
overflow-hidden
">

<img
src={slide.image}
className={`
w-full
h-full
object-contain
brightness-110
contrast-110
transition-transform
duration-[5000ms]
drop-shadow-[0_0_25px_rgba(255,200,0,0.16)]
${i === index ? "scale-[1.02]" : "scale-100"}
`}
/>

</div>

{/* OVERLAY */}
<div
className="
absolute inset-0
bg-gradient-to-t
from-black/10
via-transparent
to-black/5
pointer-events-none
"
/>

</div>

))}

{/* SPACER HEIGHT */}
<div className="hidden md:block aspect-[16/5]" />
<div className="block md:hidden h-[190px]" />

{/* DOT INDICATOR */}
<div className="
absolute
bottom-4
left-1/2
-translate-x-1/2
flex gap-2
z-30
">

{PROMO_SLIDES.map((_,i)=>(

<button
key={i}
onClick={()=>setIndex(i)}
className={`
h-2 rounded-full transition-all duration-300
${i === index
? "w-8 bg-yellow-400"
: "w-2 bg-zinc-600"
}
`}
/>

))}

</div>

</div>

</div>

)

}

/* =========================
   DASHBOARD
========================= */

export const Dashboard = () => {

const navigate = useNavigate()
const { type } = useParams()
const { slug } = useParams()

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
useEffect(() => {

if (!type) {

setActiveCategory("Semua Tools")

return

}

setActiveCategory(type.toUpperCase())

}, [type])
/* =========================
   SESSION CHECK
========================= */

useEffect(()=>{

const session = localStorage.getItem("userSession")

if(!session){

navigate("/login?mode=login")

}else{

setIsLoggedIn(true)

}

setLoading(false)

},[navigate])

/* =========================
   LOAD LICENSES
========================= */

useEffect(()=>{
loadLicenses()
},[])

/* =========================
   REALTIME LICENSES
========================= */

useEffect(()=>{

const channel = supabase
.channel("licenses-realtime")
.on(
"postgres_changes",
{
event:"*",
schema:"public",
table:"licenses"
},
()=>{
loadLicenses()
}
)
.subscribe()

return ()=>{
supabase.removeChannel(channel)
}

},[])

/* =========================
   LOAD TOOLS
========================= */

const loadTools = async ()=>{

const { data } = await supabase
.from("tools")
.select("*")

if(!data || data.length === 0){

setTools([])
return

}

const formatted = data.map(tool => ({
...tool,
buyLink: tool.buy_link,
tutorialLink: tool.tutorial_link,
isComingSoon: tool.is_coming_soon
}))

const sortedTools = formatted.sort((a:any,b:any)=>{

const order:any = {
free:1,
premium:2,
vip:3
}

return order[a.plan?.toLowerCase()] - order[b.plan?.toLowerCase()]

})

setTools(sortedTools)

}

useEffect(()=>{
loadTools()
},[])

/* =========================
   REALTIME TOOLS
========================= */

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
loadTools()
}
)
.subscribe()

return ()=>{
supabase.removeChannel(channel)
}

},[])

/* =========================
   SHARE LINK AUTO OPEN
========================= */

useEffect(()=>{

if(!slug) return

if(!tools || tools.length === 0) return

const selectedTool = tools.find(

tool => tool.slug === slug

)

if(!selectedTool) return

setOpenCard(selectedTool.id)

setTimeout(()=>{

document

.getElementById(

`tool-${selectedTool.id}`

)

?.scrollIntoView({

behavior:"smooth",

block:"center"

})

},500)

},[slug,tools])

const TOOL_CATEGORIES = useMemo(() => {

    return [

        "Semua Tools",

        ...Array.from(

            new Set(

                tools
                    .map(tool => tool.type)
                    .filter(type => type && type.trim() !== "")

            )

        ).sort()

    ]

}, [tools])
/* =========================
   FILTER TOOLS
========================= */

const filtered = useMemo(()=>{

return tools.filter(tool=>{

const matchSearch =
tool.name.toLowerCase().includes(search.toLowerCase())

const matchCategory =
activeCategory === "Semua Tools" ||
tool.type?.toLowerCase() === activeCategory.toLowerCase()

return matchSearch && matchCategory

})

},[search,activeCategory,tools])

/* =========================
   TRACK EVENT
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

console.error(e)

}

}

/* =========================
   OPEN TOOL
========================= */

const openTool = async (tool) => {

if(!tool.url){

alert("Link tool tidak tersedia")
return

}

if(tool.url.startsWith("http")){

window.open(tool.url,"_blank")

}else{

navigate(tool.url)

}

}

if(loading) return null
if(!isLoggedIn) return null

return (

<div className="min-h-screen bg-black text-white relative overflow-hidden">

<div className="
absolute left-1/2 top-[450px]
-translate-x-1/2
w-[900px] h-[400px]
bg-yellow-500/10
blur-[200px]
pointer-events-none
"/>

<div className="h-3"/>

{/* =========================
   PROMO SLIDER
========================= */}

<PromoSlider />

{/* =========================
   SEARCH
========================= */}

<div className="flex justify-center">

<div className="w-[420px] relative">

<Search className="
absolute left-3 top-3
w-4 h-4 text-gray-500
"/>

<input
value={search}
onChange={e=>setSearch(e.target.value)}
placeholder="Cari fitur..."
className="
w-full
bg-[#0c0c0c]
border border-white/10
rounded-3xl
pl-9 py-2
focus:border-yellow-500
outline-none
"
/>

</div>

</div>

{/* =========================
   FILTER
========================= */}

<div className="flex justify-center mt-4 gap-3 relative">

<button
onClick={()=>setFilterOpen(!filterOpen)}
className="
bg-[#111]
border border-white/10
px-6 py-2
rounded-3xl
text-xs
uppercase
tracking-widest
hover:border-yellow-400
transition
"
>

FILTER TOOLS ▾

</button>

<div className="
bg-yellow-500
text-black
px-6 py-2
rounded-3xl
text-xs
uppercase
tracking-widest
shadow-[0_0_20px_rgba(255,215,0,0.35)]
">

{activeCategory}

</div>

{filterOpen && (

<div className="
absolute
top-full mt-2
w-48
bg-[#0c0c0c]
border border-white/10
rounded-3xl
shadow-xl
z-50
">

{TOOL_CATEGORIES.map(cat=>(

<div
key={cat}
onClick={() => {

    setFilterOpen(false)

    if (cat === "Semua Tools") {

        navigate("/dashboard")

    } else {

        navigate(`/dashboard/kategori/${cat.toLowerCase()}`)

    }

}}
className={`
px-4 py-2
text-xs
cursor-pointer
uppercase
tracking-widest
hover:bg-white/5
transition
${activeCategory===cat
? "text-yellow-400 font-semibold"
: "text-gray-400"
}
`}
>

{cat}

</div>

))}

</div>

)}

</div>

{/* =========================
   TOOLS GRID
========================= */}

<div className="
max-w-6xl mx-auto
mt-8
px-3 md:px-6
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-3
gap-4 md:gap-8
">

{filtered.map(tool=>{

const expanded = openCard === tool.id

const purchased = (() => {

if(tool.plan === "free") return true

if(!licenses || licenses.length === 0) return false

const userPlans = licenses.map(l => l.plan?.toLowerCase())
const toolPlan = tool.plan?.toLowerCase()

if(userPlans.includes("vip")) return true

if(userPlans.includes("premium")){

return toolPlan === "premium" || toolPlan === "free"

}

return licenses.some(l =>
l.product === (tool.product || tool.id)
)

})()

return (

<div

id={`tool-${tool.id}`}

key={tool.id}

className={`
group relative
rounded-3xl
overflow-hidden
bg-[#0a0a0a]
border
transition-all duration-500

${expanded
? "border-yellow-400/60 shadow-[0_0_80px_rgba(255,215,0,0.22)] scale-[1.02] z-30"
: "border-white/10 hover:border-yellow-400/30 hover:shadow-[0_25px_100px_rgba(255,215,0,0.20)]"
}
`}
>

<div
onClick={()=>setOpenCard(expanded ? null : tool.id)}
className="cursor-pointer"
>

<div className="p-2 relative">

<div className="
relative
border border-white/15
rounded-3xl
overflow-hidden
">

<div className={`
relative
aspect-[16/9]
overflow-hidden
transition-all duration-500
rounded-2xl
bg-black
${expanded
? "scale-[1.02] shadow-[0_0_35px_rgba(255,215,0,0.25)]"
: ""
}
`}>

<ImageSlider images={tool.images}/>

<div className={`
absolute top-2 left-2
text-[10px]
px-3 py-1
rounded-full
font-bold
${tool.plan?.toLowerCase()==="free"
? "bg-red-600"
: tool.plan?.toLowerCase()==="premium"
? "bg-gradient-to-r from-yellow-500 to-orange-500 text-black"
: "bg-purple-600"
}
`}>

{tool.plan?.toUpperCase()}

</div>

</div>

</div>

</div>

<div className="p-4">

<div className="flex justify-between items-start">

<div>

<h3 className="
font-black italic uppercase
tracking-tight leading-tight
text-lg md:text-2xl
text-white
group-hover:text-yellow-300
transition-colors duration-300
">

{tool.name}

</h3>

<p className="
text-[10px] md:text-xs
uppercase
tracking-[0.12em]
text-zinc-500
mt-2
">

{tool.description}

</p>

</div>

<ChevronDown
className={`
w-5 h-5 flex-shrink-0
transition-all duration-500
${expanded
? "rotate-180 text-yellow-400"
: "text-zinc-600"
}
`}
/>

</div>

</div>

</div>

<div className={`
grid transition-all duration-500 ease-out
${expanded
? "grid-rows-[1fr] opacity-100"
: "grid-rows-[0fr] opacity-0"
}
`}>

<div className="overflow-hidden">

<div className="px-5 pb-5 relative">

{tool.features?.map((f,i)=>(

<div
key={i}
className="
flex items-center gap-3
bg-white/[0.03]
border border-white/5
rounded-3xl
px-4 py-3
text-sm text-zinc-300
mb-2
transition-all duration-300
hover:bg-yellow-500/5
hover:border-yellow-500/30
"
>

<div className="
w-2 h-2 rounded-full
bg-yellow-400
flex-shrink-0
"/>

<span>{f}</span>

</div>

))}

{purchased ? (

<button
onClick={async (e)=>{

e.stopPropagation()

await trackEvent(tool,"open_tool")

if(tool.type === "course"){

if(tool.tutorialLink){

window.open(tool.tutorialLink,"_blank")

}else{

alert("Video belum tersedia")

}

}else{

await openTool(tool)

}

}}
className="
w-full
bg-gradient-to-r
from-yellow-400
to-amber-600
text-black
font-bold
text-sm
py-3
rounded-3xl
mt-4
shadow-[0_12px_30px_rgba(255,215,0,0.35)]
hover:brightness-110
transition
flex items-center justify-center gap-2
"
>

BUKA APLIKASI

<ChevronRight size={16}/>

</button>

) : (

<button
onClick={async (e)=>{

e.stopPropagation()

await trackEvent(tool,"buy_click")

window.open(tool.buyLink,"_blank")

}}
className="
w-full
bg-gray-700
text-gray-200
font-bold
text-sm
py-3
rounded-3xl
mt-4
"
>

BELI AKSES

</button>

)}

<button
onClick={async (e)=>{

e.stopPropagation()

await trackEvent(tool,"tutorial_click")

if(tool.tutorialLink){

window.open(tool.tutorialLink,"_blank")

}else{

alert("Tutorial belum tersedia")

}

}}
className="
w-full
bg-red-600
text-white
text-sm
py-3
rounded-3xl
mt-3
shadow-[0_10px_25px_rgba(255,0,0,0.35)]
hover:bg-red-700
transition
flex items-center justify-center gap-2
"
>

<Play size={14}/>

TUTORIAL

</button>
<button

onClick={(e)=>{

e.stopPropagation()

const shareLink =

`${window.location.origin}/#/dashboard/${tool.slug}`

navigator.clipboard.writeText(

shareLink

)

alert(

"Link aplikasi berhasil disalin"

)

}}

className="

w-full

bg-blue-600

text-white

text-sm

py-3

rounded-3xl

mt-3

hover:bg-blue-700

transition

"

>

SHARE LINK

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
