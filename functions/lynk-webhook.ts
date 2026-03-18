export const onRequestPost = async ({ request, env }) => {

try {

const body = await request.json()

console.log("LYNK WEBHOOK BODY:", body)
console.log("LYNK HEADERS:", Object.fromEntries(request.headers))

/* =========================
VERIFY MERCHANT KEY
========================= */

const merchantKey = env.LYNK_MERCHANT_KEY

const incomingKey =
request.headers.get("x-merchant-key") ||
request.headers.get("merchant-key") ||
request.headers.get("x-lynk-key") ||
request.headers.get("authorization")

/* allow test webhook without merchant key */

if(!incomingKey){

console.log("Test webhook detected")

return new Response(
JSON.stringify({test:true}),
{status:200}
)

}

if(incomingKey !== merchantKey){

return new Response(
JSON.stringify({error:"unauthorized webhook"}),
{status:401}
)

}

/* =========================
VALIDATE PAYMENT
========================= */

if(body.status && body.status !== "PAID"){

return new Response(
JSON.stringify({ignored:true}),
{status:200}
)

}

/* =========================
DATA
========================= */

const email = body.customer_email
const productName = body.product_name

const orderId =
body.order_id ||
body.transaction_id ||
crypto.randomUUID()

if(!email || !productName){

return new Response(
JSON.stringify({error:"missing data"}),
{status:400}
)

}

/* =========================
PRODUCT MAP
========================= */

const productMap = {

"Cinematic Car Restoration Pro":"car-restoration",
"Premium Bundle":"premium-all",
"VIP Bundle":"vip-all"

}

let product = productMap[productName]

if(!product){

product =
body.product_slug ||
body.product_code ||
productName

}

/* =========================
CHECK USER PROFILE
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

/* CREATE AUTH ACCOUNT */

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

email:email,
password:"pakar123",
email_confirm:true

})
}
)

/* CREATE USER PROFILE */

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

email:email,
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
DUPLICATE ORDER PROTECTION
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

console.log("Duplicate order ignored:", orderId)

return new Response(
JSON.stringify({duplicate:true}),
{status:200}
)

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

plan:plan

})
}
)

console.log("License success for:", email)

/* =========================
SUCCESS
========================= */

return new Response(
JSON.stringify({success:true}),
{status:200}
)

}catch(err){

console.log("Webhook error:", err)

return new Response(
JSON.stringify({error:err.message}),
{status:500}
)

}

}
