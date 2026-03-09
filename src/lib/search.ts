import { createEmbedding } from "./ollama";
import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

type ChunkResult = {
  chunkText: string;
  source: string;
  page: number;
  similarity: number;
};

export async function searchChunks(query: string, topK = 5) {
  const embedding = await createEmbedding(query);
  const vector = `[${embedding.join(",")}]`;

  const chunks = await prisma.$queryRaw<ChunkResult[]>(
    Prisma.sql`
      SELECT 
        "chunkText",
        source,
        page,
        1 - (embedding <=> ${vector}::vector) AS similarity
      FROM document_chunks
      ORDER BY similarity DESC
      LIMIT ${topK}
    `,
  );

  return chunks;
}
