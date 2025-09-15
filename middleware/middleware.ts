import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { redirect, useRouter } from "next/navigation";

const jwt_secret = process.env.SECRET as string;

export async function getCurrentUser(req: NextRequest) {
    const router = useRouter();
  try {
    // 1. Get token from Authorization header or cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
        redirect('/login');
    };

    // 2. Verify and decode
    const decoded = jwt.verify(token, jwt_secret) as { id: string; email: string };

    return decoded; 
  } catch (err) {
        console.error("JWT verification failed:", err);
    return null;
  }
}
