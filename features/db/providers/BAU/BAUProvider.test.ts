import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';
import { BAUProvider } from './BAUProvider';
import { BAUFetchProvider } from './BAUFetchProvider';

describe('BAUProvider', () => {
    let provider: BAUProvider;
    let fetchProviderMock: Mocked<BAUFetchProvider>;

    beforeEach(() => {
        // Mock the fetch provider methods
        fetchProviderMock = {
            fetchDegrees: vi.fn(),
            fetchColleges: vi.fn(),
            fetchDepartments: vi.fn(),
            fetchCourses: vi.fn(),
            fetchSections: vi.fn(),
        } as unknown as Mocked<BAUFetchProvider>;

        provider = new BAUProvider(fetchProviderMock);
    });

    describe('read methods', () => {
        it('getDegrees should throw not implemented', async () => {
            await expect(provider.getDegrees()).rejects.toThrow("Method not implemented.");
        });

        it('getColleges should throw not implemented', async () => {
            await expect(provider.getColleges()).rejects.toThrow("Method not implemented.");
        });

        it('getDepartments should throw not implemented', async () => {
            await expect(provider.getDepartments()).rejects.toThrow("Method not implemented.");
        });

        it('getCourses should throw not implemented', async () => {
            await expect(provider.getCourses()).rejects.toThrow("Method not implemented.");
        });

        it('getSections should throw not implemented', async () => {
            await expect(provider.getSections('testId')).rejects.toThrow("Method not implemented.");
        });
    });

    describe('sync methods', () => {
        it('syncDegrees should call fetchProvider.fetchDegrees', () => {
            provider.syncDegrees();
            expect(fetchProviderMock.fetchDegrees).toHaveBeenCalled();
        });

        it('syncColleges should call fetchProvider.fetchColleges', () => {
            provider.syncColleges();
            expect(fetchProviderMock.fetchColleges).toHaveBeenCalled();
        });

        it('syncDepartments should not throw error (currently empty implementation)', () => {
            expect(() => provider.syncDepartments()).not.toThrow();
        });

        it('syncCourses should not throw error (currently empty implementation)', () => {
            expect(() => provider.syncCourses()).not.toThrow();
        });

        it('syncSections should not throw error (currently empty implementation)', () => {
            expect(() => provider.syncSections()).not.toThrow();
        });

        it('syncAll should call all individual sync methods', () => {
            const syncDegreesSpy = vi.spyOn(provider, 'syncDegrees');
            const syncCollegesSpy = vi.spyOn(provider, 'syncColleges');
            const syncDepartmentsSpy = vi.spyOn(provider, 'syncDepartments');
            const syncCoursesSpy = vi.spyOn(provider, 'syncCourses');
            const syncSectionsSpy = vi.spyOn(provider, 'syncSections');

            provider.syncAll();

            expect(syncDegreesSpy).toHaveBeenCalled();
            expect(syncCollegesSpy).toHaveBeenCalled();
            expect(syncDepartmentsSpy).toHaveBeenCalled();
            expect(syncCoursesSpy).toHaveBeenCalled();
            expect(syncSectionsSpy).toHaveBeenCalled();
        });
    });
});
