import { describe, beforeEach, it, expect, vi } from 'vitest';
import { BAUFetchProvider } from './BAUFetchProvider';

describe('BAUFetchProvider', () => {
    let provider: BAUFetchProvider;

    beforeEach(() => {
        provider = new BAUFetchProvider();
        vi.spyOn(provider, 'request');
    });

    it('fetchDegrees should call request with getDegrees and return correct data', async () => {
        const mockData = [{ id: '1', name: 'Degree 1' }];
        vi.mocked(provider.request).mockResolvedValueOnce(mockData);

        const result = await provider.fetchDegrees();
        expect(provider.request).toHaveBeenCalledWith("getDegrees");
        expect(result).toEqual(mockData);
    });

    it('fetchColleges should call request with getColleges and return correct data', async () => {
        const mockData = [{ id: '2', name: 'College 1' }];
        vi.mocked(provider.request).mockResolvedValueOnce(mockData);

        const result = await provider.fetchColleges();
        expect(provider.request).toHaveBeenCalledWith("getColleges");
        expect(result).toEqual(mockData);
    });

    it('fetchDepartments should call request with getDepartments and collegeId and return correct data', async () => {
        const mockData = [{ id: '3', name: 'Department 1' }];
        vi.mocked(provider.request).mockResolvedValueOnce(mockData);

        const result = await provider.fetchDepartments('12');
        expect(provider.request).toHaveBeenCalledWith("getDepartments", [12]);
        expect(result).toEqual(mockData);
    });

    it('fetchCourses should call request with getCourses and ids and return correct data', async () => {
        const mockData = [{ no: 'C101', name: 'Course 1', hours: '3' }];
        vi.mocked(provider.request).mockResolvedValueOnce(mockData);

        const result = await provider.fetchCourses('1', '2', '3');
        expect(provider.request).toHaveBeenCalledWith("getCourses", [1, 2, 3]);
        expect(result).toEqual(mockData);
    });

    it('fetchSections should call request with getCourses and all ids and return correct data', async () => {
        const mockData = [{ name: 'Section 1', no: '1', status: 'Active', rooms: 'R1', times: 'T1', lecturers: 'L1', sectionNo: '1' }];
        vi.mocked(provider.request).mockResolvedValueOnce(mockData);

        const result = await provider.fetchSections('1', '2', '3');
        expect(provider.request).toHaveBeenCalledWith("getCourses", [1, 2, 3]);
        expect(result).toEqual(mockData);
    });
});
