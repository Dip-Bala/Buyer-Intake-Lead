// app/api/buyers/route.ts
import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { createBuyerSchema } from "@/lib/validators/buyers";
import { getCurrentUser } from "@/middleware/middleware";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = createBuyerSchema.safeParse(body);
    if (!parsed.success) {
      // return zod errors in a simple structure
      return NextResponse.json({ error: "Validation failed", issues: parsed.error }, { status: 422 });
    }

    const data = parsed.data;

    const created = await prisma.$transaction(async (tx) => {
      // create buyer
      const buyer = await tx.buyer.create({
        data: {
          fullName: data.fullName,
          email: data.email ?? null,
          phone: data.phone,
          city: data.city,
          propertyType: data.propertyType,
          bhk: data.bhk ?? null,
          purpose: data.purpose,
          budgetMin: data.budgetMin ?? null,
          budgetMax: data.budgetMax ?? null,
          timeline: data.timeline,
          source: data.source,
          notes: data.notes ?? null,
          tags: data.tags ?? [],
          ownerId: user.id,
        },
      });

      // create history record referencing the created buyer
      await tx.buyerHistory.create({
        data: {
          buyerId: buyer.id,
          changedBy: user.id,
          diff: { created: data },
        },
      });

      return buyer;
    });

    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (err: any) {
    console.error("Create buyer error:", err);
    return NextResponse.json({ error: "Could not create buyer" }, { status: 500 });
  }
}
