import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { cardDataAdapter, linkedHeadingService, uuid } from "../../global/js/utils";
import moduleToTest from './main';
import { fetchUserStories } from '../../global/js/utils/fetchUserStories';

// Mocking the fetchUserStories function
vi.mock('../../global/js/utils/fetchUserStories', () => ({
    fetchUserStories: vi.fn(),
}));

// Main utils and helpers
vi.mock('../../global/js/utils', () => ({
    uuid: vi.fn(),
    cardDataAdapter: vi.fn().mockImplementation(() => ({
        setCardService: vi.fn(),
        getCards: vi.fn().mockResolvedValue([
            {
                title: 'Sample Title',
                description: ['Sample Description'],
                liveUrl: 'https://example.com',
                imageUrl: ['https://picsum.photos/400/400'],
                imageAlt: ['Sample Image Alt'],
                taxonomy: ['Sample Taxonomy'],
                taxonomyUrl: ['https://example.com/category'],
                type: 'News',
                date: Date.now(),
                taxonomyFeaturedUnitLandingPageUrl: [
                    'https://example.com/unit',
                ],
                taxonomyFeaturedUnitText: ['Sample Unit'],
                isTeaser: ['false'],
            },
        ]),
    })),
    funnelbackCardService: vi.fn(),
    linkedHeadingService: vi.fn().mockResolvedValue({
        title: 'Sample Heading',
        ctaText: 'Learn More',
        ctaLink: 'https://example.com',
        ctaNewWindow: false
    }),
    faIcon: {
        "ChevronRight": [`<svg class="su-fill-transparent su-stroke-current" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden=""><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`],
        "CirclePlay": [`<svg class="su-fill-transparent su-stroke-current" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden=""><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`]
    }
}));

vi.mock('../../global/js/helpers', () => ({
    LinkedHeading: vi
        .fn()
        .mockReturnValue('<div class="linked-heading">Linked Heading</div>'),
    Card: vi
        .fn()
        .mockImplementation(({ data }) => `<article>${data?.title}</article>`),
    Modal: vi.fn().mockImplementation(({ content }) => content),
    EmbedVideo: vi.fn().mockReturnValue('<iframe></iframe>'),
    Carousel: vi.fn().mockImplementation(({ slides }) => slides),
}));

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

describe('[Stories Carousel]', () => {
    const mockFnsCtx = { resolveUri: vi.fn() };

    const defaultMockData = {
        "headingConfiguration": {
            "title": "Read next",
            "ctaText": "View all",
            "ctaUrl": "matrix-asset://stanfordNews/141464",
            "ctaNewWindow": false
        },
        "contentConfiguration": {
            "searchQuery": "?collection=sug~sp-stanford-report-search&profile=stanford-report-push-search&log=false&query=!nullquery&meta_taxonomyAudienceText="
        }
    };

    const defaultMockInfo = {
        env: {
            FB_JSON_URL: 'https://news.stanford.edu/_api/fb/query',
            API_IDENTIFIER: 'sample-api',
            BASE_DOMAIN: 'https://news.stanford.edu/',
            BASE_PATH: '/base',
            NEWS_ARCHIVE_PATH: '/archive'
        },
        fns: mockFnsCtx,
        ctx: {
            assetId: 169707
        }
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('[Main Function]', () => {
        it('Should limit the number of cards to MAX_CARDS if too many are returned', async () => {
            const mockCards = new Array(10).fill(null).map((_, i) => ({
                title: `Title ${i + 1}`,
                description: [`Description ${i + 1}`],
                liveUrl: `https://example.com/${i + 1}`,
                imageUrl: [`https://picsum.photos/400/400?${i + 1}`],
                imageAlt: [`Alt ${i + 1}`],
                taxonomy: [`Category ${i + 1}`],
                taxonomyUrl: [`https://example.com/category${i + 1}`],
                type: 'News',
                date: Date.now(),
                taxonomyFeaturedUnitLandingPageUrl: [
                    `https://example.com/unit${i + 1}`,
                ],
                taxonomyFeaturedUnitText: [`Unit ${i + 1}`],
                isTeaser: ['true'],
            }));

            fetchUserStories.mockResolvedValueOnce(mockCards);

            const result = await main(defaultMockData, defaultMockInfo);

            const matches = result.match(/<div class="swiper-slide">/g) || [];
            expect(matches.length).toBe(6);
        });
    });
    
    describe('[Error Handling]', () => {        
        
        it('Should throw an error when data is null', async () => {
            const cardData = null;

            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue(cardData),
            }));

            await expect(main(defaultMockData, defaultMockInfo)).rejects.toThrow(`Error occurred in the Stories carousel component: The "data" cannot be undefined or null. The [] was received.`);
        });

        it('Should handle fetchUserStories failure gracefully', async () => {
            fetchUserStories.mockRejectedValueOnce(new Error('Fetch failed'));

            await expect(main(defaultMockData, defaultMockInfo)).rejects.toThrow(`Error occurred in the Stories carousel component while fetching user stories: Fetch failed`);
        });
    });

    describe('[Main Function]', () => {
        beforeAll(() => {
            uuid.mockReturnValue('476f6893-b77b-43d8-ac8c-ac74d3d75dd7');
        });

        it('Should return the expected HTML with valid data', async () => {
            // Mock fetchUserStories to return some data
            fetchUserStories.mockResolvedValueOnce([
                {
                    title: 'Test Story',
                    description: ['Test description'],
                    liveUrl: 'https://example.com/story',
                    imageUrl: ['https://example.com/image.jpg'],
                    imageAlt: ['Alt text'],
                    taxonomy: ['Category'],
                    taxonomyUrl: ['https://example.com/category'],
                    type: 'News',
                    date: Date.now(),
                    taxonomyFeaturedUnitLandingPageUrl: ['https://example.com/unit'],
                    taxonomyFeaturedUnitText: ['Unit'],
                    isTeaser: ['false']
                }
            ]);

            const result = await main(defaultMockData, defaultMockInfo);
            expect(result).toContain('data-component="stories-carousel"');
            expect(result).toContain('Test Story');
        });

        it('Should set default ctaLink if ctaLink is empty', async () => {
            let linkedData = {
                title: "Sample Heading",
                ctaText: "Learn More",
                ctaLink: "",
                ctaNewWindow: false
            };
            
            linkedHeadingService.mockResolvedValueOnce(linkedData);

            // Mock fetchUserStories to return some data
            fetchUserStories.mockResolvedValueOnce([
                {
                    title: 'Test Story',
                    description: ['Test description'],
                    liveUrl: 'https://example.com/story',
                    imageUrl: ['https://example.com/image.jpg'],
                    imageAlt: ['Alt text'],
                    taxonomy: ['Category'],
                    taxonomyUrl: ['https://example.com/category'],
                    type: 'News',
                    date: Date.now(),
                    taxonomyFeaturedUnitLandingPageUrl: ['https://example.com/unit'],
                    taxonomyFeaturedUnitText: ['Unit'],
                    isTeaser: ['false']
                }
            ]);

            const result = await main({...defaultMockData, headingConfiguration: linkedData}, defaultMockInfo);

            linkedData.ctaLink = `${defaultMockInfo.env.BASE_DOMAIN}${defaultMockInfo.env.BASE_PATH}${defaultMockInfo.env.NEWS_ARCHIVE_PATH}`;
            linkedData.ctaLink = linkedData.ctaLink.replace(/([^:])\/\//g, '$1/');

            expect(result).toContain('data-component="stories-carousel"');
            expect(result).toContain('Test Story');
            expect(result).toContain(linkedData.ctaLink);
        });

        it('Should render Modal and EmbedVideo if card type is Video', async () => {
            const mockVideoCard = {
                title: 'Video Test Title',
                description: ['Test description'],
                liveUrl: 'https://example.com/video',
                imageUrl: ['https://example.com/image.jpg'],
                imageAlt: ['Alt text'],
                taxonomy: ['Category'],
                taxonomyUrl: ['https://example.com/category'],
                type: 'Video',
                videoUrl: 'https://example.com/video.mp4',
                date: Date.now(),
                taxonomyFeaturedUnitLandingPageUrl: [
                    'https://example.com/unit',
                ],
                taxonomyFeaturedUnitText: ['Unit'],
                isTeaser: ['false']
            };

            const mockVideoData = {
                "headingConfiguration": {
                    "title": "Read next",
                    "ctaText": "View all",
                    "ctaUrl": "matrix-asset://stanfordNews/141464",
                    "ctaNewWindow": false
                },
                "contentConfiguration": {
                    "searchQuery": "?collection=sug~sp-stanford-report-search&profile=stanford-report-push-search&log=false&query=!nullquery&meta_taxonomyAudienceText=Video"
                }
            };

            fetchUserStories.mockResolvedValueOnce([mockVideoCard]);

            const result = await main(mockVideoData, defaultMockInfo);

            expect(result).toContain('<iframe');
            expect(result).toContain('<iframe');
            expect(result).toContain("card-modal");
        });
    });
});
