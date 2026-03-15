import React, { useState, useEffect } from "react"
import { Tool } from "../types/app"
import { Play, ChevronRight } from "lucide-react"
import { motion } from "motion/react"
import { AccessPopup } from "./AccessPopup"
import { supabase } from "../services/supabaseClient"

interface ToolCardProps {
  tool: Tool
  onClick: (id: string) => void
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {

  const [showAccess,setShowAccess] = useState(false)
  const [licenses,setLicenses] = useState<string[]>([])

  /* LOAD USER LICENSES */

  useEffect(()=>{

    const loadLicenses = async ()=>{

      const session = localStorage.getItem("userSession")
      if(!session) return

      const user = JSON.parse(session)

      const { data } = await supabase
        .from("licenses")
        .select("product")
        .eq("email", user.email)

      if(data){

        const products = data.map((l:any)=>l.product)
        setLicenses(products)

      }

    }

    loadLicenses()

  },[])

  /* CHECK ACCESS RULE */

  const hasAccess = ()=>{

    /* FREE TOOL */

    if(!tool.plan || tool.plan === "Free"){
      return true
    }

    /* VIP MEMBER */

    if(licenses.includes("vip-all")){
      return true
    }

    /* PREMIUM MEMBER */

    if(
      licenses.includes("premium-all") &&
      tool.plan === "Premium"
    ){
      return true
    }

    /* SINGLE LICENSE */

    if(licenses.includes((tool as any).product)){
      return true
    }

    return false
  }

  const handleOpenTool = () => {

    const toolUrl = (tool as any).url

    if(hasAccess()){

      if(toolUrl) window.open(toolUrl,"_blank")
      else onClick(tool.id)

      return
    }

    setShowAccess(true)

  }

  /* IMAGE SLIDESHOW */

  const images =
    tool.images && tool.images.length > 0
      ? tool.images
      : tool.image
      ? [tool.image]
      : ["https://picsum.photos/seed/tool/800/450"]

  const [imageIndex,setImageIndex] = useState(0)

  useEffect(()=>{

    if(images.length <= 1) return

    const interval = setInterval(()=>{
      setImageIndex(prev => (prev + 1) % images.length)
    },3000)

    return ()=>clearInterval(interval)

  },[images])

  return(

    <>

    <motion.div
      whileHover={{y:-5,scale:1.01}}
      className="group relative bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-emerald-500/30 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)]"
    >

      {/* IMAGE */}

      <div className="aspect-video w-full overflow-hidden relative">

        <img
          src={images[imageIndex]}
          alt={tool.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />

        <div className="absolute top-3 right-3">

          <span
            className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
              tool.plan === "Premium"
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : tool.plan === "VIP"
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            }`}
          >
            {tool.plan || "Free"}
          </span>

        </div>

      </div>

      {/* CONTENT */}

      <div className="p-5">

        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
          {tool.name}
        </h3>

        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
          {tool.description}
        </p>

        <div className="flex items-center gap-2">

          <button
            onClick={handleOpenTool}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-500 hover:bg-emerald-600 text-black text-sm font-bold rounded-xl transition-all"
          >
            <Play className="w-3 h-3 fill-current"/>
            {hasAccess() ? "Buka Aplikasi" : "Beli Akses"}
          </button>

          {tool.tutorialLink && (

            <a
              href={tool.tutorialLink}
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl border border-white/10 transition-all"
            >
              <ChevronRight className="w-5 h-5"/>
            </a>

          )}

        </div>

      </div>

    </motion.div>

    {showAccess && (

      <AccessPopup
        plan={tool.plan || "Premium"}
        buyLink={(tool as any).buyLink}
        onClose={()=>setShowAccess(false)}
      />

    )}

    </>

  )

}