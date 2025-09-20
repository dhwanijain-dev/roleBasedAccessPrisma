import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path");
  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }
  const { data, error } = await supabaseServer.storage
    .from("company-docs")
    .createSignedUrl(path, 60 * 5); // 5 minutes
  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Could not create signed url" }, { status: 400 });
  }
  return NextResponse.json({ url: data.signedUrl });
}