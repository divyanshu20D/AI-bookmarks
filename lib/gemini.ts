import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Takes a string of text and returns its vector embedding.
 * @param {string} text The text to embed.
 * @returns {Promise<number[]>} A promise that resolves to an array of numbers (the embedding).
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const model = genAI.getGenerativeModel({ model: "embedding-001" });
        const result = await model.embedContent(text);
        const embedding = result.embedding;
        return embedding.values;
    } catch (error) {
        console.error("Error generating embedding:", error);
        throw new Error("Failed to generate embedding from Gemini API.");
    }
}