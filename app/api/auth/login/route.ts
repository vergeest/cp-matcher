import { redirect } from "next/navigation"
import { getCasLoginUrl } from "@/lib/auth"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const redirectUrl = searchParams.get("redirectUrl") || "/dashboard"

  // Redirect to CAS login
  return redirect(getCasLoginUrl(redirectUrl))
}

