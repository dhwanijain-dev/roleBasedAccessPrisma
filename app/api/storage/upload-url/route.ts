import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { companyId, filename, contentType } = await req.json();

    if (!companyId || !filename) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const safeName = filename.replace(/\s+/g, "_");
    const path = `${companyId}/${Date.now()}_${safeName}`;

    const { data, error } = await supabaseServer.storage
      .from("company-docs")
      .createSignedUploadUrl(path);

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message ?? "Upload URL failed" },
        { status: 400 }
      );
    }   
return NextResponse.json({ path, token: data.token }); 
  } catch (err: any) {
    console.error("Upload URL API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
