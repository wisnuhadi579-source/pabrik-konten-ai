import React,{useEffect,useState} from "react"
import { supabase } from "../../services/supabaseClient"

export const AdminAnalytics = () => {

const [stats,setStats] = useState<any[]>([])

const loadStats = async () => {

const {data} = await supabase
.from("tool_events")
.select("tool_id")

if(!data) return

const grouped:any = {}

data.forEach(e=>{

if(!grouped[e.tool_id]) grouped[e.tool_id]=0

grouped[e.tool_id]++

})

const result = Object.keys(grouped).map(id=>({

tool_id:id,
opens:grouped

}))

setStats(result)

}

useEffect(()=>{

loadStats()

},[])

return (

<div className="min-h-screen bg-black text-white p-10">

<h1 className="text-3xl font-bold mb-8">
Tool Analytics
</h1>

<table className="w-full">

<thead>

<tr className="border-b border-white/10">

<th className="text-left">Tool</th>
<th className="text-left">Open Count</th>

</tr>

</thead>

<tbody>

{stats.map(s=>(

<tr key={s.tool_id} className="border-b border-white/5">

<td>{s.tool_id}</td>
<td>{s.opens}</td>

</tr>

))}

</tbody>

</table>

</div>

)

}
