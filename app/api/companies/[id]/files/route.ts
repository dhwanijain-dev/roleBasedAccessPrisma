import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// POST /api/companies/:id/files
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const companyId = params.id;
  const { files } = await req.json();

  if (!companyId || !Array.isArray(files)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const data = files.map((f: any) => ({
    companyId,
    filename: f.filename,
    path: f.path,
    url: f.url ?? null,
    size: f.size ?? null,
    mime: f.mime ?? null,
  }));

  await prisma.companyFile.createMany({ data });

  return NextResponse.json({ ok: true }, { status: 201 });
}
