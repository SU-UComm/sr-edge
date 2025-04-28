import { beforeEach, describe, expect, it, vi } from 'vitest';
import moduleToTest from './main';

const { main } = moduleToTest;

// Mock console.error to capture error messages
const mockedError = vi.fn();
console.error = mockedError;

// Mocked data used for successful data fetching
const mockHeroData = {
    title: 'Test Title',
    pubDateFormatted: 'April 2025',
    summary: 'Test Summary',
    topic: {
        asset_name: 'Test Topic',
        asset_url: 'https://example.com',
    },
    media: {
        featureImage: {
            url: 'https://example.com/image.jpg',
            alt: 'Image Alt Text',
        },
        featureVideo: {
            id: 'testVideoId',
        },
        caption: 'Test Caption',
        credit: 'Test Credit',
    },
};

// Mock external utility functions
vi.mock('../../global/js/utils', () => ({
    uuid: vi.fn(() => 'mock-uuid-1234'),
    basicHeroDataAdapter: vi.fn().mockImplementation(() => ({
        setBasicHeroService: vi.fn(),
        getBasicHeroData: vi.fn().mockResolvedValue(mockHeroData),
    })),
    matrixBasicHeroService: vi.fn(),
}));

describe('[Standalone Visual Hero]', () => {
    const defaultInfo = {
        env: {
            BASE_DOMAIN: 'https://example.com',
        },
        ctx: {
            assetId: '167010',
        },
    };

    beforeEach(async () => {
        vi.clearAllMocks();

        // Reset module mocks before each test
        const utils = await import('../../global/js/utils');
        utils.basicHeroDataAdapter.mockImplementation(() => ({
            setBasicHeroService: vi.fn(),
            getBasicHeroData: vi.fn().mockResolvedValue(mockHeroData),
        }));
        utils.uuid.mockImplementation(() => 'mock-uuid-1234');
    });

    describe('Error handling', () => {
        it('Should throw error when BASE_DOMAIN is missing', async () => {
            const result = await main({}, { env: {} });
            expect(result).toContain('<!-- Error in Standalone Visual Hero: BASE_DOMAIN is required');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should correctly use BASE_DOMAIN from info.set.environment if env is missing', async () => {
            const { basicHeroDataAdapter } = await import('../../global/js/utils');

            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValue(mockHeroData),
            }));

            const result = await main({}, {
                set: { environment: { BASE_DOMAIN: 'https://alternative-base.com' } },
                ctx: { assetId: '167010' },
            });

            expect(result).toContain('<section data-component="standalone-visual-hero"');
            expect(result).toContain('Test Title');
            expect(result).toContain('Test Summary');
            expect(result).toContain('https://example.com/image.jpg');
        });

        it('Should throw error if BASE_DOMAIN cannot be determined', async () => {
            const result = await main({}, { ctx: { assetId: '167010' } });
            expect(result).toContain('BASE_DOMAIN is required');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when heroData is invalid (null)', async () => {
            const { basicHeroDataAdapter } = await import('../../global/js/utils');

            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValue(null),
            }));

            const result = await main({}, defaultInfo);
            expect(result).toContain('<!-- Error fetching Standalone Visual Hero data: Invalid hero data. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when getBasicHeroData rejects', async () => {
            const { basicHeroDataAdapter } = await import('../../global/js/utils');

            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockRejectedValue(new Error('Network error')),
            }));

            const result = await main({}, defaultInfo);
            expect(result).toContain('<!-- Error fetching Standalone Visual Hero data: Network error -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw error when assetId is missing', async () => {
            const result = await main({}, {
                env: { BASE_DOMAIN: 'https://example.com' },
                ctx: { assetId: '' },
            });

            expect(result).toContain('<!-- Error in Standalone Visual Hero: AssetId is required');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('Data fetching and rendering', () => {
        it('Should return HTML when data is correct', async () => {
            const result = await main({}, defaultInfo);
            expect(result).toContain('<section data-component="standalone-visual-hero"');
            expect(result).toContain('Test Title');
            expect(result).toContain('Test Summary');
            expect(result).toContain('https://example.com/image.jpg');
        });

        it('Should set summary to empty string when not provided', async () => {
            const { basicHeroDataAdapter } = await import('../../global/js/utils');

            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValue({
                    ...mockHeroData,
                    summary: '',
                }),
            }));

            const result = await main({}, defaultInfo);

            expect(result).not.toContain('Test Summary');
            expect(result).not.toContain('<p>');
        });
    });

    describe('Media type detection', () => {
        it('Should set mediaType to video if featureVideo exists', async () => {
            const { basicHeroDataAdapter, uuid } = await import('../../global/js/utils');

            uuid.mockImplementation(() => 'mock-uuid-1234');

            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValue({
                    title: 'Test Title',
                    pubDateFormatted: 'April 2024',
                    summary: 'A short summary here.',
                    topic: {
                        asset_name: 'Test Topic',
                        asset_url: 'https://example.com/topic',
                    },
                    media: {
                        featureVideo: { id: 'video-12345' },
                        featureImage: {
                            url: 'https://example.com/thumb.jpg',
                            alt: 'Thumb Alt',
                        },
                        caption: 'Test caption',
                        credit: 'Test credit',
                    },
                }),
            }));

            const result = await main({}, defaultInfo);

            expect(result).toContain('data-modal-id="mock-uuid-1234"');
            expect(result).toContain('Watch Test Title');
        });

        it('Should set mediaType to image if featureImage exists and no featureVideo', async () => {
            const { basicHeroDataAdapter, uuid } = await import('../../global/js/utils');

            uuid.mockImplementation(() => 'mock-uuid-5678');

            basicHeroDataAdapter.mockImplementation(() => ({
                setBasicHeroService: vi.fn(),
                getBasicHeroData: vi.fn().mockResolvedValue({
                    title: 'Image Only Title',
                    pubDateFormatted: 'May 2025',
                    summary: 'Image summary here.',
                    topic: {
                        asset_name: 'Image Topic',
                        asset_url: 'https://example.com/image-topic',
                    },
                    media: {
                        featureImage: {
                            url: 'https://example.com/image-only.jpg',
                            alt: 'Image only alt text',
                        },
                        caption: 'Image caption',
                        credit: 'Image credit',
                    },
                }),
            }));

            const result = await main({}, {
                env: { BASE_DOMAIN: 'https://example.com' },
                ctx: { assetId: 'some-id' },
            });

            expect(result).toContain('https://example.com/image-only.jpg');
            expect(result).toContain('Image Only Title');
        });
    });
});
