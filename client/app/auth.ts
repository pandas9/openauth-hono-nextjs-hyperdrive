import { createClient } from "@openauthjs/openauth/client";
import { cookies as getCookies } from "next/headers";

export const client = createClient({
  clientID: "client",
  issuer: process.env.NEXT_PUBLIC_AUTH_URL,
});

export async function setTokens(access: string, refresh: string) {
  const cookies = await getCookies();

  cookies.set({
    name: "access_token",
    value: access,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 34560000,
  });
  cookies.set({
    name: "refresh_token",
    value: refresh,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 34560000,
  });
}
