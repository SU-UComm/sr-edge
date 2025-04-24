import { beforeEach, describe, expect, it, vi } from 'vitest';
import { basicHeroDataAdapter } from '../../global/js/utils';
import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

const mockedFetch = {
    title: 'Leadership test title',
    pubDateFormatted: 'April 20th, 2025',
    topic: {
        asset_name: 'Leadership & Impact',
        asset_url: 'https://example.com/topic',
    },
};

vi.mock('../../global/js/utils', () => ({
    matrixBasicHeroService: vi.fn(),
    basicHeroDataAdapter: vi.fn().mockImplementation(() => ({
        setBasicHeroService: vi.fn(),
        getBasicHeroData: vi.fn().mockResolvedValue(mockedFetch),
    })),
}));

describe('[Leadership Hero]', () => {
    const defaultMockData = {};
    const defaultMockInfo = {
        env: {
            BASE_DOMAIN: 'https://example.com/api',
        },
        ctx: {
            assetId: '162603',
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // General validation and error handling
    describe('[Error Handling]', () => {
        it('Should error when no parameters provided', async () => {
            const result = await main();
            expect(result).toContain('<!-- Error occurred in the Leadership Hero component:');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when BASE_DOMAIN is missing from env', async () => {
            const result = await main({}, { env: { BASE_DOMAIN: undefined } });
            expect(result).toContain('BASE_DOMAIN');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when BASE_DOMAIN is missing from set.environment', async () => {
            const result = await main({}, { set: { environment: { BASE_DOMAIN: undefined } } });
            expect(result).toContain('BASE_DOMAIN');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should error if assetId is missing', async () => {
            const result = await main(defaultMockData, { env: defaultMockInfo.env, ctx: { assetId: '' } });            expect(result).toContain('assetId');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Data Fetching]', () => {
        it('Should handle fetch rejection (e.g. network error)', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockRejectedValueOnce(new Error('Network Error')),
            }));

            const result = await main(defaultMockData, defaultMockInfo);
            expect(result).toContain('Failed to fetch Leadership Hero data: Network Error');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle null heroData', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce(null),
            }));

            const result = await main(defaultMockData, defaultMockInfo);
            expect(result).toContain('heroData is missing or not an object');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle undefined heroData', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce(undefined),
            }));

            const result = await main(defaultMockData, defaultMockInfo);
            expect(result).toContain('heroData is missing or not an object');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle non-object heroData (e.g. string)', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce('invalid'),
            }));

            const result = await main(defaultMockData, defaultMockInfo);
            expect(result).toContain('heroData is missing or not an object');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    // Rendering with different data shapes to ensure the component can handle various scenarios.
    describe('[Main Function]', () => {
        it('Should render without topic', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    title: 'Leadership without topic',
                    pubDateFormatted: 'April 20th, 2025',
                }),
            }));

            const result = await main(defaultMockData, defaultMockInfo);
            expect(result).toContain('Leadership without topic');
            expect(result).not.toContain('href=');
        });

        it('Should render when topic.asset_url is missing', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    title: 'Only topic name',
                    pubDateFormatted: 'April 23rd, 2025',
                    topic: {
                        asset_name: 'Name only',
                    },
                }),
            }));

            const result = await main(defaultMockData, defaultMockInfo);
            expect(result).toContain('Name only');
            expect(result).not.toContain('href=');
        });
    });

    // Field validation inside heroData
    describe('[Field Validation]', () => {
        it('Should error if title is missing', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    pubDateFormatted: 'April 20th, 2025',
                    topic: mockedFetch.topic,
                }),
            }));

            const result = await main(defaultMockData, defaultMockInfo);
            expect(result).toContain('The "title" must be a non-empty string');
        });

        it('Should error if pubDateFormatted is not a string', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    title: 'Valid title',
                    pubDateFormatted: 123,
                    topic: {},
                }),
            }));

            const result = await main(defaultMockData, defaultMockInfo);
            expect(result).toContain('The "pubDateFormatted" must be a string');
        });

        it('Should error if topic is not an object', async () => {
            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValueOnce({
                    title: 'Valid title',
                    pubDateFormatted: 'April 23rd, 2025',
                    topic: 123,
                }),
            }));

            const result = await main(defaultMockData, defaultMockInfo);
            expect(result).toContain('The "topic" must be an object');
        });
    });
});
