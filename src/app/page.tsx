"use client";

import { useState } from "react";
import PDFUpload from "@/components/PDFUpload";
import DocumentSummary from "@/components/DocumentSummary";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const [documentText, setDocumentText] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDocumentProcessed = (text: string, documentSummary: string) => {
    setDocumentText(text);
    setSummary(documentSummary);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Verity - Legal Document Analyzer
          </h1>
          <p className="text-gray-600 mt-1">
            Upload a legal document for AI-powered analysis and Q&A
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload and Summary */}
          <div className="space-y-6">
            <PDFUpload 
              onDocumentProcessed={handleDocumentProcessed}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
            
            {summary && (
              <DocumentSummary 
                summary={summary}
                isLoading={isProcessing}
              />
            )}
          </div>

          {/* Right Column - Chat Interface */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <ChatInterface 
              documentText={documentText}
              disabled={!documentText || isProcessing}
            />
          </div>
        </div>
      </main>
    </div>
  );
}