export async function onRequestGet(context) {

  const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTUyhPO0Pcog2W5OuQlXFCzUIZ2r022Eoe6QF-GOSgUDswgxtC8Hfu9MtBO7oXWn4TL2ouGEFqUXS3v/pub?output=csv";

  const SUPABASE_URL = context.env.SUPABASE_URL;
  const SUPABASE_KEY = context.env.SUPABASE_SERVICE_ROLE_KEY;

  let success = 0;
  let skip = 0;
  let error = 0;

  try {

    const res = await fetch(SHEET_URL);
    const text = await res.text();

    const rows = text.split("\n").slice(1);

    for (const row of rows) {

      try {

        const cols = row.split(",");

        const email = cols[0]?.trim();
        const status = cols[1]?.trim();
        const title = cols[2]?.trim();
        const amount = parseFloat(cols[3] || "0");
        const date = cols[4]?.trim();

        if (!email || status !== "SUCCESS") {
          skip++;
          continue;
        }

        const product = extractProduct(title);
        const plan = detectPlan(product);
        const order_id = email + "-" + date;

        /* =========================
           INSERT PAYMENT
        ========================= */

        await fetch(`${SUPABASE_URL}/rest/v1/payments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Prefer: "resolution=ignore-duplicates"
          },
          body: JSON.stringify({
            email,
            product,
            trx_id: order_id,
            amount,
          }),
        });

        /* =========================
           INSERT LICENSE
        ========================= */

        await fetch(`${SUPABASE_URL}/rest/v1/licenses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Prefer: "resolution=ignore-duplicates"
          },
          body: JSON.stringify({
            email,
            product,
            plan,
            status: "active"
          }),
        });

        success++;

      } catch (err) {
        error++;
      }

    }

    return new Response(`
Sync selesai ✅
Success: ${success}
Skip: ${skip}
Error: ${error}
`);

  } catch (err) {
    return new Response("Error: " + err.message);
  }
}

/* =========================
   🔥 PRODUCT → PLAN MAPPING
========================= */

function detectPlan(product) {

  if (!product) return "single";

  // 🔥 MAP MANUAL (SUPER AMAN)
  const PLAN_MAP = {
    "bundle-vip": "vip",
    "vip": "vip",

    "bundle-premium": "premium",
    "premium": "premium",

    // SINGLE PRODUCTS
    "car-restoration": "single",
    "ai-writer": "single",
  };

  return PLAN_MAP[product] || "single";
}

/* =========================
   EXTRACT PRODUCT
========================= */

function extractProduct(title) {
  const match = title.match(/\[(.*?)\]/);
  return match ? match[1].toLowerCase() : "unknown";
}