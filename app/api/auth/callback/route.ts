import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { createSession, findOrCreateUser } from "@/lib/auth";
import { parseXml } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ticket = searchParams.get("ticket");
  const redirectUrl = searchParams.get("redirectUrl") || "/dashboard";

  if (!ticket) {
    return redirect("/api/auth/login");
  }

  let result;

  try {
    // Validate ticket with CAS server
    const serviceUrl = encodeURIComponent(
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/api/auth/callback`
    );
    const validationUrl = `https://sso.sun.ac.za/serviceValidate?ticket=${ticket}&service=${serviceUrl}`;

    const response = await fetch(validationUrl);
    const xml = await response.text();

    // Parse XML response
    result = parseXml(xml);
  } catch (error) {
    console.error(error);
    return redirect("/auth/error?error=server_error");
  }

  if (result.success) {
    // Find or create user
    const user = await findOrCreateUser(result.username, result.fullName);

    // Create session
    const token = await createSession(user);

    // Set session cookie
    (await cookies()).set({
      name: "session",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return redirect(redirectUrl);
  } else {
    // Authentication failed
    return redirect("/auth/error?error=invalid_ticket");
  }
}
