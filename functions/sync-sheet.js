export async function onRequestGet(context) {

  const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTUyhPO0Pcog2W5OuQlXFCzUIZ2r022Eoe6QF-GOSgUDswgxtC8Hfu9MtBO7oXWn4TL2ouGEFqUXS3v/pub?output=csv";

  const SUPABASE_URL = context.env.SUPABASE_URL;
  const SUPABASE_KEY = context.env.SUPABASE_KEY;

  try {

    const res = await fetch(SHEET_URL);
    const text = await res.text();

    const rows = text.split("\n").slice(1);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const row of rows) {

      if (!row.trim()) continue;

      const cols = row.split(",");

      const email = cols[0]?.trim();
      const status = cols[1]?.trim();
      const title = cols[2]?.trim();
      const amount = parseFloat(cols[3] || "0");
      const date = cols[4]?.trim();

      if (!email || status !== "SUCCESS") {
        skipCount++;
        continue;
      }

      const product = extractProduct(title);
      const order_id = email + "-" + date;

      const payload = {
        email,
        product,
        trx_id: order_id,
        amount,
        created_at: formatDate(date)
      };

      const response = await fetch(`${SUPABASE_URL}/rest/v1/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "resolution=merge-duplicates"
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.log("❌ Insert error:", errText);
        errorCount++;
        continue;
      }

      successCount++;
    }

    return new Response(
      `Sync selesai ✅ 
Success: ${successCount}
Skip: ${skipCount}
Error: ${errorCount}`
    );

  } catch (err) {
    return new Response("Error: " + err.message);
  }
}

/* =========================
   FORMAT DATE FIX (WAJIB)
========================= */

function formatDate(dateStr) {

  if (!dateStr) return new Date().toISOString();

  try {

    // contoh: 23-03-2026 19:3
    const [datePart, timePart] = dateStr.split(" ");

    if (!datePart || !timePart) {
      return new Date().toISOString();
    }

    const [day, month, year] = datePart.split("-");
    let [hour, minute] = timePart.split(":");

    hour = hour.padStart(2, "0");
    minute = minute.padStart(2, "0");

    const iso = `${year}-${month}-${day}T${hour}:${minute}:00`;

    return new Date(iso).toISOString();

  } catch (err) {

    console.log("⚠️ Date parse error:", dateStr);
    return new Date().toISOString();

  }
}

/* =========================
   EXTRACT PRODUCT
========================= */

function extractProduct(title) {
  const match = title?.match(/\[(.*?)\]/);
  return match ? match[1] : "unknown";
}
