import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Simple in-memory user store (replace with database in production)
const users = [
    {
        id: 1,
        email: "demo@bookmarkai.com",
        password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
    },
];

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required." },
                { status: 400 }
            );
        }

        // Find user
        const user = users.find((u) => u.email === email);
        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials." },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json(
                { error: "Invalid credentials." },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        return NextResponse.json({
            message: "Login successful",
            token,
            user: { id: user.id, email: user.email },
        });
    } catch (error) {
        console.error("Login failed:", error);
        return NextResponse.json(
            { error: "Login failed." },
            { status: 500 }
        );
    }
}