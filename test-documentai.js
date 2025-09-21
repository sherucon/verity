#!/usr/bin/env node

// Test script for Document AI configuration
const { DocumentProcessorServiceClient } = require("@google-cloud/documentai");
require('dotenv').config({ path: '.env' });

async function testDocumentAI() {
  try {
    console.log("Testing Document AI Configuration...");
    console.log("PROJECT_ID:", process.env.PROJECT_ID);
    console.log("LOCATION:", process.env.LOCATION);
    console.log("PROCESSOR_ID:", process.env.PROCESSOR_ID);
    console.log("GOOGLE_APPLICATION_CREDENTIALS:", process.env.GOOGLE_APPLICATION_CREDENTIALS);
    
    // Initialize client
    const clientOptions = {};
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      clientOptions.keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    }
    
    const client = new DocumentProcessorServiceClient(clientOptions);
    
    // Test processor path
    const processorPath = `projects/${process.env.PROJECT_ID}/locations/${process.env.LOCATION}/processors/${process.env.PROCESSOR_ID}`;
    console.log("Processor path:", processorPath);
    
    // Test basic connectivity by listing processors
    console.log("\nTesting connectivity by listing processors...");
    const parent = `projects/${process.env.PROJECT_ID}/locations/${process.env.LOCATION}`;
    
    try {
      const [processors] = await client.listProcessors({ parent });
      console.log("✅ Successfully connected to Document AI");
      console.log(`Found ${processors.length} processors in your project:`);
      
      processors.forEach((processor, index) => {
        const processorId = processor.name?.split('/').pop();
        console.log(`  ${index + 1}. ${processor.displayName} (ID: ${processorId}, Type: ${processor.type})`);
        
        if (processorId === process.env.PROCESSOR_ID) {
          console.log("     ✅ This matches your configured PROCESSOR_ID");
        }
      });
      
      if (!processors.find(p => p.name?.endsWith(process.env.PROCESSOR_ID))) {
        console.log(`\n❌ Warning: PROCESSOR_ID "${process.env.PROCESSOR_ID}" not found in the list above.`);
        console.log("Please verify your PROCESSOR_ID is correct.");
      }
      
    } catch (listError) {
      console.error("❌ Failed to list processors:", listError.message);
      console.error("This might indicate authentication or permission issues.");
    }
    
  } catch (error) {
    console.error("❌ Configuration test failed:", error.message);
    
    if (error.code === 7) {
      console.error("\n💡 This looks like an authentication error. Try:");
      console.error("   1. Run: gcloud auth application-default login");
      console.error("   2. Or verify your service account key file path");
    }
    
    if (error.code === 3) {
      console.error("\n💡 This looks like an invalid argument error. Check:");
      console.error("   1. Your PROJECT_ID is correct");
      console.error("   2. Your PROCESSOR_ID exists in the specified project/location");
      console.error("   3. Document AI API is enabled in your project");
    }
  }
}

testDocumentAI();