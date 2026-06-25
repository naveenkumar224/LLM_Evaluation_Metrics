import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), "..", ".env") });

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3002,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  GROQ_API_KEY: process.env.GROQ_API_KEY || "",
  TESTLEAF_API_KEY: process.env.TESTLEAF_API_KEY || "",
  DEEPEVAL_URL: process.env.DEEPEVAL_URL || `http://localhost:${process.env.DEEPEVAL_PORT || "8002"}/eval`,
};

// Validate required environment variables
if (!ENV.GROQ_API_KEY && !ENV.OPENAI_API_KEY && !ENV.TESTLEAF_API_KEY) {
  console.warn(
    "Warning: No API keys set (GROQ_API_KEY, OPENAI_API_KEY, TESTLEAF_API_KEY). LLM calls will fail."
  );
} else {
  if (!ENV.GROQ_API_KEY) {
    console.info("ℹ️ GROQ_API_KEY not configured. Groq provider is unavailable.");
  } else {
    console.info("✓ Groq provider available.");
  }
  if (!ENV.OPENAI_API_KEY) {
    console.info("ℹ️ OPENAI_API_KEY not configured. OpenAI provider is unavailable.");
  } else {
    console.info("✓ OpenAI provider available.");
  }
  if (!ENV.TESTLEAF_API_KEY) {
    console.info("ℹ️ TESTLEAF_API_KEY not configured. Testleaf provider is unavailable.");
  } else {
    console.info("✓ Testleaf provider available.");
  }
}
