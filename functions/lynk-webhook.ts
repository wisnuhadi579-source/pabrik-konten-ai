export async function onRequestPost(context: any) {

  try {

    /* =========================
       PARSE BODY
    ========================= */

    const body = await context.request.json()

    const email = body.customer_email
    const productName = body.product_name

    if (!email || !productName) {

      return new Response(
        JSON.stringify({
          error: "Missing email or product"
        }),
        { status: 400 }
      )

    }

    /* =========================
       ENV VARIABLES
    ========================= */

    const supabaseUrl = context.env.SUPABASE_URL
    const supabaseKey = context.env.SUPABASE_SERVICE_KEY

    if (!supabaseUrl || !supabaseKey) {

      return new Response(
        JSON.stringify({
          error: "Supabase ENV not configured"
        }),
        { status: 500 }
      )

    }

    /* =========================
       PRODUCT MAPPING
    ========================= */

    let productId = "unknown"
    let plan = "premium"

    const name = productName.toLowerCase()

    if (name.includes("car")) {

      productId = "car-restoration"
      plan = "premium"

    }

    if (name.includes("vip")) {

      plan = "vip"

    }

    /* =========================
       GENERATE LICENSE KEY
    ========================= */

    const licenseKey = crypto.randomUUID()

    /* =========================
       INSERT LICENSE
    ========================= */

    const response = await fetch(

      `${supabaseUrl}/rest/v1/licenses`,

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Prefer": "return=minimal"

        },

        body: JSON.stringify({

          email: email,
          product: productId,
          plan: plan,
          license_key: licenseKey,
          status: "active"

        })

      }

    )

    if (!response.ok) {

      const errorText = await response.text()

      return new Response(
        JSON.stringify({
          error: "Supabase insert failed",
          details: errorText
        }),
        { status: 500 }
      )

    }

    /* =========================
       SUCCESS RESPONSE
    ========================= */

    return new Response(

      JSON.stringify({

        success: true,
        email: email,
        product: productId,
        plan: plan,
        license_key: licenseKey

      }),

      { status: 200 }

    )

  }

  catch (error: any) {

    return new Response(

      JSON.stringify({

        error: "Webhook processing failed",
        message: error.message

      }),

      { status: 500 }

    )

  }

}
