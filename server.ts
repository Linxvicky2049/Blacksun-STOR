import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please add it via Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ==================== API ENDPOINTS ====================

// 1. Get Daily Quote (AI-Generated or Grounded)
app.get("/api/gemini/quote", async (req, res) => {
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Generate an inspiring, highly professional, and mindful productivity quote of the day. Return structured JSON with fields: quote, author, and interpretation.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: { type: Type.STRING, description: "The inspirational quote itself." },
            author: { type: Type.STRING, description: "The author of the quote (can be a historically famous person or 'Aether Co-Pilot')." },
            interpretation: { type: Type.STRING, description: "A brief, 1-2 sentence mindful reflection on how this quote applies to modern deep focus and creative craft." },
          },
          required: ["quote", "author", "interpretation"],
        },
      },
    });

    if (response.text) {
      res.json(JSON.parse(response.text.trim()));
    } else {
      res.status(500).json({ error: "Empty response from Gemini model" });
    }
  } catch (error: any) {
    console.error("Error generating quote:", error);
    res.json({
      quote: "Focus is a muscle, and patience is its strength.",
      author: "Marcus Aurelius",
      interpretation: "To achieve profound mastery, one must embrace the quiet repetition of craft and shut out the noise of modern distraction."
    });
  }
});

// 2. Chat with AI Co-Pilot
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, systemInstruction } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request: messages must be an array" });
    }

    const ai = getGeminiClient();

    // Map conversation array to Gemini contents format
    const contents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction || "You are an elegant, highly capable, and composed AI Co-Pilot named Aether inside a premium productivity workspace. Provide direct, helpful, and beautifully formatted markdown answers. Keep your explanations concise, structured, and focused on visual quality and functional outcomes.",
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in chat co-pilot:", error);
    res.status(500).json({ error: error.message || "Failed to communicate with AI Co-Pilot." });
  }
});

// 3. Summarize / Analyze Notes
app.post("/api/gemini/analyze-note", async (req, res) => {
  try {
    const { noteTitle, noteContent, action } = req.body;
    if (!noteContent) {
      return res.status(400).json({ error: "Note content is required" });
    }

    const ai = getGeminiClient();
    
    let prompt = "";
    if (action === "summarize") {
      prompt = `Analyze the following note titled "${noteTitle || "Untitled"}" and provide a concise, elegant, bulleted executive summary of its core ideas:\n\n${noteContent}`;
    } else if (action === "action-items") {
      prompt = `Read the following note titled "${noteTitle || "Untitled"}" and extract a clean list of explicit actionable task check-items. Return them as a structured JSON list of strings.\n\n${noteContent}`;
    } else if (action === "enhance") {
      prompt = `Rewrite the following note to make it more professional, structured, and visually clear, preserving the original intent and core points:\n\n${noteContent}`;
    }

    if (action === "action-items") {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
      });
      res.json({ items: JSON.parse(response.text?.trim() || "[]") });
    } else {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });
      res.json({ text: response.text });
    }
  } catch (error: any) {
    console.error("Error analyzing note:", error);
    res.status(500).json({ error: error.message || "Failed to analyze note." });
  }
});

// 4. Smart Task Board / Checklist Generator
app.post("/api/gemini/generate-tasks", async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ error: "Project description is required" });
    }

    const ai = getGeminiClient();
    const prompt = `Break down the following project or goal into 4 to 6 detailed, structured, and actionable subtasks with estimated efforts and priorities:\n\n"${description}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Action-oriented concise task title." },
              description: { type: Type.STRING, description: "Clear detail of what needs to be done." },
              priority: { type: Type.STRING, description: "Must be exactly 'low', 'medium', or 'high'." },
              estimatedTime: { type: Type.STRING, description: "Estimated time duration, e.g., '1 hour', '45 mins', '2 hours'." },
            },
            required: ["title", "description", "priority", "estimatedTime"],
          },
        },
      },
    });

    if (response.text) {
      res.json({ tasks: JSON.parse(response.text.trim()) });
    } else {
      res.status(500).json({ error: "Empty response from task generation model" });
    }
  } catch (error: any) {
    console.error("Error generating tasks:", error);
    res.status(500).json({ error: error.message || "Failed to generate tasks." });
  }
});

// ==================== VITE & STATIC FILES MIDDLEWARE ====================

// Serve generated images from the local workspace src/assets/images folder
app.use("/src/assets/images", express.static(path.join(process.cwd(), "src/assets/images")));

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
