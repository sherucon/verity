#!/usr/bin/env node

// More detailed diagnostic for Document AI
const { DocumentProcessorServiceClient } = require("@google-cloud/documentai");
require('dotenv').config({ path: '.env' });

async function diagnoseDocumentAI() {
  try {
    console.log("=== Document AI Diagnostic ===\n");
    
    // Initialize client
    const clientOptions = {};
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      clientOptions.keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    }
    
    const client = new DocumentProcessorServiceClient(clientOptions);
    
    // Test different locations to find processors
    const locations = ['us-central1', 'us-east1', 'us-west1', 'europe-west1', 'asia-east1'];
    
    console.log("Searching for processors in different locations...\n");
    
    for (const location of locations) {
      try {
        const parent = `projects/${process.env.PROJECT_ID}/locations/${location}`;
        console.log(`Checking location: ${location}`);
        
        const [processors] = await client.listProcessors({ parent });
        
        if (processors.length > 0) {
          console.log(`✅ Found ${processors.length} processors in ${location}:`);
          processors.forEach((processor, index) => {
            const processorId = processor.name?.split('/').pop();
            console.log(`  ${index + 1}. ${processor.displayName}`);
            console.log(`     ID: ${processorId}`);
            console.log(`     Type: ${processor.type}`);
            console.log(`     State: ${processor.state}`);
            console.log(`     Full path: ${processor.name}`);
            console.log("");
          });
        } else {
          console.log(`  No processors found in ${location}`);
        }
        
      } catch (error) {
        console.log(`  Error checking ${location}: ${error.message}`);
      }
    }
    
    console.log("\n=== Recommendations ===");
    console.log("1. Check if your processor ID exists in the output above");
    console.log("2. Verify the location matches where your processor was created");
    console.log("3. Ensure Document AI API is enabled in your project");
    console.log("4. If no processors found, create one at: https://console.cloud.google.com/ai/document-ai");
    
  } catch (error) {
    console.error("❌ Diagnostic failed:", error.message);
    
    if (error.message.includes("User not found") || error.message.includes("permission")) {
      console.log("\n💡 Authentication issue detected:");
      console.log("   1. Make sure you're authenticated: gcloud auth application-default login");
      console.log("   2. Or verify your service account has Document AI permissions");
    }
  }
}

diagnoseDocumentAI();