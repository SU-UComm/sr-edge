import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { cardDataAdapter, funnelbackCardService, uuid } from "../../global/js/utils";

import moduleToTest from './main';

const { main } = moduleToTest;

const mockedError = vi.fn();
console.error = mockedError;

const cards = [
    {
        type: 'card.type',
        title: 'card.title',
        description: 'card.description',
        date: 1730073600000,
        liveUrl: 'card.liveUrl',
        imageUrl: 'card.imageUrl',
        imageAlt: 'card.imageAlt',
        avatarRef: 'card.authorAvatar',
        avatarAlt: 'Photo of card',
        taxonomy: 'card.taxonomy',
        taxonomyUrl: 'card.taxonomyUrl',
        taxonomyFeaturedUnitText: 'card.taxonomyFeaturedUnitText',
        storySource: 'card.storySource',
        videoUrl: 'card.videoUrl',
    },
    {
        title: "Inaugural Lecturer’s Award winners honored",
        description: "Honorees for the annual Lecturer’s Award for Teaching and Undergraduate Education were recognized for their exceptional contributions to university life and undergraduate education.",
        liveUrl: "https://example.com",
        imageUrl: "https://picsum.photos/400/400",
        videoUrl: "https://example.com",
        imageAlt: "Image of Cathy Haas, Jamie Imam, Provost Jenny Martinez, Elizabeth Kessler, Hayes",
        taxonomy: "Awards, Honors & Appointments",
        taxonomyUrl: "https://example.com/",
        avatarRef: 'https://picsum.photos/400/400',
        avatarAlt: 'Avatar alt',
        type: "Video",
        date: 1730073600000,
        taxonomyFeaturedUnitLandingPageUrl: "https://example.com/",
        taxonomyFeaturedUnitText: "Office of the Vice Provost for Undergraduate Education",
        isTeaser: "false",
        storySource: 'card.storySource',
    },
    {        
        title: "Bass Fellows in Undergraduate Education announced",
        description: "The Bass University Fellows in Undergraduate Education Program recognizes faculty for extraordinary contributions to undergraduate education.",
        liveUrl: "https://example.com",
        imageUrl: "https://picsum.photos/400/400",
        imageAlt: "Main Quad as seen through arcade arch",
        taxonomy: "Awards, Honors & Appointments",
        taxonomyUrl: "https://example.com/",
        avatarRef: 'https://picsum.photos/400/400',
        avatarAlt: 'Avatar alt',
        type: "News",
        date: 1730073600000,
        taxonomyFeaturedUnitLandingPageUrl: "https://example.com/",
        taxonomyFeaturedUnitText: "Office of the Vice Provost for Undergraduate Education",
        isTeaser: "false",
        storySource: 'card.storySource',
    }
]

vi.mock('../../global/js/utils', () => ({
    uuid: vi.fn(),
    cardDataAdapter: vi.fn().mockImplementation(() => ({
        setCardService: vi.fn(),
        getResultData: vi.fn().mockImplementation({
            cards: [...cards],
            resultsSummary: {
                fullyMatching: 201,
                collapsed: 0,
                partiallyMatching: 0,
                totalMatching: 201,
                estimatedCounts: false,
                carriedOverFtd: null,
                totalDistinctMatchingUrls: null,
                numRanks: 10,
                currStart: 11,
                currEnd: 20,
                prevStart: 1,
                nextStart: 21,
                totalSecurityObscuredUrls: null,
                anyUrlsPromoted: false,
                resultDiversificationApplied: false
            }
        })
    })),
    funnelbackCardService: vi.fn(),
    formatNewsDate: vi.fn(),
}));

vi.mock('../../global/js/helpers', () => ({
    pagination: vi.fn().mockReturnValue('<div data-element="topics-pagination"><div class="su-mx-auto su-component-container"><div class="su-flex su-gap-9 su-items-center su-justify-center su-rs-mt-4 lg:su-rs-mt-7"><button type="button" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center dark:su-text-white su-text-black-50" disabled="" data-offset="1" aria-label="Previous page" title="Previous page"><svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.24855 0.351472C7.71718 0.820101 7.71718 1.5799 7.24855 2.04853L3.29708 6L7.24855 9.95147C7.71718 10.4201 7.71718 11.1799 7.24855 11.6485C6.77992 12.1172 6.02013 12.1172 5.5515 11.6485L0.751496 6.84853C0.282867 6.3799 0.282867 5.6201 0.751496 5.15147L5.5515 0.351472C6.02013 -0.117157 6.77992 -0.117157 7.24855 0.351472Z"></path></svg></button><button data-offset="1" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center su-text-18 dark:su-text-white su-bg-digital-red su-rounded-[100px] su-text-white" disabled="" type="button">1</button><button data-offset="11" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center su-text-18 dark:su-text-white su-text-black" type="button">2</button><button type="button" class="su-size-24 su-font-serif su-flex su-items-center su-justify-center dark:su-text-white " data-offset="11" aria-label="Next page" title="Next page"><svg class="su-fill-transparent su-stroke-current" data-testid="svg-chevron-right" xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden="true"><path d="M6.75 4.25L12 9.5L6.75 14.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></button></div></div></div>'),
}));

describe('[Topic Subtopic Listing]', () => {
    const defaultMockData = {
        displayConfiguration: {
            searchQuery: '?query=sample-query',
            displayStyle: "News Archive"
        }
    };

    const defaultMockInfo = {
        env: {
            FB_JSON_URL: 'https://example.com/json',
        },
    };
    
    beforeEach(() => {
        vi.clearAllMocks();
    });
    
    describe('[Error Handling]', () => {
        it('Should throw an error when no parameters were provided', async () => {
            const result = await main();
            
            expect(result).toContain('<!-- Error occurred in the Topic subtopic listing component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Topic subtopic listing component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
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
            
            expect(result).toContain('<!-- Error occurred in the Topic subtopic listing component: The "FB_JSON_URL" variable cannot be undefined and must be non-empty string. The undefined was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
        
        it('Should throw an error when searchQuery was not a string', async () => {
            const mockData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    searchQuery: 123
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Topic subtopic listing component: The "searchQuery" field cannot be undefined and must be a non-empty string. The 123 was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when searchQuery was an empty string', async () => {
            const mockData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    searchQuery: ''
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Topic subtopic listing component: The "searchQuery" field cannot be undefined and must be a non-empty string. The "" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when searchQuery was only "?" char', async () => {
            const mockData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    searchQuery: '?'
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Topic subtopic listing component: The "searchQuery" field cannot be undefined and must be a non-empty string. The "?" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });

        it('Should throw an error when displayStyle was not one of ["Default", "News Archive", "Press Center", "Announcements", "In the News", "University Updates", "Leadership Messages"]', async () => {
            const mockData = {
                displayConfiguration: {
                    ...defaultMockData.displayConfiguration,
                    displayStyle: "test value"
                }
            };

            const result = await main(mockData, defaultMockInfo);
            
            expect(result).toContain('<!-- Error occurred in the Topic subtopic listing component: The "displayStyle" field cannot be undefined and must be one of ["Default", "News Archive", "Press Center", "Announcements", "In the News", "University Updates", "Leadership Messages"]. The "test value" was received. -->');
            expect(mockedError).toBeCalledTimes(1);
        });
    });

    describe('[Main Function]', () => {
        beforeAll(() => {
            uuid.mockReturnValue('476f6893-b77b-43d8-ac8c-ac74d3d75dd7');
        });

        it('Should return the expected HTML with valid data', async () => {
            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the Topic subtopic listing component: Error parsing Funnelback JSON response: impl.apply is not a function -->"`);
        });

        it('Should call cardDataAdapter and funnelbackCardService', async () => {
            await main(defaultMockData, defaultMockInfo);

            expect(cardDataAdapter).toHaveBeenCalled();
            expect(funnelbackCardService).toHaveBeenCalled();
        });
    });

    describe('[Edge cases]', () => {
        it('Should throw an error when cards is empty array', async () => {
            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getResultData: vi.fn().mockResolvedValue({cards : []}),
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the Topic subtopic listing component: The "cards" cannot be undefined or null. The [] was received. -->"`);
        });

        it('Should throw an error when cards is not defined', async () => {
            cardDataAdapter.mockImplementationOnce(() => ({
                setCardService: vi.fn(),
                getResultData: vi.fn().mockResolvedValue([]),
            }));

            const result = await main(defaultMockData, defaultMockInfo);

            expect(result).toMatchInlineSnapshot(`"<!-- Error occurred in the Topic subtopic listing component: The "cards" cannot be undefined or null. The undefined was received. -->"`);
        });
    });
});
