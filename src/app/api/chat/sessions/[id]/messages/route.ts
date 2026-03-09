import { chatWithContext } from "@/lib/ollama";
import { prisma } from "@/lib/prisma";
import { searchChunks } from "@/lib/search";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const messages = await prisma.chatMessage.findMany({
      where: { chatSessionId: id },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { question } = await req.json();
    const { id } = await params;

    if (!question?.trim()) {
      return NextResponse.json(
        { message: "Question is required" },
        { status: 400 },
      );
    }

    await prisma.chatMessage.create({
      data: {
        chatSessionId: id,
        role: "USER",
        content: question,
      },
    });

    await prisma.searchLog.create({
      data: { query: question },
    });

    const chunks = await searchChunks(question, 5);

    // Ganti nama jadi ragContext agar tidak bentrok
    const ragContext = chunks
      .map(
        (c, i) =>
          `[${i + 1}] (source: ${c.source}, page: ${c.page})\n${c.chunkText}`,
      )
      .join("\n\n");

    const history = await prisma.chatMessage.findMany({
      where: { chatSessionId: id },
      orderBy: { createdAt: "asc" },
      take: 10,
    });

    const chatHistory = history.map((m) => ({
      role: m.role === "USER" ? ("user" as const) : ("assistant" as const),
      content: m.content,
    }));

    const answer = await chatWithContext(question, ragContext, chatHistory);

    const assistantMessage = await prisma.chatMessage.create({
      data: {
        chatSessionId: id,
        role: "ASSISTANT",
        content: answer,
      },
    });

    return NextResponse.json({
      message: assistantMessage,
      sources: chunks.map((c) => ({ source: c.source, page: c.page })),
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
