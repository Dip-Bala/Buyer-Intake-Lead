import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signJwt } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const { email, password} = await req.json(); // correct with NextRequest

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "User is not registered" }, { status: 403 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect Password" }, { status: 401 });
    }

    const token = await signJwt({ id: user.id, email: user.email });

    const response = NextResponse.json({ id: user.id, email: user.email });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error); // log actual error for debugging
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
