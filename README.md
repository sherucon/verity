# Verity - Legal Document Analyzer

A Next.js application that uses Google Cloud Document AI for OCR and Vertex AI's Gemini model to analyze legal documents and provide AI-powered Q&A functionality.

## Features

- **PDF Upload**: Drag-and-drop PDF upload with file validation
- **OCR Processing**: Extract text from legal documents using Google Cloud Document AI
- **AI Summarization**: Generate key points and summaries using Gemini 1.5 Pro
- **Interactive Q&A**: Ask questions about the document with conversational AI
- **Professional UI**: Clean, responsive interface optimized for legal document analysis

## Prerequisites

1. **Google Cloud Project** with the following APIs enabled:

   - Document AI API
   - Vertex AI API

2. **Document AI Processor**: Create a Document AI processor for OCR

   - Go to the [Document AI Console](https://console.cloud.google.com/ai/document-ai)
   - Create a new processor (type: "Document OCR")
   - Note the Processor ID

3. **Authentication**: Set up Google Cloud authentication
   - For local development: Install [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) and run `gcloud auth application-default login`
   - For production: Use service account keys or workload identity

## Setup

1. **Clone and install dependencies**:

   ```bash
   npm install
   ```

2. **Environment Configuration**:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your values:

   ```env
   PROJECT_ID=your-google-cloud-project-id
   LOCATION=us-central1
   PROCESSOR_ID=your-document-ai-processor-id
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

4. **Open the application**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Upload Document**: Drag and drop or click to upload a PDF legal document
2. **Wait for Processing**: The app will extract text using OCR and generate a summary
3. **Review Summary**: Read the AI-generated key points and analysis
4. **Ask Questions**: Use the chat interface to ask specific questions about the document

## API Endpoints

- `POST /api/extract-text` - Extract text from PDF using Document AI
- `POST /api/summarize` - Generate document summary using Gemini
- `POST /api/ask` - Answer questions about the document using Gemini

## Architecture

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **OCR**: Google Cloud Document AI for PDF text extraction
- **AI**: Google Vertex AI (Gemini 1.5 Pro) for summarization and Q&A
- **Styling**: Tailwind CSS with responsive design

## Security Notes

- File size limited to 10MB
- Only PDF files accepted
- All processing happens server-side
- No document content is stored permanently

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**: Ensure all dependencies are installed with `npm install`

2. **Authentication errors**:

   - Verify Google Cloud authentication is set up
   - Check that your project has the required APIs enabled
   - Ensure the processor ID is correct

3. **OCR failures**:

   - Verify the PDF contains readable text (not scanned images)
   - Check file size is under 10MB
   - Ensure the Document AI processor is properly configured

4. **AI response errors**:
   - Verify Vertex AI API is enabled in your project
   - Check that the location supports Gemini models
   - Ensure sufficient quotas for API usage

### Development

To run in development mode with detailed error logging:

```bash
npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
