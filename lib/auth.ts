import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify, SignJWT } from "jose";
import prisma from "./prisma";

// Secret key for JWT signing
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_jwt_secret_change_this_in_production"
);

// CAS server URL
export const CAS_SERVER_URL = "https://sso.sun.ac.za";
export const SERVICE_URL = `https://${process.env.VERCEL_URL}/api/auth/callback`;

// User type
export type User = {
  id: string;
  username: string;
  fullName: string;
};

// Get the session from cookies
export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as User;
  } catch (error) {
    return null;
  }
}

// Create a session
export async function createSession(user: User): Promise<string> {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(JWT_SECRET);

  return token;
}

// Get CAS login URL
export function getCasLoginUrl(redirectUrl?: string): string {
  const service = encodeURIComponent(SERVICE_URL);
  return `${CAS_SERVER_URL}/login?service=${service}${
    redirectUrl ? `&redirectUrl=${encodeURIComponent(redirectUrl)}` : ""
  }`;
}

// Get CAS logout URL
export function getCasLogoutUrl(): string {
  return `${CAS_SERVER_URL}/logout?service=${SERVICE_URL}`;
}

// Middleware to check if user is authenticated
export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect("/api/auth/login");
  }

  return session;
}

// Find or create a user from CAS data
export async function findOrCreateUser(
  username: string,
  fullName: string
): Promise<User> {
  const user = await prisma.user.upsert({
    where: { username },
    update: { fullName },
    create: { username, fullName },
    select: { id: true, username: true, fullName: true },
  });

  return user;
}
