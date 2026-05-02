import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest';
import { BAUFetchProvider } from './BAUFetchProvider';
import { logger } from '@/lib/utils/logger';

// Mock the logger to prevent expected errors from polluting the test output
vi.mock('@/lib/utils/logger', () => ({
    logger: {
        error: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        debug: vi.fn(),
    }
}));

describe('BAUFetchProvider', () => {
    let provider: BAUFetchProvider;

    beforeEach(() => {
        provider = new BAUFetchProvider();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('fetch* methods mapping', () => {
        beforeEach(() => {
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

    describe('request method (network logic)', () => {
        let globalFetchMock: ReturnType<typeof vi.fn>;

        beforeEach(() => {
            globalFetchMock = vi.fn();
            vi.stubGlobal('fetch', globalFetchMock);
        });

        afterEach(() => {
            vi.unstubAllGlobals();
        });

        it('should make a successful POST request with correctly formatted body and headers', async () => {
            const mockResponseData = { success: true };
            globalFetchMock.mockResolvedValueOnce({
                ok: true,
                text: () => Promise.resolve(JSON.stringify(mockResponseData))
            });

            const result = await provider.request('testMethod', [10, 20]);

            expect(globalFetchMock).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockResponseData);

            const [url, options] = globalFetchMock.mock.calls[0];
            expect(url).toBe("https://app2.bau.edu.jo:7799/courses/actions/rmiMethod");
            expect(options.method).toBe("POST");
            
            // Check headers
            expect(options.headers).toHaveProperty("User-Agent");
            expect(options.headers["content-type"]).toBe("application/x-www-form-urlencoded");

            // Check body formatting
            const body = options.body as URLSearchParams;
            expect(body.get('method')).toBe('testMethod');
            expect(body.get('paramsCount')).toBe('2');
            expect(body.get('param0')).toBe('10');
            expect(body.get('param1')).toBe('20');
        });

        it('should replace single quotes with double quotes before parsing JSON', async () => {
            // Malformed JSON with single quotes instead of double quotes
            globalFetchMock.mockResolvedValueOnce({
                ok: true,
                text: () => Promise.resolve("{'key': 'value'}") 
            });

            const result = await provider.request('testMethod');
            expect(result).toEqual({ key: 'value' });
        });

        it('should log an error and throw if the JSON is invalid', async () => {
            globalFetchMock.mockResolvedValueOnce({
                ok: true,
                text: () => Promise.resolve("not valid json")
            });

            await expect(provider.request('testMethod')).rejects.toThrow("Invalid JSON from API");
            expect(logger.error).toHaveBeenCalledWith("Failed to parse API response", expect.any(Object));
        });

        it('should throw an error if the API response is not ok', async () => {
            vi.useFakeTimers();
            globalFetchMock.mockResolvedValue({
                ok: false,
                status: 500
            });

            const expectPromise = expect(provider.request('testMethod')).rejects.toThrow("API responded with status 500");
            await vi.runAllTimersAsync();
            await expectPromise;
            
            vi.useRealTimers();
        });

        it('should retry on failure and eventually return data', async () => {
            // Use fake timers to bypass the retry delays instantly
            vi.useFakeTimers();

            // Fail first time
            globalFetchMock.mockRejectedValueOnce(new Error("Network Error"));
            // Succeed second time
            globalFetchMock.mockResolvedValueOnce({
                ok: true,
                text: () => Promise.resolve('{"success": true}')
            });

            // Start the request without awaiting it yet
            const requestPromise = provider.request('testMethod');
            
            // Fast forward timers to trigger the retry delay
            await vi.runAllTimersAsync();

            const result = await requestPromise;

            expect(globalFetchMock).toHaveBeenCalledTimes(2);
            expect(result).toEqual({ success: true });

            vi.useRealTimers();
        });

        it('should pass an AbortSignal to fetch and trigger it on timeout', async () => {
            vi.useFakeTimers();
            
            globalFetchMock.mockImplementation(async (url, options) => {
                return new Promise((resolve, reject) => {
                    const abortHandler = () => reject(new Error("AbortError"));
                    if (options.signal.aborted) {
                        return abortHandler();
                    }
                    options.signal.addEventListener('abort', abortHandler);
                });
            });

            const expectPromise = expect(provider.request('testMethod')).rejects.toThrow("AbortError");
            
            // Fast forward timers to exhaust all retries and their timeouts
            await vi.runAllTimersAsync();
            await expectPromise;

            vi.useRealTimers();
        });
    });
});
