import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { generateEmbedding } from "../../../../lib/gemini";

// POST: Search for bookmarks
export async function POST(request: NextRequest) {
    try {
        const { query } = await request.json();

        if (!query) {
            return NextResponse.json(
                { error: "Search query is required." },
                { status: 400 }
            );
        }

        console.log("Generating embedding for search query:", query);
        const queryEmbedding = await generateEmbedding(query);
        console.log("Search embedding generated.");

        const SIMILARITY_THRESHOLD = 0.5; // Lowered threshold for better recall

        // First try vector search
        const vectorResults = await prisma.$queryRaw`
      SELECT 
        id, 
        url, 
        title, 
        content, 
        created_at as createdAt,
        DOT_PRODUCT(embedding, JSON_ARRAY_PACK(${JSON.stringify(queryEmbedding)})) as similarity
      FROM bookmarks
      WHERE DOT_PRODUCT(embedding, JSON_ARRAY_PACK(${JSON.stringify(queryEmbedding)})) > ${SIMILARITY_THRESHOLD}
      ORDER BY similarity DESC
      LIMIT 10
    ` as any[];

        // If vector search doesn't return enough results, add text search
        let textResults: any[] = [];
        if (vectorResults.length < 5) {
            textResults = await prisma.bookmark.findMany({
                where: {
                    OR: [
                        {
                            title: {
                                contains: query
                            }
                        },
                        {
                            content: {
                                contains: query
                            }
                        }
                    ]
                },
                select: {
                    id: true,
                    url: true,
                    title: true,
                    content: true,
                    createdAt: true,
                },
                take: 10 - vectorResults.length
            });
        }

        // Process results first (convert BigInt to Number)
        const processedVectorResults = vectorResults.map((item) => ({
            ...item,
            id: Number(item.id),
            similarity: Number(item.similarity),
        }));

        const processedTextResults = textResults.map((item) => ({
            ...item,
            id: Number(item.id),
            similarity: 0, // Text search results don't have similarity scores
        }));

        // Combine and deduplicate results (prioritize vector results)
        const allResults = [...processedVectorResults, ...processedTextResults];
        const uniqueResults = allResults.filter((result, index, self) =>
            index === self.findIndex(r => r.id === result.id)
        );

        console.log("Search complete. Found results:", uniqueResults.length);
        const processedResults = uniqueResults;

        return NextResponse.json(processedResults);
    } catch (error) {
        console.error("Search failed:", error);
        return NextResponse.json(
            { error: "Search failed." },
            { status: 500 }
        );
    }
}