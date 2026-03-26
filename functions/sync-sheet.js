export async function onRequestGet(context) {

  const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTUyhPO0Pcog2W5OuQlXFCzUIZ2r022Eoe6QF-GOSgUDswgxtC8Hfu9MtBO7oXWn4TL2ouGEFqUXS3v/pub?output=csv";

  const SUPABASE_URL = context.env.SUPABASE_URL;
  const SUPABASE_KEY = context.env.SUPABASE_SERVICE_ROLE_KEY; // ✅ FIX

  try {

    if (!SUPABASE_KEY) {
      return new Response("❌ SUPABASE KEY KOSONG!");
    }

    const res = await fetch(SHEET_URL);
    const text = await res.text();

    const rows = text.split("\n").slice(1);

    let success = 0;
    let error = 0;
    let skip = 0;

    for (const row of rows) {

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
      const trx_id = email + "-" + date;

      const insert = await fetch(`${SUPABASE_URL}/rest/v1/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          email,
          product,
          trx_id,
          amount
        }),
      });

      if (insert.ok) {
        success++;
      } else {
        error++;
        const errText = await insert.text();
        console.log("INSERT ERROR:", errText);
      }

    }

    return new Response(
      `Sync selesai ✅\nSuccess: ${success}\nSkip: ${skip}\nError: ${error}`
    );

  } catch (err) {
    return new Response("Error: " + err.message);
  }
}

function extractProduct(title) {
  const match = title.match(/\[(.*?)\]/);
  return match ? match[1] : "unknown";
}
