import pLimit from "p-limit";
import connect from "@/features/scraping/server/db/db";
import College from "@/features/scraping/server/db/schema/colleges";
import Degree from "@/features/scraping/server/db/schema/degrees";
import Department from "@/features/scraping/server/db/schema/departments";
import { fetchAndSave, getPagesCount } from "@/features/scraping/lib/scrape";
import Course from "@/features/scraping/server/db/schema/courses";
import Section from "@/features/scraping/server/db/schema/sections";
import { prepareSectionData } from "../../lib/scrape_mappers";
import { DegreeApiResponse, CollegeApiResponse, DepartmentApiResponse, CourseApiResponse, SectionApiResponse } from "../../types/scrape_types";


/* -------------------------------------------------------------------------- */
/*                               Helper Methods                               */
/* -------------------------------------------------------------------------- */

/**
 * Retrieves an array of all College IDs currently stored in the database.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of college IDs.
 */
const getCollegeIds = async (): Promise<Array<string>> => {
  await connect();
  return await College.distinct("_id");
};

/**
 * Retrieves an array of Department IDs associated with a specific college.
 * @param {string} collegeId - The ID of the college to filter departments by.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of department IDs.
 */
const getDegreeIds = async (): Promise<Array<string>> => {
  await connect();
  return await Degree.distinct("_id");
};

/**
 * Retrieves an array of Department IDs associated with a specific college.
 * @param {string} collegeId - The ID of the college to filter departments by.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of department IDs.
 */
const getDepartmentIds = async (collegeId: string): Promise<Array<string>> => {
  await connect();
  return await Department.distinct("_id", { college: collegeId });
};

/**
 * Orchestrates the fetching and saving of paginated data (like courses or sections) across
 * all combinations of degrees and departments for a specific college. Utilizes concurrency
 * limits and delays to avoid rate-limiting from the target API.
 * @template T - The expected shape of the API response data.
 * @param {string} college - The ID of the college to sync data for.
 * @param {string} methodName - The RMI method to call (e.g., "getCourses").
 * @param {any} model - The Mongoose model to save the data into.
 * @param {(item: T) => any} buildUpsertDoc - A callback to transform the raw API item into a Mongoose bulk write operation.
 * @returns {Promise<void>} Resolves when all pages for all departments and degrees have been synced.
 */
const syncPaginatedData = async <T>(
  college: string,
  methodName: string,
  model: any,
  buildUpsertDoc: (item: T) => any,
) => {
  const degrees = await getDegreeIds();
  const departments = await getDepartmentIds(college);
  const limit = pLimit(2);
  const tasks = [];
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  for (const degree of degrees) {
    for (const department of departments) {
      tasks.push(
        limit(async () => {
          // The external BAU API requires numeric params — cast string IDs here only
          const degreeNum = Number(degree);
          const collegeNum = Number(college);
          const departmentNum = Number(department);
          const pagesCount = await getPagesCount(degreeNum, collegeNum, departmentNum);
          if (!pagesCount || pagesCount < 1) return;

          for (let i = 1; i <= pagesCount; i++) {
            await fetchAndSave<T>(
              {
                rmiMethod: methodName,
                model: model,
                paramList: [degreeNum, collegeNum, departmentNum, i],
              },
              buildUpsertDoc,
            );
            await delay(300);
          }
        }),
      );
    }
  }
  await Promise.all(tasks);
};

/* -------------------------------------------------------------------------- */
/*                              Syncing Functions                             */
/* -------------------------------------------------------------------------- */

/**
 * Fetches all degrees from the external API and upserts them into the database.
 * @returns {Promise<void>}
 */
export const syncDegrees = async () => {
  await fetchAndSave<DegreeApiResponse>(
    { rmiMethod: "getDegrees", model: Degree },
    (degree) => ({
      updateOne: {
        filter: { _id: degree.id },
        update: { $set: { name: degree.name } },
        upsert: true,
      },
    }),
  );
};

/**
 * Fetches all colleges from the external API and upserts them into the database,
 * skipping any blacklisted college IDs.
 * @returns {Promise<void>}
 */
export const syncColleges = async () => {
  const blackList = ["14", "12"];
  await fetchAndSave<CollegeApiResponse>(
    { rmiMethod: "getColleges", model: College },
    (college) => {
      if (blackList.includes(college.id)) {
        console.log(`Skipping blacklisted college: ${college.name}`);
        return null;
      }
      return {
        updateOne: {
          filter: { _id: college.id },
          update: { $set: { name: college.name } },
          upsert: true,
        },
      };
    },
  );
};

/**
 * Iterates through all saved colleges, fetches their respective departments
 * from the external API, and upserts them into the database.
 * @returns {Promise<void>}
 */
export const syncDepartments = async () => {
  const colleges = await getCollegeIds();
  for (const college of colleges) {
    await fetchAndSave<DepartmentApiResponse>(
      {
        rmiMethod: "getDepartments",
        model: Department,
        paramList: [Number(college)],
      },
      (department) => ({
        updateOne: {
          filter: { _id: department.id },
          update: { $set: { name: department.name, college: college } },
          upsert: true,
        },
      }),
    );
  }
};

/**
 * Fetches and synchronizes all courses for a specific college from the external API.
 * Uses pagination and concurrent request limits to prevent rate-limiting errors.
 * @param {string} college - The ID of the college to sync courses for.
 * @returns {Promise<void>}
 */
export const syncCourses = async (college: string) => {
  await syncPaginatedData<CourseApiResponse>(
    college,
    "getCourses",
    Course,
    (course) => ({
      updateOne: {
        filter: { _id: course.no },
        update: {
          $set: {
            name: course.name,
            college: college,
            hours: course.hours,
          },
        },
        upsert: true,
      },
    }),
  );
};

/**
 * Fetches and synchronizes all sections for a specific college from the external API.
 * It parses complex schedule and lecturer strings into structured database formats.
 * @param {string} college - The ID of the college to sync sections for.
 * @returns {Promise<void>}
 */
export const syncSections = async (college: string) => {
  await syncPaginatedData<SectionApiResponse>(
    college,
    "getCourses",
    Section,
    (section) => ({
      updateOne: {
        filter: {
          courseNo: section.no,
          sectionNo: section.sectionNo,
        },
        update: {
          $set: prepareSectionData(section),
        },
        upsert: true,
      },
    }),
  );
};
