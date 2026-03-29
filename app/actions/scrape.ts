"use server";

import connect from "@/lib/db/db";
import College from "@/lib/db/models/colleges";
import Degree from "@/lib/db/models/degrees";
import { fetchData } from "@/lib/Scraping/scrape";
import { Model } from "mongoose";

// type degreeType = { name: string; id: string };

export const fetchAndSaveDegrees = async () => {
  fetchAndSave("getDegrees", Degree);
};

export const fetchAndSaveColleges = async () => {
  fetchAndSave("getColleges", College);
};

const fetchAndSave = async (
  method: string,
  model: Model<any, {}, {}, {}, any, any, any>,
) => {
  try {
    const data = await fetchData<selectType>(method, 0);
    await connect();
    const bulk = data.map((value) => ({
      updateOne: {
        filter: { _id: value.id },
        update: { $set: { name: value.name } },
        upsert: true,
      },
    }));

    if (bulk.length > 0) {
      const result = await model.bulkWrite(bulk);
      console.log(
        `Sync complete: ${result.upsertedCount} inserted, ${result.modifiedCount} updated.`,
      );
    } else {
      console.log("No data fetched from API.");
    }
  } catch (error: any) {
    console.log("error");
  }
};
