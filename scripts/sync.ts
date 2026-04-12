// Force set the MongoDB URI for local development
process.env.MONGODB_URI = "mongodb://localhost:27017/unical";

import { BauApiClient, BauScrapingService, SyncOrchestrator } from "../lib/Scraping";
import { config } from "../lib/Scraping/config";

async function main() {
  console.log("MONGODB_URI is set to:", process.env.MONGODB_URI);
  
  const apiClient = new BauApiClient(config);
  const scrapingService = new BauScrapingService(apiClient);
  const orchestrator = new SyncOrchestrator(scrapingService);

  console.log("Starting sync...");
  await orchestrator.syncDegrees();
  await orchestrator.syncColleges();
  await orchestrator.syncDepartments();
  await orchestrator.syncAllColleges();
  console.log("Sync completed.");
}

main().catch(console.error);