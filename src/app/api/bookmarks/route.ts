import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { generateEmbedding } from "../../../../lib/gemini";

// GET: Fetch all bookmarks
export async function GET() {
    try {
        const bookmarks = await prisma.bookmark.findMany({
            select: {
                id: true,
                url: true,
                title: true,
                content: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json(bookmarks);
    } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
        return NextResponse.json(
            { error: "Failed to fetch bookmarks." },
            { status: 500 }
        );
    }
}

// POST: Add a new bookmark
export async function POST(request: NextRequest) {
    try {
        const { url, title, content } = await request.json();

        if (!url || !content) {
            return NextResponse.json(
                { error: "URL and content are required." },
                { status: 400 }
            );
        }

        // Combine title and content for better embedding
        const textForEmbedding = title ? `${title}\n\n${content}` : content;
        console.log("Generating embedding for:", textForEmbedding);
        const embedding = await generateEmbedding(textForEmbedding);
        console.log("Embedding generated successfully.");

        // Use raw query for vector insertion
        await prisma.$executeRaw`
      INSERT INTO bookmarks (url, title, content, embedding)
      VALUES (${url}, ${title}, ${content}, JSON_ARRAY_PACK(${JSON.stringify(embedding)}))
    `;

        console.log("Bookmark saved to database.");
        return NextResponse.json(
            { message: "Bookmark added successfully!", data: embedding },
            { status: 201 }
        );
    } catch (error) {
        console.error("Failed to add bookmark:", error);
        return NextResponse.json(
            { error: "Failed to add bookmark." },
            { status: 500 }
        );
    }
}