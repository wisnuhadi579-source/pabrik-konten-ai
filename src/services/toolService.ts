import { supabase } from "./supabaseClient"

export const getTools = async () => {

const { data, error } = await supabase
.from("tools")
.select("*")
.order("created_at",{ascending:true})

if(error){
console.error(error)
return []
}

return data || []

}

export const createTool = async (tool:any) => {

const { error } = await supabase
.from("tools")
.insert(tool)

if(error) console.error(error)

}

export const updateTool = async (id:string, tool:any) => {

const { error } = await supabase
.from("tools")
.update(tool)
.eq("id",id)

if(error) console.error(error)

}

export const deleteTool = async (id:string) => {

const { error } = await supabase
.from("tools")
.delete()
.eq("id",id)

if(error) console.error(error)

}