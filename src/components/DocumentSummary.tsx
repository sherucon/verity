"use client";

import { ReactElement } from "react";

interface DocumentSummaryProps {
  summary: string;
  isLoading: boolean;
}

export default function DocumentSummary({ summary, isLoading }: DocumentSummaryProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Document Summary
        </h2>
        <div className="space-y-3">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  // Function to parse markdown-like formatting from AI response
  const formatSummary = (text: string) => {
    // Split by lines and process each line
    const lines = text.split('\n');
    const formattedLines: ReactElement[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        formattedLines.push(<br key={index} />);
        return;
      }

      // Headers (lines starting with #)
      if (trimmedLine.startsWith('##')) {
        formattedLines.push(
          <h3 key={index} className="text-md font-semibold text-gray-800 mt-4 mb-2">
            {trimmedLine.replace(/^##\s*/, '')}
          </h3>
        );
      } else if (trimmedLine.startsWith('#')) {
        formattedLines.push(
          <h2 key={index} className="text-lg font-semibold text-gray-900 mt-4 mb-2">
            {trimmedLine.replace(/^#\s*/, '')}
          </h2>
        );
      }
      // Bullet points (lines starting with - or *)
      else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        formattedLines.push(
          <li key={index} className="text-gray-700 mb-1 ml-4">
            {trimmedLine.replace(/^[-*]\s*/, '')}
          </li>
        );
      }
      // Bold text (lines starting with **)
      else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        formattedLines.push(
          <p key={index} className="font-semibold text-gray-800 mb-2">
            {trimmedLine.replace(/\*\*/g, '')}
          </p>
        );
      }
      // Regular paragraphs
      else {
        formattedLines.push(
          <p key={index} className="text-gray-700 mb-2">
            {trimmedLine}
          </p>
        );
      }
    });

    return formattedLines;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg
          className="w-5 h-5 text-blue-600 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Document Summary
      </h2>
      
      <div className="prose prose-sm max-w-none">
        <div className="space-y-1">
          {formatSummary(summary)}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          AI-generated summary • Please review with a legal professional for important decisions
        </p>
      </div>
    </div>
  );
}