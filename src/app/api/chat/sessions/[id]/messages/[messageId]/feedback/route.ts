import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; messageId: string }> },
) {
  try {
    const { messageId } = await params;
    const { rating, comment } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Rating must be between 1-5" },
        { status: 400 },
      );
    }

    const feedback = await prisma.feedback.create({
      data: {
        messageId,
        rating,
        comment,
      },
    });

    return NextResponse.json(feedback);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
