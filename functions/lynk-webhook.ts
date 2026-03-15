const licenseKey = crypto.randomUUID()

const response = await fetch(
`${supabaseUrl}/rest/v1/licenses`,
{
method:"POST",

headers:{
"Content-Type":"application/json",
"apikey":supabaseKey,
"Authorization":`Bearer ${supabaseKey}`,
"Prefer":"return=minimal"
},

body:JSON.stringify({

email: email,
product: productId,
plan: plan,
license_key: licenseKey,
status: "active"

})

}
)
