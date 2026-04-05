import { Model } from "mongoose";
import connect from "../db/db";
import { FetchParams } from "./scrape_types";

const API_URL = "https://app2.bau.edu.jo:7799/courses/actions/rmiMethod";
const DEFAULT_HEADERS = {
  accept: "*/*",
  "accept-language": "en-US,en;q=0.9,ar;q=0.8",
  "content-type": "application/x-www-form-urlencoded",
  "sec-ch-ua":
    '"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  Referer: "https://app2.bau.edu.jo:7799/courses/index.jsp",
};

/**
 * Fetches data from the BAU courses API (https://app2.bau.edu.jo:7799/courses/index.jsp)
 * by simulating an RMI (Remote Method Invocation) POST request.
 * * @template T - The expected shape of the objects within the returned array. Defaults to Object.
 * @param {string} rmiMethod - The specific header method value or endpoint identifier to call.
 * @param {Array<number>} [rmiArgs=[]] - Array of numerical parameters required by the requested method.
 * @throws {ParamsInvalid} Throws if the length of the `params` array does not exactly match `paramCount`.
 * @throws {ParamsCountInvalid} Throws if `paramCount` is a negative number.
 * @returns {Promise<Array<T>>} A promise that resolves to an array of objects of type T.
 */
export const fetchData = async <T = Object>(
  rmiMethod: string,
  rmiArgs: Array<number> = [],
): Promise<Array<T>> => {
  const bodyData = new URLSearchParams();

  bodyData.append("method", rmiMethod);
  bodyData.append("paramsCount", rmiArgs.length.toString());

  rmiArgs.forEach((param, index) => {
    bodyData.append(`param${index}`, param.toString());
  });

  const res = await fetch(API_URL, {
    headers: DEFAULT_HEADERS,
    body: bodyData,
    method: "POST",
  });
  return formatJsonData(await res.text()) as Array<T>;
};

/**
 * Sanitizes and parses a malformed JSON string by replacing all single quotes
 * with double quotes to ensure valid JSON syntax before parsing.
 *
 * @param {string} data - The raw string response from the API.
 * @returns {Object} The parsed JavaScript object/array.
 */
const formatJsonData = (data: string): Object => {
  const jsonData = data.replace(/'/g, '"');
  return JSON.parse(jsonData);
};

/**
 * Fetches data from the external API and synchronizes it with the MongoDB database using Mongoose bulk operations.
 * This function decouples the fetch logic from the database schema by allowing the caller to define the mapping strategy.
 *
 * @template T - The expected shape of the data objects returned by the API.
 * @param {FetchParams} config - Configuration object for the fetch request and database model.
 * @param {string} config.method - The RMI method name to invoke on the external API.
 * @param {Model<any>} config.model - The Mongoose model where the data should be saved.
 * @param {number[]} [config.paramList=[]] - An array of numerical parameters to send with the API request.
 * @param {(item: T) => any} buildUpsertDoc - A callback function that transforms a fetched item into a Mongoose bulk write operation object (e.g., `updateOne` with `upsert: true`).
 * @returns {Promise<void>} Resolves when the synchronization and database bulk write are complete.
 */

export const fetchAndSave = async <T>(
  { rmiMethod, model, paramList = [] }: FetchParams,
  buildUpsertDoc: (item: T) => any,
) => {
  const data = await fetchData<T>(rmiMethod, paramList);
  await connect();

  const bulk = data.map(buildUpsertDoc);
  if (bulk.length > 0) {
    const result = await model.bulkWrite(bulk);
    console.log(
      `Sync complete: ${result.upsertedCount} inserted, ${result.modifiedCount} updated.`,
    );
  } else {
    console.log("No data fetched from API.");
  }
};

/**
 * Queries the external API to determine the total number of pagination pages available
 * for a specific combination of degree, college, and department courses.
 *
 * @param {number} degreeId - The unique identifier for the degree.
 * @param {number} collegeId - The unique identifier for the college.
 * @param {number} departmentId - The unique identifier for the department.
 * @returns {Promise<number>} A promise that resolves to the total number of pages.
 */

export const getPagesCount = async (
  degreeId: number,
  collegeId: number,
  departmentId: number,
): Promise<number> => {
  const bodyData = new URLSearchParams();

  bodyData.append("method", "getCoursesPagesCount");
  bodyData.append("paramsCount", "3");
  bodyData.append("param0", degreeId.toString());
  bodyData.append("param1", collegeId.toString());
  bodyData.append("param2", departmentId.toString());

  const res = await fetch(API_URL, {
    headers: DEFAULT_HEADERS,
    body: bodyData,
    method: "POST",
  });
  return Number(await res.text());
};
