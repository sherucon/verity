"use client";

import ReactMarkdown from 'react-markdown';

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
      
      <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-800">
        <ReactMarkdown
          components={{
            h1: ({children}) => <h1 className="text-lg font-semibold text-gray-900 mt-4 mb-2">{children}</h1>,
            h2: ({children}) => <h2 className="text-md font-semibold text-gray-800 mt-4 mb-2">{children}</h2>,
            h3: ({children}) => <h3 className="text-sm font-semibold text-gray-800 mt-3 mb-1">{children}</h3>,
            p: ({children}) => <p className="text-gray-700 mb-2 leading-relaxed">{children}</p>,
            ul: ({children}) => <ul className="list-disc ml-4 mb-3 space-y-1">{children}</ul>,
            ol: ({children}) => <ol className="list-decimal ml-4 mb-3 space-y-1">{children}</ol>,
            li: ({children}) => <li className="text-gray-700">{children}</li>,
            strong: ({children}) => <strong className="font-semibold text-gray-800">{children}</strong>,
            em: ({children}) => <em className="italic text-gray-700">{children}</em>,
            blockquote: ({children}) => <blockquote className="border-l-4 border-blue-200 pl-4 italic text-gray-600 my-3">{children}</blockquote>,
          }}
        >
          {summary}
        </ReactMarkdown>
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