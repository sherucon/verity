import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { fileBase64 } = await request.json();
    if (!fileBase64) {
      return NextResponse.json({ error: "Missing fileBase64" }, { status: 400 });
    }

    // Validate environment variables - use either full endpoint or individual components
    const processorName = process.env.PROCESSOR_ENDPOINT || 
      `projects/${process.env.PROJECT_ID}/locations/${process.env.LOCATION}/processors/${process.env.PROCESSOR_ID}`;
    
    if (!processorName || processorName.includes('undefined')) {
      return NextResponse.json({ 
        error: "Missing processor configuration. Set either PROCESSOR_ENDPOINT or PROJECT_ID/LOCATION/PROCESSOR_ID" 
      }, { status: 500 });
    }

    // Initialize client with explicit credentials if provided
    const clientOptions: any = {};
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      clientOptions.keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    }
    
    const client = new DocumentProcessorServiceClient(clientOptions);
    
    console.log("Processing document with processor:", processorName);

    const documentRequest = {
      name: processorName,
      rawDocument: {
        content: Buffer.from(fileBase64, "base64"),
        mimeType: "application/pdf",
      },
    };

    const [result] = await client.processDocument(documentRequest);
    const text = result.document?.text || "";

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ 
        error: "No text extracted from document. Please ensure the PDF contains readable text." 
      }, { status: 400 });
    }

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("OCR Error:", error);
    
    // Provide more specific error messages
    if (error.code === 3) {
      return NextResponse.json({ 
        error: "Invalid request to Document AI. Please check your processor endpoint and project configuration." 
      }, { status: 400 });
    }
    
    if (error.code === 7) {
      return NextResponse.json({ 
        error: "Access denied. Please check your authentication and permissions." 
      }, { status: 403 });
    }

    return NextResponse.json({ 
      error: `Document processing failed: ${error.message}` 
    }, { status: 500 });
  }
}