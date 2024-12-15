import { client, setTokens } from "../../auth";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const exchanged = await client.exchange(code!, `${url.origin}/api/callback`);
  if (exchanged.err)
    return NextResponse.redirect(`${url.origin}/?error=${exchanged.err}`);
  await setTokens(exchanged.tokens.access, exchanged.tokens.refresh);
  return NextResponse.redirect(`${url.origin}/`);
}
