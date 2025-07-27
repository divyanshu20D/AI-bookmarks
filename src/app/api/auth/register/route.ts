import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Simple in-memory user store (replace with database in production)
let users = [
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

        // Check if user already exists
        const existingUser = users.find((u) => u.email === email);
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists." },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            id: users.length + 1,
            email,
            password: hashedPassword,
        };
        users.push(newUser);

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        return NextResponse.json({
            message: "Registration successful",
            token,
            user: { id: newUser.id, email: newUser.email },
        }, { status: 201 });
    } catch (error) {
        console.error("Registration failed:", error);
        return NextResponse.json(
            { error: "Registration failed." },
            { status: 500 }
        );
    }
}