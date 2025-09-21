import { VertexAI } from "@google-cloud/vertexai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { documentText } = await request.json();
    if (!documentText) {
      return NextResponse.json({ error: "Missing documentText" }, { status: 400 });
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

    const prompt = `You are a legal assistant specializing in document analysis. 
Summarize the following legal document into clear, actionable bullet points. 
Focus on:
- Key obligations and responsibilities for each party
- Important rights and protections
- Potential risks and liabilities
- Critical deadlines or time-sensitive clauses
- Financial terms and payment obligations
- Termination conditions

Format your response with clear bullet points and section headers where appropriate.

Document:
${documentText}`;

    const result = await model.generateContent(prompt);
    const summary = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("Summarization Error:", error);
    
    // Provide more specific error messages
    if (error.message.includes("SyntaxError") || error.message.includes("<!DOCTYPE")) {
      return NextResponse.json({ 
        error: "Authentication error with Vertex AI. Please check your credentials and project configuration." 
      }, { status: 500 });
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}