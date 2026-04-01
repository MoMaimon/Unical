"use server";
import pLimit from "p-limit";
import connect from "@/lib/db/db";
import College from "@/lib/db/models/colleges";
import Degree from "@/lib/db/models/degrees";
import Department from "@/lib/db/models/departments";
import { fetchAndSave, getPagesCount } from "@/lib/Scraping/scrape";
import Course from "@/lib/db/models/courses";

const getCollegesIds = async (): Promise<Array<number>> => {
  await connect();
  const allIds = await College.find({}, "_id").lean();
  const data = allIds.map((doc) => doc._id);
  return data;
};

const getDegreesIds = async (): Promise<Array<number>> => {
  await connect();
  const allIds = await Degree.find({}, "_id").lean();
  const data = allIds.map((doc) => doc._id);
  return data;
};

const getDepartmentsIds = async (
  college_id: number,
): Promise<Array<number>> => {
  await connect();
  const allIds = await Department.find({ college: college_id }, "_id").lean();
  const data = allIds.map((doc) => doc._id);
  return data;
};

export const fetchAndSaveDegrees = async () => {
  fetchAndSave("getDegrees", Degree);
};

export const fetchAndSaveColleges = async () => {
  fetchAndSave("getColleges", College);
};

export const fetchAndSaveDepartments = async () => {
  const colleges = await getCollegesIds();
  for (const college of colleges) {
    await fetchAndSave("getDepartments", Department, 1, {
      data: "departments",
      params: { college_id: college },
    });
  }
};

// export const fetchAndSaveCourses = async () => {
//   const degrees = await getDegreesIds();
//   const colleges = await getCollegesIds();

//   // Limit to 5 concurrent requests at a time
//   const limit = pLimit(5);
//   const tasks = [];

//   for (const degree of degrees) {
//     for (const college of colleges) {
//       const departments = await getDepartmentsIds(college);
//       for (const department of departments) {
//         tasks.push(
//           limit(async () => {
//             const pagesCount = await getPagesCount(degree, college, department);
//             const pageTasks = [];
//             for (let i = 1; i <= pagesCount; i++) {
//               pageTasks.push(
//                 fetchAndSave("getCourses", Course, 4, {
//                   data: "courses",
//                   params: {
//                     college_id: college,
//                     degree_id: degree,
//                     department_id: department,
//                     page: i,
//                   },
//                 }),
//               );
//             }
//             await Promise.all(pageTasks);
//           }),
//         );
//       }
//     }
//   }

//   await Promise.all(tasks);
// };
// app/actions/scrape.ts (Add these two functions)

// Helper to get colleges so the client knows what to loop through
export const fetchCollegesList = async () => {
  return await getCollegesIds();
};

// The new targeted sync function
export const fetchAndSaveCoursesForCollege = async (college: number) => {
  const degrees = await getDegreesIds();
  const departments = await getDepartmentsIds(college); // Only get this college's departments

  // Limit concurrency to 2 to be safe
  const limit = pLimit(2);
  const tasks = [];

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  for (const degree of degrees) {
    for (const department of departments) {
      tasks.push(
        limit(async () => {
          const pagesCount = await getPagesCount(degree, college, department);
          
          if (!pagesCount || pagesCount < 1) return;

          for (let i = 1; i <= pagesCount; i++) {
            await fetchAndSave("getCourses", Course, 4, {
              data: "courses",
              params: {
                degree_id: degree,
                college_id: college,
                department_id: department,
                page: i,
              },
            });
            await delay(300); // 300ms delay between pages
          }
        })
      );
    }
  }

  await Promise.all(tasks);
  console.log(`Finished syncing college: ${college}`);
};