// File: functions/lynk-webhook.ts

export async function onRequest(context) {

  const request = context.request
  const env = context.env

  try {

    /* =========================
    HEALTH CHECK
    ========================= */

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ status: "webhook alive" }),
        { status: 200 }
      )
    }

    /* =========================
    PARSE BODY
    ========================= */

    const body = await request.json()

    console.log("BODY:", JSON.stringify(body, null, 2))

    /* =========================
    VALIDATE EVENT
    ========================= */

    if (body.event !== "payment.received") {
      return new Response(JSON.stringify({ ignored: true }), { status: 200 })
    }

    if (body.data?.message_action !== "SUCCESS") {
      return new Response(JSON.stringify({ ignored: true }), { status: 200 })
    }

    /* =========================
    EXTRACT DATA (FIXED)
    ========================= */

    const email = body.data?.customer?.email || null
    const productName = body.data?.items?.[0]?.title || null
    const orderId = body.data?.refId || crypto.randomUUID()
    const amount = body.data?.items?.[0]?.price || 0

    if (!email || !productName) {
      console.log("❌ Missing data:", email, productName)
      return new Response(JSON.stringify({ error: "missing data" }), { status: 200 })
    }

    /* =========================
    EXTRACT PRODUCT SLUG
    ========================= */

    let product = productName
    const match = productName.match(/\[(.*?)\]/)
    if (match) product = match[1]

    console.log("✅ Parsed:", { email, product, orderId, amount })

    /* =========================
    CHECK DUPLICATE (IMPORTANT)
    ========================= */

    const checkRes = await fetch(
      `${env.SUPABASE_URL}/rest/v1/licenses?order_id=eq.${orderId}`,
      {
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    )

    const existing = await checkRes.json()

    if (existing?.length > 0) {
      console.log("⚠️ Duplicate order:", orderId)
      return new Response(JSON.stringify({ duplicate: true }), { status: 200 })
    }

    /* =========================
    INSERT PAYMENT (SAFE)
    ========================= */

    const payRes = await fetch(
      `${env.SUPABASE_URL}/rest/v1/payments`,
      {
        method: "POST",
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          product,
          trx_id: orderId,
          amount
        })
      }
    )

    if (!payRes.ok) {
      console.log("❌ Payment insert failed:", await payRes.text())
    }

    /* =========================
    GET / CREATE USER
    ========================= */

    let userId = null

    const userRes = await fetch(
      `${env.SUPABASE_URL}/rest/v1/users?email=eq.${email}`,
      {
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    )

    const users = await userRes.json()

    if (users?.length > 0) {
      userId = users[0].id
    }

    /* CREATE USER IF NOT EXISTS */

    if (!userId) {

      console.log("🆕 Creating user:", email)

      const authRes = await fetch(
        `${env.SUPABASE_URL}/auth/v1/admin/users`,
        {
          method: "POST",
          headers: {
            apikey: env.SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password: crypto.randomUUID(),
            email_confirm: true
          })
        }
      )

      const authUser = await authRes.json()

      userId = authUser?.id

      /* fallback create profile */

      const profileRes = await fetch(
        `${env.SUPABASE_URL}/rest/v1/users`,
        {
          method: "POST",
          headers: {
            apikey: env.SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=representation"
          },
          body: JSON.stringify({
            id: userId,
            email,
            plan: "free"
          })
        }
      )

      const newUser = await profileRes.json()

      if (newUser?.length > 0) {
        userId = newUser[0].id
      }
    }

    if (!userId) {
      console.log("❌ USER CREATION FAILED")
      return new Response(JSON.stringify({ error: "user failed" }), { status: 200 })
    }

    /* =========================
    GENERATE LICENSE
    ========================= */

    const licenseKey = crypto.randomUUID()

    let plan = "premium"
    if (product === "vip-all") plan = "vip"

    /* =========================
    INSERT LICENSE
    ========================= */

    const licRes = await fetch(
      `${env.SUPABASE_URL}/rest/v1/licenses`,
      {
        method: "POST",
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: userId,
          email,
          product,
          plan,
          license_key: licenseKey,
          order_id: orderId,
          status: "active"
        })
      }
    )

    if (!licRes.ok) {
      console.log("❌ License insert error:", await licRes.text())
      return new Response(JSON.stringify({ error: "license failed" }), { status: 200 })
    }

    /* =========================
    UPDATE PLAN
    ========================= */

    await fetch(
      `${env.SUPABASE_URL}/rest/v1/users?email=eq.${email}`,
      {
        method: "PATCH",
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ plan })
      }
    )

    console.log("🎉 SUCCESS:", email, product)

    return new Response(JSON.stringify({ success: true }), { status: 200 })

  } catch (err) {

    console.log("🔥 WEBHOOK ERROR:", err)

    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 200 }
    )
  }
}
