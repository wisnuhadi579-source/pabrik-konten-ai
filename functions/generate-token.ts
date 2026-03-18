export const onRequestPost = async ({ request, env }) => {

try{

const body = await request.json()

const email = body.email
const product = body.product

if(!email || !product){

return new Response(
JSON.stringify({error:"missing data"}),
{status:400}
)

}

/* CHECK LICENSE */

const licenseCheck = await fetch(
`${env.SUPABASE_URL}/rest/v1/licenses?email=eq.${email}&product=eq.${product}`,
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
{status:403}
)

}

/* GENERATE TOKEN */

const token = crypto.randomUUID()

const expires = new Date(Date.now() + 5 * 60 * 1000).toISOString()

/* INSERT TOKEN */

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

return new Response(
JSON.stringify({token}),
{status:200}
)

}catch(err){

return new Response(
JSON.stringify({error:err.message}),
{status:500}
)

}

}
