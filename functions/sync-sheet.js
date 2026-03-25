export async function onRequestGet(context) {
  const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTUyhPO0Pcog2W5OuQlXFCzUIZ2r022Eoe6QF-GOSgUDswgxtC8Hfu9MtBO7oXWn4TL2ouGEFqUXS3v/pub?output=csv";

  const SUPABASE_URL = context.env.SUPABASE_URL;
  const SUPABASE_KEY = context.env.SUPABASE_KEY;
  try {
    const res = await fetch(SHEET_URL);
    const text = await res.text();

    const rows = text.split("\n").slice(1);

    for (const row of rows) {
      const cols = row.split(",");

      const email = cols[0];
      const status = cols[1];
      const title = cols[2];
      const amount = parseFloat(cols[3] || "0");
      const date = cols[4];

      if (!email || status !== "SUCCESS") continue;

      const product = extractProduct(title);
      const order_id = email + "-" + date;

      await fetch(`${SUPABASE_URL}/rest/v1/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          email,
          product,
          trx_id: order_id,
          amount,
        }),
      });
    }

    return new Response("Sync success");
  } catch (err) {
    return new Response("Error: " + err.message);
  }
}

function extractProduct(title) {
  const match = title.match(/\[(.*?)\]/);
  return match ? match[1] : "unknown";
}
