import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ajtefnkjdzavwacgqkri.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdGVmbmtqZHphdndhY2dxa3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MzE2NjIsImV4cCI6MjA4NTIwNzY2Mn0.KjQDTGLPuaDsZM5dSipNYZcfr45CuRooFNSCRXDdGuY";

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
 * 🔥 CEK AKSES TOOL
 */
export function hasAccess(licenses: any[], productSlug: string) {
  return licenses.some((l) => l.product === productSlug);
}
