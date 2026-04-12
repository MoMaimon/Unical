import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

async function main() {
  dotenvConfig({ path: resolve(process.cwd(), '.env.local') });

  if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI not found in .env.local, using default local URI");
    process.env.MONGODB_URI = "mongodb://localhost:27017/unical";
  }

  const { BauApiClient, BauScrapingService, SyncOrchestrator } = await import("../lib/Scraping");
  const { config } = await import("../lib/Scraping/config");

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