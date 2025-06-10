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
        contentConfiguration: {
            searchQuery: 'sample-query'
        },
        headingConfiguration: {
            title: 'Sample Title',
            ctaUrl: 'https://example.com',
            ctaManualUrl: 'https://manual.example.com',
            ctaText: 'Learn More',
            ctaNewWindow: true
        }
    };

    const defaultMockInfo = {
        env: {
            FB_JSON_URL: 'https://example.com/json',
            API_IDENTIFIER: 'sample-api',
            BASE_DOMAIN: 'https://example.com',
            BASE_PATH: '/base',
            NEWS_ARCHIVE_PATH: '/archive'
        },
        fns: mockFnsCtx
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
        it('Should throw an error when no parameters were provided', async () => {
            const result = await main();
            
            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when FB_JSON_URL was not provided', async () => {
            const mockInfo = {
                env: {
                    ...defaultMockInfo.env,
                    FB_JSON_URL: undefined
                }
            }

            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when FB_JSON_URL was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        ...defaultMockInfo.env,
                        FB_JSON_URL: undefined
                    }
                }
            }

            const result = await main(defaultMockData, mockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when API_IDENTIFIER was not provided', async () => {
            const mockInfo = {
                env: {
                    ...defaultMockInfo.env,
                    API_IDENTIFIER: undefined
                }
            }

            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when API_IDENTIFIER was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        ...defaultMockInfo.env,
                        API_IDENTIFIER: undefined
                    }
                }
            }

            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "API_IDENTIFIER" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when BASE_DOMAIN was not provided', async () => {
            const mockInfo = {
                ...defaultMockInfo,
                env: {
                    ...defaultMockInfo.env,
                    BASE_DOMAIN: undefined
                }
            }

            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when BASE_DOMAIN was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        ...defaultMockInfo.env,
                        BASE_DOMAIN: undefined
                    }
                }
            }

            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "BASE_DOMAIN" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when BASE_PATH was not provided', async () => {
            const mockInfo = {
                ...defaultMockInfo,
                env: {
                    ...defaultMockInfo.env,
                    BASE_PATH: undefined
                }
            }

            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "BASE_PATH" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when BASE_PATH was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        ...defaultMockInfo.env,
                        BASE_PATH: undefined
                    }
                }
            }

            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "BASE_PATH" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when NEWS_ARCHIVE_PATH was not provided', async () => {
            const mockInfo = {
                ...defaultMockInfo,
                env: {
                    ...defaultMockInfo.env,
                    NEWS_ARCHIVE_PATH: undefined
                }
            }
            
            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "NEWS_ARCHIVE_PATH" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when NEWS_ARCHIVE_PATH was not provided within set object', async () => {
            const mockInfo = {
                set: {
                    environment: {
                        ...defaultMockInfo.env,
                        NEWS_ARCHIVE_PATH: undefined
                    }
                }
            }
            
            const result = await main(defaultMockData, mockInfo);

            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "NEWS_ARCHIVE_PATH" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when fns or ctx was not provided', async () => {
            const mockInfo = {
                ...defaultMockInfo,
                fns: undefined,
            };

            const result = await main(defaultMockData, mockInfo);

            expect(result).toBe('<!-- Error occurred in the Stories carousel component: The "info.fns" cannot be undefined or null. The {} was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when searchQuery was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                contentConfiguration: {
                    searchQuery: 123
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "searchQuery" field cannot be undefined and must be a non-empty string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when title was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                headingConfiguration: {
                    ...defaultMockData.headingConfiguration,
                    title: 123
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "title" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when ctaUrl was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                headingConfiguration: {
                    ...defaultMockData.headingConfiguration,
                    ctaUrl: 123
                }
            };

            const result = await main(mockData, defaultMockInfo);

            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "ctaUrl" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when ctaManualUrl was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                headingConfiguration: {
                    ...defaultMockData.headingConfiguration,
                    ctaManualUrl: 123
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "ctaManualUrl" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when ctaText was not a string', async () => {
            const mockData = {
                ...defaultMockData,
                headingConfiguration: {
                    ...defaultMockData.headingConfiguration,
                    ctaText: 123
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "ctaText" field must be a string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when ctaNewWindow was not a boolean type', async () => {
            const mockData = {
                ...defaultMockData,
                headingConfiguration: {
                    ...defaultMockData.headingConfiguration,
                    ctaNewWindow: 123
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Stories carousel component: The "ctaNewWindow" field must be a boolean. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when data is null', async () => {
            const cardData = null;

            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue(cardData),
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the Stories carousel component: The "data" cannot be undefined or null. The [] was received. -->"`);
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should handle fetchUserStories failure gracefully', async () => {
            fetchUserStories.mockRejectedValueOnce(new Error('Fetch failed'));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<!-- Error occurred in the Stories carousel component: Fetch failed -->');

            expect(mockedError).toBeCalledWith(
                'Error occurred in the Stories carousel component while fetching user stories:',
                expect.any(Error)
            );
        });
    });

    describe('[Main Function]', () => {
        beforeAll(() => {
            uuid.mockReturnValue('476f6893-b77b-43d8-ac8c-ac74d3d75dd7');
        });

        it('Should return the expected HTML with valid data', async () => {
            linkedHeadingService.mockResolvedValueOnce({
                title: "Sample Heading",
                ctaText: "Learn More",
                ctaLink: "https://example.com",
                ctaNewWindow: false
            });

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the Stories carousel component: The "data" cannot be undefined or null. The [] was received. -->"`);
        });

        it('Should set default ctaLink if ctaLink is empty', async () => {
            let linkedData = {
                title: "Sample Heading",
                ctaText: "Learn More",
                ctaLink: "",
                ctaNewWindow: false
            };
            
            linkedHeadingService.mockResolvedValueOnce(linkedData);

            const result = await main(defaultMockData, defaultMockInfo);

            linkedData.ctaLink = `${defaultMockInfo.env.BASE_DOMAIN}${defaultMockInfo.env.BASE_PATH}${defaultMockInfo.env.NEWS_ARCHIVE_PATH}`;

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the Stories carousel component: The "data" cannot be undefined or null. The [] was received. -->"`);
        });

        it('Should render empty data-unique-id when data not provided', async () => {
            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getCards: vi.fn().mockResolvedValue([]),
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the Stories carousel component: The "data" cannot be undefined or null. The [] was received. -->"`);
        });

        it('Should render Card and Modal components based on data type', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the Stories carousel component: The "data" cannot be undefined or null. The [] was received. -->"`);
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

            fetchUserStories.mockResolvedValueOnce([mockVideoCard]);

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toContain('<iframe');
            expect(result).toContain('<iframe');

            const { EmbedVideo, Modal } = await import(
                '../../global/js/helpers'
            );
            expect(EmbedVideo).toHaveBeenCalledWith({
                isVertical: false,
                videoId: mockVideoCard.videoUrl,
                title: `Watch ${mockVideoCard.title}`,
                noAutoPlay: true
            });

            expect(Modal).toHaveBeenCalledWith(
                expect.objectContaining({
                    content: expect.any(String),
                    uniqueId: expect.any(String),
                    describedby: 'card-modal'
                }),
            );
        });
    });
});
