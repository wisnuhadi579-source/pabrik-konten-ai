// File: functions/lynk-webhook.ts

export async function onRequest(context) {

const request = context.request
const env = context.env

try{

/* =========================
CHECK METHOD
========================= */

if(request.method !== "POST"){

return new Response(
JSON.stringify({status:"webhook alive"}),
{status:200}
)

}

/* =========================
PARSE BODY
========================= */

const body = await request.json()

console.log("LYNK WEBHOOK BODY:", JSON.stringify(body,null,2))
console.log("LYNK HEADERS:", Object.fromEntries(request.headers))

/* =========================
VALIDATE EVENT
========================= */

const event = body.event

if(event !== "payment.received"){

console.log("Ignored event:", event)

return new Response(
JSON.stringify({ignored:true}),
{status:200}
)

}

/* =========================
EXTRACT DATA (LYNK FORMAT)
========================= */

const email =
body.data?.customer?.email ||
body.customer_email ||
body.email ||
body.buyer_email ||
null

const productName =
body.data?.items?.[0]?.title ||
body.items?.[0]?.name ||
body.product_name ||
body.title ||
null

const orderId =
body.data?.refId ||
body.refId ||
body.order_id ||
body.transaction_id ||
crypto.randomUUID()

const amount =
body.data?.items?.[0]?.price ||
body.data?.totals?.grandTotal ||
body.amount ||
0

/* =========================
VALIDATE BASIC DATA
========================= */

if(!email || !productName){

console.log("Missing data:", email, productName)

return new Response(
JSON.stringify({error:"missing data"}),
{status:200}
)

}

/* =========================
EXTRACT PRODUCT CODE
========================= */

let product = productName

const match = productName.match(/\[(.*?)\]/)

if(match){
product = match[1]
}

/* =========================
CHECK DUPLICATE ORDER
========================= */

const check = await fetch(
`${env.SUPABASE_URL}/rest/v1/licenses?order_id=eq.${orderId}`,
{
headers:{
apikey:env.SUPABASE_SERVICE_ROLE_KEY,
Authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
}
}
)

const existing = await check.json()

if(existing && existing.length > 0){

console.log("Duplicate webhook ignored:", orderId)

return new Response(
JSON.stringify({duplicate:true}),
{status:200}
)

}

/* =========================
SAVE PAYMENT LOG
========================= */

await fetch(
`${env.SUPABASE_URL}/rest/v1/payments`,
{
method:"POST",
headers:{
apikey:env.SUPABASE_SERVICE_ROLE_KEY,
Authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
"Content-Type":"application/json"
},
body:JSON.stringify({

email,
product,
trx_id:orderId,
amount

})
}
)

/* =========================
CHECK USER
========================= */

let userId = null

const userCheck = await fetch(
`${env.SUPABASE_URL}/rest/v1/users?email=eq.${email}`,
{
headers:{
apikey:env.SUPABASE_SERVICE_ROLE_KEY,
Authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
}
}
)

const users = await userCheck.json()

if(users && users.length > 0){
userId = users[0].id
}

/* =========================
CREATE USER IF NOT EXIST
========================= */

if(!userId){

console.log("Creating new user:", email)

/* CREATE AUTH USER */

await fetch(
`${env.SUPABASE_URL}/auth/v1/admin/users`,
{
method:"POST",
headers:{
apikey:env.SUPABASE_SERVICE_ROLE_KEY,
Authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
"Content-Type":"application/json"
},
body:JSON.stringify({

email,
password:"pakar123",
email_confirm:true

})
}
)

/* CREATE PROFILE */

const createUser = await fetch(
`${env.SUPABASE_URL}/rest/v1/users`,
{
method:"POST",
headers:{
apikey:env.SUPABASE_SERVICE_ROLE_KEY,
Authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
"Content-Type":"application/json",
Prefer:"return=representation"
},
body:JSON.stringify({

email,
plan:"free"

})
}
)

const newUser = await createUser.json()

if(newUser && newUser.length > 0){
userId = newUser[0].id
}

}

/* =========================
GENERATE LICENSE
========================= */

const licenseKey = crypto.randomUUID()

/* =========================
PLAN DETECTION
========================= */

let plan = "premium"

if(product === "vip-all") plan = "vip"
if(product === "premium-all") plan = "premium"

/* =========================
INSERT LICENSE
========================= */

const res = await fetch(
`${env.SUPABASE_URL}/rest/v1/licenses`,
{
method:"POST",
headers:{
apikey:env.SUPABASE_SERVICE_ROLE_KEY,
Authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
"Content-Type":"application/json"
},
body:JSON.stringify({

user_id:userId,
email,
product,
plan,
license_key:licenseKey,
order_id:orderId,
status:"active"

})
}
)

if(!res.ok){

const error = await res.text()

console.log("License insert error:", error)

return new Response(
JSON.stringify({error}),
{status:500}
)

}

/* =========================
UPDATE USER PLAN
========================= */

await fetch(
`${env.SUPABASE_URL}/rest/v1/users?email=eq.${email}`,
{
method:"PATCH",
headers:{
apikey:env.SUPABASE_SERVICE_ROLE_KEY,
Authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
"Content-Type":"application/json"
},
body:JSON.stringify({

plan

})
}
)

console.log("LICENSE CREATED:", email, product)

return new Response(
JSON.stringify({success:true}),
{status:200}
)

}catch(err){

console.log("WEBHOOK ERROR:", err)

return new Response(
JSON.stringify({error:err.message}),
{status:200}
)

}

}
