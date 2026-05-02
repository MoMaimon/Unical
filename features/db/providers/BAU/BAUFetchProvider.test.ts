import { describe, beforeEach, it, expect } from 'vitest';
import { BAUFetchProvider } from './BAUFetchProvider';

describe('BAUFetchProvider', () => {
    let provider: BAUFetchProvider;

    beforeEach(() => {
        provider = new BAUFetchProvider();
    });

    it('fetchDegrees should throw not implemented', () => {
        expect(() => provider.fetchDegrees()).toThrow("Method not implemented.");
    });

    it('fetchColleges should throw not implemented', () => {
        expect(() => provider.fetchColleges()).toThrow("Method not implemented.");
    });

    it('fetchDepartments should throw not implemented', () => {
        expect(() => provider.fetchDepartments('collegeId')).toThrow("Method not implemented.");
    });

    it('fetchCourses should throw not implemented', () => {
        expect(() => provider.fetchCourses('degreeId', 'collegeId', 'departmentId')).toThrow("Method not implemented.");
    });

    it('fetchSections should throw not implemented', () => {
        expect(() => provider.fetchSections('degreeId', 'collegeId', 'departmentId', 'courseId')).toThrow("Method not implemented.");
    });
});
