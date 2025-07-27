import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { generateEmbedding } from "../../../../../lib/gemini";

// DELETE: Delete a bookmark by ID
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const bookmarkId = parseInt(params.id);

        if (isNaN(bookmarkId)) {
            return NextResponse.json(
                { error: "Invalid bookmark ID." },
                { status: 400 }
            );
        }

        // Check if bookmark exists
        const existingBookmark = await prisma.bookmark.findUnique({
            where: { id: bookmarkId },
        });

        if (!existingBookmark) {
            return NextResponse.json(
                { error: "Bookmark not found." },
                { status: 404 }
            );
        }

        // Delete the bookmark
        await prisma.bookmark.delete({
            where: { id: bookmarkId },
        });

        return NextResponse.json({ message: "Bookmark deleted successfully." });
    } catch (error) {
        console.error("Failed to delete bookmark:", error);
        return NextResponse.json(
            { error: "Failed to delete bookmark." },
            { status: 500 }
        );
    }
}

// PUT: Update a bookmark by ID
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const bookmarkId = parseInt(params.id);

        if (isNaN(bookmarkId)) {
            return NextResponse.json(
                { error: "Invalid bookmark ID." },
                { status: 400 }
            );
        }

        const { url, title, content } = await request.json();

        if (!url || !content) {
            return NextResponse.json(
                { error: "URL and content are required." },
                { status: 400 }
            );
        }

        // Check if bookmark exists
        const existingBookmark = await prisma.bookmark.findUnique({
            where: { id: bookmarkId },
        });

        if (!existingBookmark) {
            return NextResponse.json(
                { error: "Bookmark not found." },
                { status: 404 }
            );
        }

        // Generate new embedding with updated content
        const textForEmbedding = title ? `${title}\n\n${content}` : content;
        console.log("Generating embedding for updated bookmark:", textForEmbedding);
        const embedding = await generateEmbedding(textForEmbedding);
        console.log("Embedding generated successfully for update.");

        // Update the bookmark with new embedding
        await prisma.$executeRaw`
      UPDATE bookmarks 
      SET url = ${url}, title = ${title}, content = ${content}, embedding = JSON_ARRAY_PACK(${JSON.stringify(embedding)})
      WHERE id = ${bookmarkId}
    `;

        console.log("Bookmark updated successfully.");
        return NextResponse.json({ message: "Bookmark updated successfully." });
    } catch (error) {
        console.error("Failed to update bookmark:", error);
        return NextResponse.json(
            { error: "Failed to update bookmark." },
            { status: 500 }
        );
    }
}