import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ajtefnkjdzavwacgqkri.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdGVmbmtqZHphdndhY2dxa3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MzE2NjIsImV4cCI6MjA4NTIwNzY2Mn0.KjQDTGLPuaDsZM5dSipNYZcfr45CuRooFNSCRXDdGuY"; // ⚠️ tetap pakai anon key di frontend

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 🔥 AUTO LINK LICENSE KE USER
 */
export async function linkLicensesToUser(user: any) {
  if (!user?.email) return;

  const { error } = await supabase
    .from("licenses")
    .update({ user_id: user.id })
    .eq("email", user.email)
    .is("user_id", null);

  if (error) {
    console.error("❌ Link license error:", error);
  } else {
    console.log("✅ License linked to user");
  }
}

/**
 * 🔥 AMBIL LICENSE USER
 */
export async function getUserLicenses(userId: string) {
  const { data, error } = await supabase
    .from("licenses")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active");

  if (error) {
    console.error("❌ Get licenses error:", error);
    return [];
  }

  return data || [];
}

/**
 * 🔥 GET USER ACCESS (NEW CORE SYSTEM)
 */
export function getAccessInfo(licenses: any[]) {

  let plan = "free";
  const products: string[] = [];

  for (const l of licenses) {

    if (l.plan === "vip") {
      plan = "vip";
    } else if (l.plan === "premium" && plan !== "vip") {
      plan = "premium";
    } else if (l.plan === "single" && plan === "free") {
      plan = "single";
    }

    if (l.product) {
      products.push(l.product);
    }
  }

  return { plan, products };
}

/**
 * 🔥 SMART ACCESS CHECK (REPLACE hasAccess)
 */
export function canAccessTool(
  licenses: any[],
  tool: any
) {

  const { plan, products } = getAccessInfo(licenses);

  const productId = tool.product || tool.id;

  // FREE TOOL
  if (tool.plan === "Free") return true;

  // VIP = ALL ACCESS
  if (plan === "vip") return true;

  // PREMIUM ACCESS
  if (plan === "premium") {
    return tool.plan !== "VIP";
  }

  // SINGLE ACCESS
  if (plan === "single") {
    return products.includes(productId);
  }

  return false;
}
