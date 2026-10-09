import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { streamText, convertToCoreMessages } from "ai";

const groq = createOpenAICompatible({
  name: "groq",
  apiKey: process.env.GROQ_API_KEY || "",
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Convert UIMessages to CoreMessages and add system message
  const coreMessages = convertToCoreMessages(messages);

  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    system:
      "You are a helpful assistant for the Folio documentation. Answer questions about Folio features, pricing, getting started, account management, import syncing, settings and preferences. Keep responses concise and helpful.",
    messages: coreMessages,
  });

  return result.toUIMessageStreamResponse();
}
