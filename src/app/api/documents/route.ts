import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

import fs from "fs-extra";

import { getCurrentUser } from "@/server/get-user";
import path from "path";

import { createEmbedding } from "@/lib/ollama";
import { extractText } from "@/lib/extractText";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 },
      );
    }

    const user = await getCurrentUser();
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload ke Supabase Storage
    const filePath = `files/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) throw new Error(uploadError.message);

    // Ambil public URL
    const { data: urlData } = supabase.storage
      .from("documents")
      .getPublicUrl(filePath);

    const fileUrl = urlData.publicUrl;

    // Extract text dari buffer
    const content = await extractText(buffer, file.name);

    // Chunk text
    const chunkSize = 500;
    const chunks: string[] = [];
    for (let i = 0; i < content.length; i += chunkSize) {
      chunks.push(content.slice(i, i + chunkSize));
    }

    // Simpan document ke DB
    const document = await prisma.document.create({
      data: {
        title: file.name,
        fileUrl,
        uploadedById: user!.id,
        status: "PROCESSING",
      },
    });

    // Generate embeddings dan simpan chunks
    for (let i = 0; i < chunks.length; i++) {
      const embedding = await createEmbedding(chunks[i]);
      const vector = `[${embedding.join(",")}]`;

      await prisma.$executeRaw`
        INSERT INTO document_chunks 
        ("id", "documentId", "chunkText", embedding, "chunkIndex", page, source, "createdAt")
        VALUES (
          gen_random_uuid(),
          ${document.id},
          ${chunks[i]},
          ${vector}::vector,
          ${i},
          ${i + 1},
          ${file.name},
          now()
        )
      `;
    }

    // Update status jadi READY
    await prisma.document.update({
      where: { id: document.id },
      data: { status: "READY" },
    });

    return NextResponse.json({ success: true, document });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const documents = await prisma.document.findMany({
      include: { uploadedBy: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(documents);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
