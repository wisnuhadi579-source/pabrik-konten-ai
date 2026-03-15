export async function onRequestPost(context: any) {

  try {

    const body = await context.request.json()

    const email = body.customer_email
    const productName = body.product_name

    const supabaseUrl = context.env.SUPABASE_URL
    const supabaseKey = context.env.SUPABASE_SERVICE_KEY

    console.log("ENV URL:", supabaseUrl)
    console.log("ENV KEY EXISTS:", !!supabaseKey)

    const response = await fetch(`${supabaseUrl}/rest/v1/licenses`, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`
      },

      body: JSON.stringify({
        email: email,
        product: "car-restoration",
        plan: "premium",
        license_key: crypto.randomUUID(),
        status: "active"
      })

    })

    const text = await response.text()

    return new Response(JSON.stringify({
      status: response.status,
      response: text
    }), { status: 200 })

  } catch (err:any) {

    return new Response(JSON.stringify({
      error: err.message
    }), { status: 500 })

  }

}
