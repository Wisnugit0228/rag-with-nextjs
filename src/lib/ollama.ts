import ollama from "ollama";

export async function createEmbedding(text: string) {
  const response = await ollama.embeddings({
    model: "nomic-embed-text",
    prompt: text,
  });

  return response.embedding;
}

export async function chatWithContext(
  question: string,
  context: string,
  history: { role: "user" | "assistant"; content: string }[] = [],
): Promise<string> {
  // tambah return type eksplisit
  const systemPrompt = `You are a helpful assistant. Answer questions based ONLY on the context provided below. 
If the answer is not in the context, say "I don't have enough information to answer that."
Always answer in the same language as the question.

Context:
${context}`;

  const response = await ollama.chat({
    model: "llama3.2",
    messages: [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: question },
    ],
  });

  return response.message.content; // pastikan ada return ini
}
