"use server";

import College from "@/lib/db/models/colleges";
import Degree from "@/lib/db/models/degrees";
import { fetchAndSave} from "@/lib/Scraping/scrape";



export const fetchAndSaveDegrees = async () => {
  fetchAndSave("getDegrees", Degree);
};

export const fetchAndSaveColleges = async () => {
  fetchAndSave("getColleges", College);
};


