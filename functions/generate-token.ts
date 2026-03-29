export const onRequestPost = async ({ request, env }) => {

try{

const body = await request.json()

const email = body.email
const product = body.product

if(!email || !product){

return new Response(
JSON.stringify({error:"missing data"}),
{
status:400,
headers:{ "Content-Type":"application/json" }
}
)

}

/* =========================
   CHECK LICENSE (FIXED)
========================= */

const licenseCheck = await fetch(
`${env.SUPABASE_URL}/rest/v1/licenses?email=eq.${email}&status=eq.active`,
{
headers:{
apikey:env.SUPABASE_SERVICE_ROLE_KEY,
Authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
}
}
)

const licenses = await licenseCheck.json()

if(!licenses || licenses.length === 0){

return new Response(
JSON.stringify({error:"no license"}),
{
status:403,
headers:{ "Content-Type":"application/json" }
}
)

}

/* 🔥 LOGIC AKSES */
const hasAccess = licenses.some(l => {

const plan = l.plan?.toLowerCase()

// VIP → semua akses
if(plan === "vip") return true

// PREMIUM → semua premium + free
if(plan === "premium") return true

// SINGLE → hanya produk tertentu
return l.product === product

})

if(!hasAccess){

return new Response(
JSON.stringify({error:"no access"}),
{
status:403,
headers:{ "Content-Type":"application/json" }
}
)

}

/* =========================
   GENERATE TOKEN
========================= */

const token = crypto.randomUUID()

const expires = new Date(Date.now() + 5 * 60 * 1000).toISOString()

/* =========================
   INSERT TOKEN
========================= */

await fetch(
`${env.SUPABASE_URL}/rest/v1/tool_tokens`,
{
method:"POST",
headers:{
apikey:env.SUPABASE_SERVICE_ROLE_KEY,
Authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
"Content-Type":"application/json"
},
body:JSON.stringify({

user_email:email,
tool_product:product,
token:token,
expires_at:expires

})
}
)

/* =========================
   RESPONSE FIX
========================= */

return new Response(
JSON.stringify({token}),
{
status:200,
headers:{ "Content-Type":"application/json" }
}
)

}catch(err){

return new Response(
JSON.stringify({error:err.message}),
{
status:500,
headers:{ "Content-Type":"application/json" }
}
)

}

}