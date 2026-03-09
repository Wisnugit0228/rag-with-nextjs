export async function embedText(text: string): Promise<number[]> {
  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/intfloat/e5-small-v2",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text, // ✅ string biasa
      }),
    },
  );

  const raw = await response.text();

  if (!response.ok) {
    console.error("HF ERROR:", raw);
    throw new Error(`HF embedding failed: ${raw}`);
  }

  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error("Invalid HF embedding response shape");
  }

  return data;
}
