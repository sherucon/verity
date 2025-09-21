import { VertexAI } from "@google-cloud/vertexai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { documentText, question } = await request.json();
    if (!documentText || !question) {
      return NextResponse.json({ error: "Missing documentText or question" }, { status: 400 });
    }

    // Initialize Vertex AI with proper configuration
    const vertexConfig: any = { 
      project: process.env.PROJECT_ID!, 
      location: "us-central1" // Use specific region for Vertex AI
    };
    
    // Add credentials if specified
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      vertexConfig.googleAuthOptions = {
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
      };
    }

    const vertex = new VertexAI(vertexConfig);
    const model = vertex.getGenerativeModel({ model: "gemini-2.5-pro" }); // Fixed model name

    const prompt = `You are a helpful legal assistant with expertise in contract and legal document analysis.

Based ONLY on the document provided below, answer the user's question clearly and accurately.

Guidelines:
- If the answer is directly stated in the document, provide the relevant information with specific references
- If the answer requires interpretation of legal language, explain it in plain English
- If the information is not present in the document, clearly state that you cannot find it
- Cite specific sections or clauses when possible
- If the question involves legal advice, remind the user to consult with a qualified attorney

Document:
${documentText}

User Question: ${question}

Answer:`;

    const result = await model.generateContent(prompt);
    const answer = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("Q&A Error:", error);
    
    // Provide more specific error messages
    if (error.message.includes("SyntaxError") || error.message.includes("<!DOCTYPE")) {
      return NextResponse.json({ 
        error: "Authentication error with Vertex AI. Please check your credentials and project configuration." 
      }, { status: 500 });
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}