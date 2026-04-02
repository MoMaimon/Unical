import { Model } from "mongoose";
import connect from "../db/db";
import type { selectType, params } from "./scrape_types";

/**
 * Fetches data from the BAU courses API (https://app2.bau.edu.jo:7799/courses/index.jsp)
 * by simulating an RMI (Remote Method Invocation) POST request.
 * * @template T - The expected shape of the objects within the returned array. Defaults to Object.
 * @param {string} method - The specific header method value or endpoint identifier to call.
 * @param {number} paramCount - The exact number of parameters being passed. Must match the length of the `params` array.
 * @param {Array<number>} [params=[]] - Array of numerical parameters required by the requested method.
 * @throws {ParamsInvalid} Throws if the length of the `params` array does not exactly match `paramCount`.
 * @throws {ParamsCountInvalid} Throws if `paramCount` is a negative number.
 * @returns {Promise<Array<T>>} A promise that resolves to an array of objects of type T.
 */
export const fetchData = async <T = Object>(
  method: string,
  paramCount: number,
  params: Array<number> = [],
): Promise<Array<T>> => {
  console.log("called");

  if (params.length != paramCount) {
    throw new ParamsInvalid();
  }
  if (paramCount < 0) {
    throw new ParamsCountInvalid();
  }
  let paramsString: string = "";
  if (paramCount > 0) {
    params.forEach((param, index) => {
      paramsString += `&param${index}=${param}`;
    });
  }
  const res = await fetch(
    "https://app2.bau.edu.jo:7799/courses/actions/rmiMethod",
    {
      headers: {
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
      },
      body: `method=${method}&paramsCount=${paramCount}${paramsString}`,
      method: "POST",
    },
  );
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
 * Fetches data from an external API and synchronizes it with a MongoDB database using Mongoose.
 * Uses `bulkWrite` to perform efficient upsert operations (inserting new records or updating existing ones).
 * * @param {string} method - The API method or endpoint identifier used to fetch the data.
 * @param {Model<any, {}, {}, {}, any, any, any>} model - The Mongoose model corresponding to the database collection to be updated.
 * @param {number} [paramCount=0] - The number of parameters expected by the fetch call. Defaults to 0.
 * @param {any} [params=null] - Optional configuration object containing additional parameters.
 * If provided, it should contain a `data` string (e.g., "departments") and a `params` object containing query values.
 * @throws {Error} Throws an error if an unsupported `params.data` type is provided, preventing bulk operation creation.
 * @returns {Promise<void>} A promise that resolves when the synchronization is complete.
 */

export const fetchAndSave = async (
  method: string,
  model: Model<any, {}, {}, {}, any, any, any>,
  paramCount: number = 0,
  params: params = null,
) => {
  const data = await fetchData<
    selectType & { hours?: { no: string; name: string; hours: string } }
  >(method, paramCount, params ? [...Object.values(params.params)] : []);

  await connect();

  let bulk;
  if (!params) {
    bulk = data.map((value) => {
      const recordId = "id" in value ? value.id : null;
      return {
        updateOne: {
          filter: { _id: recordId },
          update: { $set: { name: value.name } },
          upsert: true,
        },
      };
    });
  } else if (params.data === "departments") {
    bulk = data.map((value) => {
      const recordId = "id" in value ? value.id : null;
      return {
        updateOne: {
          filter: { _id: recordId },
          update: {
            $set: { name: value.name, college: params.params.college_id },
          },
          upsert: true,
        },
      };
    });
  } else if (params.data === "courses") {
    bulk = data.map((value) => {
      const recordId = "no" in value ? value.no : null;
      return {
        updateOne: {
          filter: { _id: recordId },
          update: {
            $set: {
              name: value.name,
              degree: (params.params as course).degree_id,
              college: params.params.college_id,
              department: (params.params as course).department_id,
              hours: (value as any).hours?.hours || (value as any).hours || 0,
            },
          },
          upsert: true,
        },
      };
    });
  }
  if (!bulk) {
    throw new InvalidConfiguration();
  }

  if (bulk.length > 0) {
    const result = await model.bulkWrite(bulk);
    console.log(
      `Sync complete: ${result.upsertedCount} inserted, ${result.modifiedCount} updated.`,
    );
  } else {
    console.log("No data fetched from API.");
  }
};

export const getPagesCount = async (
  degree_id: number,
  college_id: number,
  department_id: number,
): Promise<number> => {
  const res = await fetch(
    "https://app2.bau.edu.jo:7799/courses/actions/rmiMethod",
    {
      headers: {
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
      },
      body: `method=${"getCoursesPagesCount"}&paramsCount=${3}&param0=${degree_id}&param1=${college_id}&param2=${department_id}`,
      method: "POST",
    },
  );
  return Number(await res.text());
};

