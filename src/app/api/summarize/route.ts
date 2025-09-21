import { VertexAI } from "@google-cloud/vertexai";
import { NextRequest, NextResponse } from "next/server";

interface VertexAIConfig {
  project: string;
  location: string;
  googleAuthOptions?: {
    credentials?: Record<string, unknown>;
    keyFilename?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { documentText } = await request.json();
    if (!documentText) {
      return NextResponse.json({ error: "Missing documentText" }, { status: 400 });
    }

    // Initialize Vertex AI with proper configuration
    const vertexConfig: VertexAIConfig = { 
      project: process.env.PROJECT_ID!, 
      location: "us-central1" // Use specific region for Vertex AI
    };
    
    // Add credentials - prioritize JSON string over file path
    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      try {
        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
        vertexConfig.googleAuthOptions = {
          credentials: credentials
        };
      } catch (error) {
        console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:", error);
        return NextResponse.json({ 
          error: "Invalid service account JSON format" 
        }, { status: 500 });
      }
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      vertexConfig.googleAuthOptions = {
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
      };
    }
    // If neither is provided, will use default credentials

    const vertex = new VertexAI(vertexConfig);
    const model = vertex.getGenerativeModel({ model: "gemini-2.5-pro" });

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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("Summarization Error:", error);
    
    // Provide more specific error messages
    if (errorMessage.includes("SyntaxError") || errorMessage.includes("<!DOCTYPE")) {
      return NextResponse.json({ 
        error: "Authentication error with Vertex AI. Please check your credentials and project configuration." 
      }, { status: 500 });
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}