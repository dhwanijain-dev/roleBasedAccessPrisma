import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// POST /api/storage/download-url
// body: { path: "companyId/file.pdf" }
export async function POST(req: Request) {
  const { path } = await req.json();

  if (!path) return NextResponse.json({ error: "Missing path" }, { status: 400 });

  const { data, error } = await supabaseServer
    .storage
    .from("company-docs")
    .createSignedUrl(path, 60 * 60); // 1 hour validity

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data); // contains { signedUrl }
}
