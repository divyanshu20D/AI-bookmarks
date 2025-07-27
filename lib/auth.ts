import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export interface AuthUser {
    userId: number;
    email: string;
}

export function verifyToken(token: string): AuthUser | null {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
        return decoded;
    } catch (error) {
        return null;
    }
}

export function getAuthUser(request: NextRequest): AuthUser | null {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.substring(7);
    return verifyToken(token);
}