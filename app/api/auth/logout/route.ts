import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCasLogoutUrl } from "@/lib/auth";

export async function GET() {
  // Clear session cookie
  (await cookies()).delete("session");

  // Redirect to CAS logout
  return redirect(getCasLogoutUrl());
}
