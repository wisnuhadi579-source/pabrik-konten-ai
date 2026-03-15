export const onRequestPost = async ({ request, env }) => {

try {

const body = await request.json()

/* VERIFY LYNK SIGNATURE */

const merchantKey = env.LYNK_MERCHANT_KEY
const incomingKey = request.headers.get("x-merchant-key")

if(incomingKey !== merchantKey){

return new Response(
JSON.stringify({error:"unauthorized webhook"}),
{status:401}
)

}

/* DATA */

const email = body.customer_email
const productName = body.product_name

if(!email || !productName){

return new Response(
JSON.stringify({error:"missing data"}),
{status:400}
)

}

/* PRODUCT MAP */

const productMap = {

"Cinematic Car Restoration Pro":"car-restoration",

"Premium Bundle":"premium-all",

"VIP Bundle":"vip-all"

}

const product = productMap[productName]

if(!product){

return new Response(
JSON.stringify({error:"unknown product"}),
{status:400}
)

}

/* INSERT LICENSE */

const res = await fetch(
`${env.SUPABASE_URL}/rest/v1/licenses`,
{
method:"POST",
headers:{
"apikey":env.SUPABASE_SERVICE_ROLE_KEY,
"Authorization":`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
"Content-Type":"application/json",
"Prefer":"return=minimal"
},
body:JSON.stringify({

email:email,
product:product,
plan:
product==="vip-all"
? "vip"
: product==="premium-all"
? "premium"
: "premium"

})
}
)

if(!res.ok){

const error = await res.text()

return new Response(
JSON.stringify({error}),
{status:500}
)

}

return new Response(
JSON.stringify({success:true}),
{status:200}
)

}catch(err){

return new Response(
JSON.stringify({error:err.message}),
{status:500}
)

}

}
