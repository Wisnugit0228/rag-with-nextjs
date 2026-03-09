import Groq from "groq-sdk";
import { HfInference } from "@huggingface/inference";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function createEmbedding(text: string): Promise<number[]> {
  const result = await hf.featureExtraction({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    inputs: text,
  });

  // Pastikan hasilnya flat array of number
  if (Array.isArray(result) && typeof result[0] === "number") {
    return result as number[];
  }

  // Kadang HF return nested array, flatten
  return (result as number[][]).flat();
}

export async function chatWithContext(
  question: string,
  context: string,
  history: { role: "user" | "assistant"; content: string }[] = [],
): Promise<string> {
  const systemPrompt = `You are a helpful assistant. Answer questions based ONLY on the context provided below. 
If the answer is not in the context, say "I don't have enough information to answer that."
Always answer in the same language as the question.

Context:
${context}`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: question },
    ],
    max_tokens: 1024,
  });

  return response.choices[0].message.content ?? "";
}
