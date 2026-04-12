import { Model } from "mongoose";

export class BaseRepository<T> {
  constructor(private model: Model<any>) {}

  async upsertMany(items: T[], buildUpsertDoc: (item: T) => any): Promise<void> {
    if (!items.length) return;
    const operations = items.map(buildUpsertDoc).filter(Boolean);
    if (operations.length === 0) return;
    const result = await this.model.bulkWrite(operations);
    console.log(
      `[${this.model.modelName}] Upserted: ${result.upsertedCount} inserted, ${result.modifiedCount} modified.`
    );
  }

  async distinctIds(field: string = "_id", filter: any = {}): Promise<number[]> {
    return this.model.distinct(field, filter);
  }
}