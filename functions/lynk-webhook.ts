// File: functions/lynk-webhook.ts

export async function onRequest(context) {

  const request = context.request
  const env = context.env

  try {

    console.log("🔥 WEBHOOK HIT")

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

    console.log("📦 BODY:", JSON.stringify(body, null, 2))

    /* =========================
    VALIDATE EVENT
    ========================= */

    if (body.event !== "payment.received") {
      console.log("⏭️ Ignored event:", body.event)
      return new Response(JSON.stringify({ ignored: true }), { status: 200 })
    }

    if (body.data?.message_action !== "SUCCESS") {
      console.log("⏭️ Not SUCCESS:", body.data?.message_action)
      return new Response(JSON.stringify({ ignored: true }), { status: 200 })
    }

    /* =========================
    EXTRACT DATA (SUPER FLEXIBLE)
    ========================= */

    const email =
      body?.data?.customer?.email ||
      body?.customer?.email ||
      body?.email ||
      null

    const productName =
      body?.data?.items?.[0]?.title ||
      body?.data?.items?.[0]?.name ||
      body?.items?.[0]?.title ||
      body?.items?.[0]?.name ||
      body?.title ||
      null

    const orderId =
      body?.data?.refId ||
      body?.refId ||
      body?.order_id ||
      crypto.randomUUID()

    const amount =
      body?.data?.items?.[0]?.price ||
      body?.data?.totals?.grandTotal ||
      body?.amount ||
      0

    console.log("📊 EXTRACTED:", { email, productName, orderId, amount })

    /* =========================
    VALIDATION
    ========================= */

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

    console.log("🏷️ PRODUCT:", product)

    /* =========================
    CHECK DUPLICATE
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
    INSERT PAYMENT
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
    } else {
      console.log("✅ Payment saved")
    }

    /* =========================
    GET USER
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
      console.log("👤 Existing user:", userId)
    }

    /* =========================
    CREATE USER IF NOT EXISTS
    ========================= */

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

      console.log("🔑 Auth user created:", userId)

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
      console.log("❌ USER FAILED")
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

    console.log("🔐 License created")

    /* =========================
    UPDATE USER PLAN
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
