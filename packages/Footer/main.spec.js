/**
 * @jest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FetchAdapter } from '../../global/js/utils';
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

vi.mock('../../global/js/utils', () => ({
    FetchAdapter: vi.fn().mockImplementation(() => ({
        url: '',
        fetch: vi.fn().mockResolvedValue({
            site: {
                url: 'https://example.com',
                mission: 'Test mission',
                logoFooter: {
                    url: 'https://example.com/logo.png',
                    alt: 'Logo alt text'
                },
                copyright: '2025 Stanford University'
            },
            navigation: {
                major: [],
                minor: [],
                contacts: [],
                external: [],
                footerPrimary: [],
                footerSecondary: []
            }
        })
    }))
}));

describe('[Footer]', () => {
    const mockFnsCtx = { resolveUri: vi.fn() };
    
    const defaultMockData = {
        dataUrl: 'https://example.com/data.json'
    };

    const defaultMockInfo = {
        ctx: mockFnsCtx
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters were provided', async () => {
            const result = await main();
            
            expect(result).toContain('<!-- Error occurred in the Footer component: The "info.ctx" cannot be undefined or null. The {} was received.');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fns was not provided', async () => {
            const mockInfo = {};
            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Footer component: The "info.ctx" cannot be undefined or null. The {} was received.');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when dataUrl was not provided', async () => {
            const mockData = {};
            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Footer component: The "dataUrl" field cannot be undefined');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        it('Should return the expected HTML with valid data', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('footer');
            expect(result).toContain('Test mission');
            expect(result).toContain('2025 Stanford University');
        });

        it('Should call FetchAdapter with correct parameters', async () => {
            await main(defaultMockData, defaultMockInfo);

            expect(FetchAdapter).toHaveBeenCalled();
            const fetchAdapterInstance = FetchAdapter.mock.results[0].value;
            expect(fetchAdapterInstance.url).toBe('https://example.com/data.json');
        });
    });

    describe('[Edge Cases]', () => {
        it('Should throw error when fetch for footer data will fail', async () => {
            FetchAdapter.mockImplementation(() => ({
                fetch: vi.fn().mockRejectedValueOnce(new Error('Network Error'))
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Footer component: Error parsing footer data JSON response: Network Error -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when fetch for footer data will not return object', async () => {
            FetchAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                fetch: vi.fn().mockResolvedValueOnce('test')
            }));
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toBe('<!-- Error occurred in the Footer component: Error parsing footer data JSON response: Invalid API response: siteData is missing or not an object. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });
});
