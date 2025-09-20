import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// POST /api/companies  (create company)
// GET  /api/companies  (list companies + files)
export async function POST(req: Request) {
  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Missing company name" }, { status: 400 });
  }
  const company = await prisma.company.create({ data: { name } });
  return NextResponse.json(company, { status: 201 });
}

export async function GET() {
  const companies = await prisma.company.findMany({
    include: { files: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(companies);
}
