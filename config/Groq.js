import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function main(prompt) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt, // ✅ FIXED (no quotes)
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return response.choices[0].message.content; // ✅ FIXED

  } catch (error) {
    console.error("Groq Error:", error);
    throw error;
  }
}

export default main;