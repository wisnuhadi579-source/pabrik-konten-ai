import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import tools from "../config/tools.json"
import { Search, ChevronDown, Lock, ChevronRight, Play } from "lucide-react"

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



/*
========================================
PABRIK KONTEN AI DESIGN LOCK
========================================

JANGAN UBAH BAGIAN INI:

1. Gold ambient glow layer
2. Card shadow cinematic
3. Hover glow gold
4. Reflection line
5. Light sweep animation

Efek ini menciptakan tampilan
floating gold cinematic card.

PENTING:
Card container HARUS overflow-visible
agar glow tidak terpotong.

========================================
*/



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

{images.map((img,i)=>(

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
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem("userSession");
    if (!session) {
      navigate("/login?mode=login");
    } else {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, [navigate]);

const [search,setSearch] = useState("")
const [filterOpen,setFilterOpen] = useState(false)
const [activeCategory,setActiveCategory] = useState("Semua Tools")
const [openCard,setOpenCard] = useState(null)
const [popup,setPopup] = useState(null)

if (loading) return null;
if (!isLoggedIn) return null;

const purchasedCodes = JSON.parse(localStorage.getItem("purchased") || "[]")



const filtered = tools.filter(tool=>{

const matchSearch =
tool.name.toLowerCase().includes(search.toLowerCase())

const matchCategory =
activeCategory==="Semua Tools" ||
tool.labels?.includes(activeCategory)

return matchSearch && matchCategory

})



const isPurchased = (tool)=>{

if(tool.plan==="Free") return true

return purchasedCodes.includes(tool.singleAccessCode)

}



return (

<div className="min-h-screen bg-black text-white relative overflow-hidden">



{/* GLOBAL CINEMATIC LIGHT */}

<div className="absolute left-1/2 top-[450px] -translate-x-1/2 w-[900px] h-[400px] bg-yellow-500/10 blur-[200px] pointer-events-none"></div>



{/* HERO */}

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



{/* SEARCH */}

<div className="flex justify-center">

<div className="w-[420px] relative">

<Search className="absolute left-3 top-3 w-4 h-4 text-gray-500"/>

<input
value={search}
onChange={e=>setSearch(e.target.value)}
placeholder="Cari fitur (contoh: Iklan, Gambar, Video)..."
className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl pl-9 py-2 focus:border-yellow-500"
/>

</div>

</div>



{/* FILTER */}

<div className="flex justify-center mt-4 gap-3 relative">

<button
onClick={()=>setFilterOpen(!filterOpen)}
className="bg-[#111] border border-white/10 px-6 py-2 rounded-xl text-xs uppercase tracking-widest hover:border-yellow-400 transition"
>
FILTER TOOLS ▾
</button>

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
className={`px-4 py-2 text-xs cursor-pointer uppercase tracking-widest hover:bg-white/5 transition
${activeCategory===cat ? "text-yellow-400 font-semibold" : "text-gray-400"}
`}
>

{cat}

</div>

))}

</div>

)}

</div>



{/* GRID */}

<div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">



{filtered.map(tool=>{

const expanded = openCard===tool.id
const purchased = isPurchased(tool)

return (

<div
key={tool.id}

className={`
group relative rounded-3xl overflow-hidden
bg-[#0a0a0a]
border border-white/25
transition-all duration-500
hover:border-yellow-400/60
hover:shadow-[0_40px_120px_rgba(255,215,0,0.35)]
hover:-translate-y-2
${expanded ? "border-yellow-400 shadow-[0_50px_140px_rgba(255,215,0,0.4)] scale-[1.02]" : ""}
`}

>



<div
onClick={()=>setOpenCard(expanded?null:tool.id)}
className="cursor-pointer"
>

{/* METAL REFLECTION */}

<div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>



{/* IMAGE AREA */}

<div className="p-2 relative">



{/* GOLD AMBIENT GLOW */}

<div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 via-amber-400/30 to-yellow-500/20 blur-3xl opacity-40 group-hover:opacity-80 transition-all duration-500 pointer-events-none rounded-3xl"></div>



<div className="relative border border-white/15 rounded-2xl overflow-hidden shadow-[inset_0_0_30px_rgba(255,255,255,0.08),0_10px_30px_rgba(0,0,0,0.6)] group-hover:border-yellow-400/40 transition-all duration-500">

<div className="relative h-40 overflow-hidden">

<ImageSlider images={tool.images}/>



{/* LIGHT SWEEP */}

<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 pointer-events-none"></div>



{/* PLAN BADGE */}

<div className={`absolute top-2 left-2 text-[10px] px-3 py-1 rounded-full font-bold ${
tool.plan==="Free"
? "bg-red-600"
: tool.plan==="Premium"
? "bg-gradient-to-r from-yellow-500 to-orange-500 text-black"
: "bg-purple-600"
}`}>
{tool.plan.toUpperCase()}
</div>



</div>

</div>

</div>



{/* TITLE */}

<div className="p-5">

<div className="flex justify-between items-start">

<div>

<h3
className={`
font-black
italic
uppercase
tracking-tighter
text-xl
sm:text-2xl
leading-tight
${tool.plan === 'VIP' ? 'text-fuchsia-400' : 'text-[#FFD700]'}
`}
>
{tool.name}
</h3>

<p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500 mt-2">
{tool.description}
</p>

</div>

<ChevronDown
className={`w-5 h-5 transition ${
expanded ? "rotate-180 text-yellow-400" : ""
}`}
/>

</div>

</div>

</div>



{/* DROPDOWN */}

<div className={`grid transition-all duration-500 ${
expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
}`}>

<div className="overflow-hidden">

<div className="px-5 pb-5">

{tool.labels && (
<div className="flex gap-2 mb-3">
{(() => {
const visibleLabels = tool.labels.slice(0,2)
const extraCount = tool.labels.length - visibleLabels.length
return (
<>
{visibleLabels.map(label=>(
<span
key={label}
className="text-[9px] font-bold uppercase tracking-widest text-yellow-400"
>
{label}
</span>
))}

{extraCount>0 && (
<span className="text-[9px] text-zinc-500">
+{extraCount}
</span>
)}
</>
)
})()}
</div>
)}

<div className="flex items-center gap-2 text-[10px] text-zinc-400 uppercase tracking-[0.25em] mb-3">

<svg
className="w-4 h-4 text-yellow-400"
fill="none"
stroke="currentColor"
strokeWidth="2"
viewBox="0 0 24 24"
>
<path d="M4 6h16M4 12h16M4 18h16"/>
</svg>

CAPABILITIES PORTFOLIO

</div>

{tool.features?.map((f,i)=>(

<div
key={i}
className="bg-[#151515] border border-white/5 rounded-xl px-4 py-3 text-sm flex items-center gap-3 mb-2 hover:border-yellow-500/30 transition"
>

<div className="w-5 h-5 rounded-full border border-yellow-400 flex items-center justify-center">

<div className="w-2 h-2 bg-yellow-400 rounded-full"></div>

</div>

{f}

</div>

))}



{purchased ? (

<button
onClick={(e)=>{
e.stopPropagation()
window.open(tool.url)
}}
className="w-full bg-gradient-to-r from-yellow-400 to-amber-600 text-black font-bold text-sm py-3 rounded-xl mt-4 shadow-[0_12px_30px_rgba(255,215,0,0.35)] hover:brightness-110 transition flex items-center justify-center gap-2"
>
BUKA APLIKASI
<ChevronRight size={16}/>
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



{/* POPUP */}

{popup && (

<div className="fixed inset-0 bg-black/80 flex items-center justify-center">

<div className="bg-[#0d0d0d] border border-yellow-500/30 rounded-2xl p-6 w-[360px]
shadow-[0_0_60px_rgba(255,200,0,0.4)]">

<div className="flex justify-end">
<button onClick={()=>setPopup(null)}>✕</button>
</div>

<div className="text-center">

<div className="w-14 h-14 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
<Lock className="text-yellow-400"/>
</div>

<h2 className="text-lg font-bold">
AKSES TERKUNCI
</h2>

<p className="text-xs text-gray-400 mt-2">
Fitur <span className="text-yellow-400">{popup.name}</span> adalah {popup.plan}
</p>

<input
placeholder="Ketik kode akses..."
className="mt-4 w-full bg-black border border-yellow-500/30 rounded-xl px-3 py-2"
/>

<button className="mt-3 w-full bg-gradient-to-r from-yellow-500 to-orange-500 py-2 rounded-xl text-black font-semibold">
KLAIM AKSES SEKARANG
</button>

</div>

</div>

</div>

)}


{/* FOOTER */}

<footer className="mt-24 border-t border-white/10 shadow-[0_-20px_60px_rgba(255,215,0,0.08)]">

<div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">

<div>

<div className="text-yellow-400 font-bold tracking-widest text-sm">
PABRIK KONTEN AI
</div>

<p className="text-xs text-zinc-500 mt-3 leading-relaxed">
Platform AI Tools untuk Creator, Affiliator, dan Digital Builder.
Bangun konten, promosi, dan automation lebih cepat dengan sistem AI.
</p>

</div>

<div>

<div className="text-xs text-zinc-400 uppercase tracking-widest mb-4">
Platform
</div>

<ul className="space-y-2 text-sm text-zinc-500">

<li className="hover:text-yellow-400 transition cursor-pointer">
Dashboard
</li>

<li className="hover:text-yellow-400 transition cursor-pointer">
Tutorial
</li>

<li className="hover:text-yellow-400 transition cursor-pointer">
Pricing
</li>

</ul>

</div>

<div>

<div className="text-xs text-zinc-400 uppercase tracking-widest mb-4">
Legal
</div>

<ul className="space-y-2 text-sm text-zinc-500">

<li className="hover:text-yellow-400 transition cursor-pointer">
Terms of Service
</li>

<li className="hover:text-yellow-400 transition cursor-pointer">
Privacy Policy
</li>

</ul>

</div>

</div>

<div className="border-t border-white/5">

<div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-600">

<div>
© {new Date().getFullYear()} Pabrik Konten AI
</div>

<div className="text-zinc-500">
Powered by AI Automation
</div>

</div>

</div>

</footer>

</div>

)
}