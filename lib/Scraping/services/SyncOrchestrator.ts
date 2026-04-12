import { BaseRepository } from "../repositories/BaseRepository";
import { BauScrapingService } from "./BauScrapingService";
import { RateLimiter } from "../utils/rateLimiter";
import { config } from "../config";
import { DegreeMapper } from "../mappers/DegreeMapper";
import { CollegeMapper } from "../mappers/CollegeMapper";
import { DepartmentMapper } from "../mappers/DepartmentMapper";
import { CourseMapper } from "../mappers/CourseMapper";
import { SectionMapper } from "../mappers/SectionMapper";
import connect from "../../db/db";
import Degree from "../../db/models/degrees";
import College from "../../db/models/colleges";
import Department from "../../db/models/departments";
import Course from "../../db/models/courses";
import Section from "../../db/models/sections";
import {
  DegreeApiResponse,
  CollegeApiResponse,
  DepartmentApiResponse,
  CourseApiResponse,
  SectionApiResponse,
} from "../scrape_types";

export class SyncOrchestrator {
  private degreeRepo = new BaseRepository<DegreeApiResponse>(Degree);
  private collegeRepo = new BaseRepository<CollegeApiResponse>(College);
  private departmentRepo = new BaseRepository<DepartmentApiResponse>(Department);
  private courseRepo = new BaseRepository<CourseApiResponse>(Course);
  private sectionRepo = new BaseRepository<SectionApiResponse>(Section);
  private rateLimiter = new RateLimiter(
    config.scraping.maxConcurrentPages,
    config.scraping.defaultDelayMs
  );

  constructor(private scrapingService: BauScrapingService) {}

  async syncDegrees(): Promise<void> {
    await connect();
    const degrees = await this.scrapingService.fetchDegrees();
    await this.degreeRepo.upsertMany(degrees, DegreeMapper.toUpsert);
  }

  async syncColleges(): Promise<void> {
    await connect();
    const colleges = await this.scrapingService.fetchColleges();
    await this.collegeRepo.upsertMany(colleges, CollegeMapper.toUpsert);
  }

  async syncDepartments(): Promise<void> {
    await connect();
    const collegeIds = await this.collegeRepo.distinctIds("_id");
    for (const collegeId of collegeIds) {
      const depts = await this.scrapingService.fetchDepartments(collegeId);
      const mapper = (d: DepartmentApiResponse) => DepartmentMapper.toUpsert(d, collegeId);
      await this.departmentRepo.upsertMany(depts, mapper);
    }
  }

    async syncCoursesForCollege(collegeId: number): Promise<void> {
    await connect();
    const degrees = await this.degreeRepo.distinctIds("_id");
    const departments = await this.departmentRepo.distinctIds("_id", { college: collegeId });

    const tasks = [];
    for (const degree of degrees) {
        for (const dept of departments) {
        tasks.push(async () => {
            const pages = await this.scrapingService.getPagesCount(degree, collegeId, dept);
            for (let page = 1; page <= pages; page++) {
            const courses = await this.scrapingService.fetchCoursesPage(degree, collegeId, dept, page);
            const mapper = (c: CourseApiResponse) =>
                CourseMapper.toUpsert(c, collegeId, degree, dept);
            await this.courseRepo.upsertMany(courses, mapper);
            }
        });
        }
    }
    await this.rateLimiter.run(tasks);
    }

  async syncSectionsForCollege(collegeId: number): Promise<void> {
    await connect();
    const degrees = await this.degreeRepo.distinctIds("_id");
    const departments = await this.departmentRepo.distinctIds("_id", { college: collegeId });

    const tasks = [];
    for (const degree of degrees) {
      for (const dept of departments) {
        tasks.push(async () => {
          const pages = await this.scrapingService.getPagesCount(degree, collegeId, dept);
          for (let page = 1; page <= pages; page++) {
            const sections = await this.scrapingService.fetchSectionsPage(degree, collegeId, dept, page);
            const mapper = (s: SectionApiResponse) => ({
              updateOne: {
                filter: { courseNo: s.no, sectionNo: s.sectionNo },
                update: { $set: SectionMapper.toDbFormat(s) },
                upsert: true,
              },
            });
            await this.sectionRepo.upsertMany(sections, mapper);
          }
        });
      }
    }
    await this.rateLimiter.run(tasks);
  }

  async syncAllColleges(): Promise<void> {
    const collegeIds = await this.collegeRepo.distinctIds("_id");
    for (const collegeId of collegeIds) {
      console.log(`Syncing college ${collegeId}...`);
      await this.syncCoursesForCollege(collegeId);
      await this.syncSectionsForCollege(collegeId);
    }
  }
}